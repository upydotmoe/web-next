globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, lazyEventHandler, createApp, createRouter } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash, joinURL } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';
import { fileURLToPath as fileURLToPath$1 } from 'node:url';
import { createIPX, createIPXMiddleware } from 'ipx';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://api.upy.moe","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"upy11.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      const url = event.req.originalUrl || event.req.url;
      const friendlyName = decodeURI(parseURL(url).pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const script = "const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _02kC61PisY = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _02kC61PisY
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.req.url?.startsWith("/__nuxt_error");
  let html = !isErrorPage ? await $fetch(withQuery("/__nuxt_error", errorObject)).catch(() => null) : null;
  if (!html) {
    const { template } = await import('./error-500.mjs');
    html = template(errorObject);
  }
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/200.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d7-j6OszUnkNK9lueFSqSBzzzI72LM\"",
    "mtime": "2022-10-07T14:41:29.839Z",
    "size": 4823,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d7-j6OszUnkNK9lueFSqSBzzzI72LM\"",
    "mtime": "2022-10-07T14:41:29.845Z",
    "size": 4823,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d7-j6OszUnkNK9lueFSqSBzzzI72LM\"",
    "mtime": "2022-10-07T14:41:29.835Z",
    "size": 4823,
    "path": "../public/index.html"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2167-EPkOw3po4ggvXSzC3LymKdWFc6I\"",
    "mtime": "2022-09-26T04:03:59.908Z",
    "size": 8551,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-09-26T04:03:59.650Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-09-26T04:03:59.643Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Lato-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 5472,
    "path": "../public/fonts/Lato-400-8.woff2"
  },
  "/fonts/Lato-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-09-26T04:03:59.907Z",
    "size": 23580,
    "path": "../public/fonts/Lato-400-9.woff2"
  },
  "/fonts/Nunito-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-09-26T04:03:59.876Z",
    "size": 10372,
    "path": "../public/fonts/Nunito-400-10.woff2"
  },
  "/fonts/Nunito-400-11.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-09-26T04:03:59.882Z",
    "size": 7780,
    "path": "../public/fonts/Nunito-400-11.woff2"
  },
  "/fonts/Nunito-400-12.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-09-26T04:03:59.875Z",
    "size": 4252,
    "path": "../public/fonts/Nunito-400-12.woff2"
  },
  "/fonts/Nunito-400-13.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-09-26T04:03:59.876Z",
    "size": 12736,
    "path": "../public/fonts/Nunito-400-13.woff2"
  },
  "/fonts/Nunito-400-14.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-09-26T04:03:59.643Z",
    "size": 14060,
    "path": "../public/fonts/Nunito-400-14.woff2"
  },
  "/fonts/Poppins-400-15.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-15.woff2"
  },
  "/fonts/Poppins-400-16.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-09-26T04:03:59.609Z",
    "size": 5544,
    "path": "../public/fonts/Poppins-400-16.woff2"
  },
  "/fonts/Poppins-400-17.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-09-26T04:03:59.635Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-17.woff2"
  },
  "/fonts/Quicksand-400-18.woff2": {
    "type": "font/woff2",
    "etag": "\"e40-ueOd0idOrOcHm89BrZFoiH4yADg\"",
    "mtime": "2022-09-26T04:03:59.599Z",
    "size": 3648,
    "path": "../public/fonts/Quicksand-400-18.woff2"
  },
  "/fonts/Quicksand-400-19.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 11564,
    "path": "../public/fonts/Quicksand-400-19.woff2"
  },
  "/fonts/Quicksand-400-20.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 13888,
    "path": "../public/fonts/Quicksand-400-20.woff2"
  },
  "/fonts/Readex_Pro-400-21.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-09-26T04:03:59.621Z",
    "size": 8820,
    "path": "../public/fonts/Readex_Pro-400-21.woff2"
  },
  "/fonts/Readex_Pro-400-22.woff2": {
    "type": "font/woff2",
    "etag": "\"e08-mJZvi/KTLLbEpU4gc8JE6zvkzQo\"",
    "mtime": "2022-09-26T04:03:59.650Z",
    "size": 3592,
    "path": "../public/fonts/Readex_Pro-400-22.woff2"
  },
  "/fonts/Readex_Pro-400-23.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 9752,
    "path": "../public/fonts/Readex_Pro-400-23.woff2"
  },
  "/fonts/Readex_Pro-400-24.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-09-26T04:03:59.650Z",
    "size": 12208,
    "path": "../public/fonts/Readex_Pro-400-24.woff2"
  },
  "/fonts/Rubik-400-25.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 5832,
    "path": "../public/fonts/Rubik-400-25.woff2"
  },
  "/fonts/Rubik-400-26.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 7296,
    "path": "../public/fonts/Rubik-400-26.woff2"
  },
  "/fonts/Rubik-400-27.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 4392,
    "path": "../public/fonts/Rubik-400-27.woff2"
  },
  "/fonts/Rubik-400-28.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-09-26T04:03:59.649Z",
    "size": 8712,
    "path": "../public/fonts/Rubik-400-28.woff2"
  },
  "/fonts/Rubik-400-29.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-09-26T04:03:59.651Z",
    "size": 17132,
    "path": "../public/fonts/Rubik-400-29.woff2"
  },
  "/_nuxt/AccountVerification.d4452b81.js": {
    "type": "application/javascript",
    "etag": "\"4b0-BwAqEkXqtlWmK79niuDpdF/KTPY\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 1200,
    "path": "../public/_nuxt/AccountVerification.d4452b81.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.c5c1923f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"35d56a-E6IFfZy6n71IO25Eg4Y7EoEXmjw\"",
    "mtime": "2022-10-07T14:40:50.992Z",
    "size": 3528042,
    "path": "../public/_nuxt/entry.c5c1923f.css"
  },
  "/_nuxt/entry.ff1c6b2d.js": {
    "type": "application/javascript",
    "etag": "\"e4beb-7E3Z/2pRSjuzQCBSs7ykjtmhtQQ\"",
    "mtime": "2022-10-07T14:40:50.984Z",
    "size": 936939,
    "path": "../public/_nuxt/entry.ff1c6b2d.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.8d6849e2.js": {
    "type": "application/javascript",
    "etag": "\"8e3-mnWQk4l2F9O4UOA9H9/BwFbOVN8\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.8d6849e2.js"
  },
  "/_nuxt/error-500.9265c4ff.js": {
    "type": "application/javascript",
    "etag": "\"78c-ERnuZiY+ykXjDn6ZVjDaRod48R4\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.9265c4ff.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.9d2c2306.js": {
    "type": "application/javascript",
    "etag": "\"4b5-ZoYsYwVFaUy5itS3NoEhZzB+Scw\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.9d2c2306.js"
  },
  "/_nuxt/FeedModalView.a2e58370.js": {
    "type": "application/javascript",
    "etag": "\"32ed-WeocL04X/06MTImYmbM9cNRxZFM\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 13037,
    "path": "../public/_nuxt/FeedModalView.a2e58370.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/index.136c3f19.js": {
    "type": "application/javascript",
    "etag": "\"352-RCI/yH9WuaLV5w9IaLSgYV3qsvs\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 850,
    "path": "../public/_nuxt/index.136c3f19.js"
  },
  "/_nuxt/index.3dbc7b93.js": {
    "type": "application/javascript",
    "etag": "\"10e3-IkSBEiZUBu/lGeYqEfeXO5MdmWI\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 4323,
    "path": "../public/_nuxt/index.3dbc7b93.js"
  },
  "/_nuxt/index.4168f572.js": {
    "type": "application/javascript",
    "etag": "\"b8b4-ht30L1uT126NLoFAA6QUs+15dRI\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 47284,
    "path": "../public/_nuxt/index.4168f572.js"
  },
  "/_nuxt/index.4cf35f7d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1355c-8+yTLyZSs2xWFrzvYGXQ8yuJPGc\"",
    "mtime": "2022-10-07T14:40:50.989Z",
    "size": 79196,
    "path": "../public/_nuxt/index.4cf35f7d.css"
  },
  "/_nuxt/index.4e23817d.js": {
    "type": "application/javascript",
    "etag": "\"f9-+JT1/rc7aGoFhvlpaubDIBshiOo\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 249,
    "path": "../public/_nuxt/index.4e23817d.js"
  },
  "/_nuxt/index.4fe142fb.js": {
    "type": "application/javascript",
    "etag": "\"3709-u1Oy9iX3bJPGtpMQLD1vSPad76w\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 14089,
    "path": "../public/_nuxt/index.4fe142fb.js"
  },
  "/_nuxt/index.5583b28c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12349-9/PMZgw54JlnmN8btafni4nm+9c\"",
    "mtime": "2022-10-07T14:40:50.991Z",
    "size": 74569,
    "path": "../public/_nuxt/index.5583b28c.css"
  },
  "/_nuxt/index.56a7b33b.js": {
    "type": "application/javascript",
    "etag": "\"33c8-C5cPLF4fFwLof8pEdB559Ch5ZPg\"",
    "mtime": "2022-10-07T14:40:50.987Z",
    "size": 13256,
    "path": "../public/_nuxt/index.56a7b33b.js"
  },
  "/_nuxt/index.56c26d47.js": {
    "type": "application/javascript",
    "etag": "\"179-RVGjQp6yxdcOK+vsBE5dOL4psw4\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 377,
    "path": "../public/_nuxt/index.56c26d47.js"
  },
  "/_nuxt/index.649c5578.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13834-V/2sT777WZBIN7fU65IxgjsTMo8\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 79924,
    "path": "../public/_nuxt/index.649c5578.css"
  },
  "/_nuxt/index.74247f26.js": {
    "type": "application/javascript",
    "etag": "\"236-M1EPHMK007OBZGn200cgJnLnKgE\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 566,
    "path": "../public/_nuxt/index.74247f26.js"
  },
  "/_nuxt/index.7c0ca209.js": {
    "type": "application/javascript",
    "etag": "\"19a-So5UscbelHXM5hFHu0s0l96dCjA\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 410,
    "path": "../public/_nuxt/index.7c0ca209.js"
  },
  "/_nuxt/index.817bb9eb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1275e-LvMTgb2gCXgTlJV950kKYRdz11E\"",
    "mtime": "2022-10-07T14:40:50.991Z",
    "size": 75614,
    "path": "../public/_nuxt/index.817bb9eb.css"
  },
  "/_nuxt/index.8d3e5d8c.js": {
    "type": "application/javascript",
    "etag": "\"1f98-X7hw2CiS8Avm0A9h13DMesLmL1U\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 8088,
    "path": "../public/_nuxt/index.8d3e5d8c.js"
  },
  "/_nuxt/index.8f68b188.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1355c-gO056mrqUFCDOcpLSTcWqel5yhU\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 79196,
    "path": "../public/_nuxt/index.8f68b188.css"
  },
  "/_nuxt/index.9053e2c9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1355c-q7U44iKsvZ71tSfWUqUzI7M/Ejw\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 79196,
    "path": "../public/_nuxt/index.9053e2c9.css"
  },
  "/_nuxt/index.a00f8752.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1355c-O6uLMmbrfxb+6WF5Uye9EJLlgcU\"",
    "mtime": "2022-10-07T14:40:50.989Z",
    "size": 79196,
    "path": "../public/_nuxt/index.a00f8752.css"
  },
  "/_nuxt/index.a0387b89.js": {
    "type": "application/javascript",
    "etag": "\"229-U8EgjNVcNRJd7hDHst9mS2SxooE\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 553,
    "path": "../public/_nuxt/index.a0387b89.js"
  },
  "/_nuxt/index.baba9b43.js": {
    "type": "application/javascript",
    "etag": "\"18c7-EzG2zfY8Kpd7BH/kIv7vBXosH78\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 6343,
    "path": "../public/_nuxt/index.baba9b43.js"
  },
  "/_nuxt/index.c6a5b599.js": {
    "type": "application/javascript",
    "etag": "\"d29-hibH/s9fWl3YrpytKvbN3v2WUEo\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 3369,
    "path": "../public/_nuxt/index.c6a5b599.js"
  },
  "/_nuxt/index.d5084153.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13b9f-arx1EG0/ctotDuJITUWP28wkER8\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 80799,
    "path": "../public/_nuxt/index.d5084153.css"
  },
  "/_nuxt/index.d6db25b6.js": {
    "type": "application/javascript",
    "etag": "\"2b2c-fWQBfUztWF+ieYZE8lX/dFjyogc\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 11052,
    "path": "../public/_nuxt/index.d6db25b6.js"
  },
  "/_nuxt/index.eabf2109.js": {
    "type": "application/javascript",
    "etag": "\"1a55-0T45Kay70NAIDYG8vG+1SArExew\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 6741,
    "path": "../public/_nuxt/index.eabf2109.js"
  },
  "/_nuxt/index.ecdc4e20.js": {
    "type": "application/javascript",
    "etag": "\"18a-MDeYBA/ikwwcIUVJ+cuGqLcEEKY\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 394,
    "path": "../public/_nuxt/index.ecdc4e20.js"
  },
  "/_nuxt/index.f31dc5cd.js": {
    "type": "application/javascript",
    "etag": "\"fec-h0PIUX91yPjvUZDsqcANOIqRGz8\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 4076,
    "path": "../public/_nuxt/index.f31dc5cd.js"
  },
  "/_nuxt/index.f362b543.js": {
    "type": "application/javascript",
    "etag": "\"17a4-hQnc7ilqe6n/GZq5mBAvVVQgnWc\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 6052,
    "path": "../public/_nuxt/index.f362b543.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-10-07T14:40:50.977Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-10-07T14:40:50.980Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-10-07T14:40:50.980Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-10-07T14:40:50.980Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-10-07T14:40:50.980Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-10-07T14:40:50.980Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.f9f098ae.js": {
    "type": "application/javascript",
    "etag": "\"14ef0-Ni+JpACMFp6JeJ2us6vdwQbwLi4\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 85744,
    "path": "../public/_nuxt/Layout.f9f098ae.js"
  },
  "/_nuxt/LoadingEmptyErrorMessage.a1200cb8.js": {
    "type": "application/javascript",
    "etag": "\"1b47-4QyIh40gnGVfKZeHdPjMIPyqMiw\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 6983,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.a1200cb8.js"
  },
  "/_nuxt/logout.9f06b106.js": {
    "type": "application/javascript",
    "etag": "\"9d-vN0fECuTQLETFunv4qqGqExHnWY\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 157,
    "path": "../public/_nuxt/logout.9f06b106.js"
  },
  "/_nuxt/ModalView.8c1c291a.js": {
    "type": "application/javascript",
    "etag": "\"12482-nYzZcEXp5heuthK5/Hzmg0ipYSo\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 74882,
    "path": "../public/_nuxt/ModalView.8c1c291a.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.18846a7d.js": {
    "type": "application/javascript",
    "etag": "\"12379-ocDnJfsb60TU3G//nDf4HcEFRQ4\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 74617,
    "path": "../public/_nuxt/Profile.18846a7d.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.1c5da834.js": {
    "type": "application/javascript",
    "etag": "\"389-xgCK0alpDSYR6ltm+V/D7vgtisk\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 905,
    "path": "../public/_nuxt/RecoverPassword.1c5da834.js"
  },
  "/_nuxt/RecoverPassword.9345dfb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11f82-r3pgy8+glmujcOqhORPRnjRMb6w\"",
    "mtime": "2022-10-07T14:40:50.991Z",
    "size": 73602,
    "path": "../public/_nuxt/RecoverPassword.9345dfb8.css"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-10-07T14:40:50.981Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.2e3e3cd5.js": {
    "type": "application/javascript",
    "etag": "\"578c-tfvwBVGMxky/FPfJFihG1XmAx2s\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 22412,
    "path": "../public/_nuxt/setting.2e3e3cd5.js"
  },
  "/_nuxt/Spinner.0f65676e.js": {
    "type": "application/javascript",
    "etag": "\"31b-mp7Ol1qz4oCk0V0jLoGoN8DZ5XI\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.0f65676e.js"
  },
  "/_nuxt/TagFilterSelection.87d65fa1.js": {
    "type": "application/javascript",
    "etag": "\"5d4-zZ1Pe63us+sssO/jrw2Q2P7gtVM\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 1492,
    "path": "../public/_nuxt/TagFilterSelection.87d65fa1.js"
  },
  "/_nuxt/useArtwork.c891ddcd.js": {
    "type": "application/javascript",
    "etag": "\"7c31-cRGcim3I7I/wR1jsTzf8aKxriHk\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 31793,
    "path": "../public/_nuxt/useArtwork.c891ddcd.js"
  },
  "/_nuxt/useFeed.ef69bb9d.js": {
    "type": "application/javascript",
    "etag": "\"3543-WB4rSEzFrWqCl1cTJaz9S9TUE/w\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 13635,
    "path": "../public/_nuxt/useFeed.ef69bb9d.js"
  },
  "/_nuxt/useI18n.8d1dd46a.js": {
    "type": "application/javascript",
    "etag": "\"62-zf61Ap9TL+xe3tX1hMfmQy6b/BE\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.8d1dd46a.js"
  },
  "/_nuxt/user-counters-api.7582ee1a.js": {
    "type": "application/javascript",
    "etag": "\"1585-5MhsmkKJUtjVRwymYAyI6Jgrazw\"",
    "mtime": "2022-10-07T14:40:50.984Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.7582ee1a.js"
  },
  "/_nuxt/useUser.36179c76.js": {
    "type": "application/javascript",
    "etag": "\"3acb-v2368pqw2h648k1qpB56WZ1uhRU\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 15051,
    "path": "../public/_nuxt/useUser.36179c76.js"
  },
  "/_nuxt/_id.26ef4551.js": {
    "type": "application/javascript",
    "etag": "\"27a-S8ne+O44babBqFF7WKtx1pP2lxw\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 634,
    "path": "../public/_nuxt/_id.26ef4551.js"
  },
  "/_nuxt/_id_.491674bb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12180-y4mN4Y2aANooQe3NG6yB9wLz/3Q\"",
    "mtime": "2022-10-07T14:40:50.991Z",
    "size": 74112,
    "path": "../public/_nuxt/_id_.491674bb.css"
  },
  "/_nuxt/_id_.8a93a077.js": {
    "type": "application/javascript",
    "etag": "\"3a9-4EwiSQtZ51sToCXxlMNwC+MDAts\"",
    "mtime": "2022-10-07T14:40:50.985Z",
    "size": 937,
    "path": "../public/_nuxt/_id_.8a93a077.js"
  },
  "/_nuxt/_id_.93ca8c36.js": {
    "type": "application/javascript",
    "etag": "\"1a92-K1yUgkUC1Lzfnt0S/krelG20ZJI\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 6802,
    "path": "../public/_nuxt/_id_.93ca8c36.js"
  },
  "/_nuxt/_id_.f7d484b1.js": {
    "type": "application/javascript",
    "etag": "\"436-U7selBWfXz9Ozn/tzrrr82ie+5g\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 1078,
    "path": "../public/_nuxt/_id_.f7d484b1.js"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-10-07T14:40:50.983Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.12102ca7.js": {
    "type": "application/javascript",
    "etag": "\"346-25niwTwYHji0fd5PwwvXO3lBgWI\"",
    "mtime": "2022-10-07T14:40:50.986Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.12102ca7.js"
  },
  "/_nuxt/_username_.edc82a8b.js": {
    "type": "application/javascript",
    "etag": "\"346-25niwTwYHji0fd5PwwvXO3lBgWI\"",
    "mtime": "2022-10-07T14:40:50.988Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.edc82a8b.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = [];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  const encodingHeader = String(event.req.headers["accept-encoding"] || "");
  const encodings = encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort().concat([""]);
  if (encodings.length > 1) {
    event.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding) {
    event.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size) {
    event.res.setHeader("Content-Length", asset.size);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _u46XUe = lazyEventHandler(() => {
  const ipxOptions = {
    ...useRuntimeConfig().ipx || {},
    dir: fileURLToPath$1(new URL("../public", globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.req, event.res);
  });
});

const _lazy_jqeG69 = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_jqeG69, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _u46XUe, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_jqeG69, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { useRuntimeConfig as a, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
