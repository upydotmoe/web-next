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
    "etag": "\"12d7-lJWLqou/w+vcKp5tamTCiohl23g\"",
    "mtime": "2022-10-03T10:36:11.886Z",
    "size": 4823,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d7-lJWLqou/w+vcKp5tamTCiohl23g\"",
    "mtime": "2022-10-03T10:36:11.888Z",
    "size": 4823,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d7-lJWLqou/w+vcKp5tamTCiohl23g\"",
    "mtime": "2022-10-03T10:36:11.884Z",
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
  "/_nuxt/AccountVerification.22f26bde.js": {
    "type": "application/javascript",
    "etag": "\"4aa-Q3YT903y4H6jJy2M74ujBMTMq0Y\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 1194,
    "path": "../public/_nuxt/AccountVerification.22f26bde.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.7573614e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"35832d-6mH/TRg2Ca9RcFm9sWX1vxtsYZ4\"",
    "mtime": "2022-10-03T10:35:29.167Z",
    "size": 3506989,
    "path": "../public/_nuxt/entry.7573614e.css"
  },
  "/_nuxt/entry.ec82c8a4.js": {
    "type": "application/javascript",
    "etag": "\"97e4e-GuIL/pTXedVqOcBnuhrSjpC0tdU\"",
    "mtime": "2022-10-03T10:35:29.153Z",
    "size": 622158,
    "path": "../public/_nuxt/entry.ec82c8a4.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.d576f0d2.js": {
    "type": "application/javascript",
    "etag": "\"8e3-9Gs14KtsFICe4Yav3si3AwB4L+s\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.d576f0d2.js"
  },
  "/_nuxt/error-500.e5b56153.js": {
    "type": "application/javascript",
    "etag": "\"78c-kOqMO/q+lJb4b/qadM4coSaEAew\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.e5b56153.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.79afddfb.js": {
    "type": "application/javascript",
    "etag": "\"4b5-CnMhGqSQ+TMJYlZAVaNgzERw15s\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.79afddfb.js"
  },
  "/_nuxt/FeedModalView.ea9fdff6.js": {
    "type": "application/javascript",
    "etag": "\"328f-nYlmqS2AJfmjVI0QfeJyyKDJQlM\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 12943,
    "path": "../public/_nuxt/FeedModalView.ea9fdff6.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/Icon.12c4779f.js": {
    "type": "application/javascript",
    "etag": "\"7d9c-SCibcxxm2JPxRZqNcaXX5Rdtl3g\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 32156,
    "path": "../public/_nuxt/Icon.12c4779f.js"
  },
  "/_nuxt/index.0d0e4126.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"133bd-XcK1PmQMCv3V5xQRrs3H2mdrKwU\"",
    "mtime": "2022-10-03T10:35:29.165Z",
    "size": 78781,
    "path": "../public/_nuxt/index.0d0e4126.css"
  },
  "/_nuxt/index.11c12026.js": {
    "type": "application/javascript",
    "etag": "\"223-fPyhK58+3l4Y7BfG597fngW4ofI\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 547,
    "path": "../public/_nuxt/index.11c12026.js"
  },
  "/_nuxt/index.196d9425.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"125be-UQmUKXPGMoyYzpZ4HW4ip5hkLJY\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 75198,
    "path": "../public/_nuxt/index.196d9425.css"
  },
  "/_nuxt/index.1e4fc92f.js": {
    "type": "application/javascript",
    "etag": "\"1a59-XTDMnZbugyBhs85EdOzz1khf+KE\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 6745,
    "path": "../public/_nuxt/index.1e4fc92f.js"
  },
  "/_nuxt/index.239f87ff.js": {
    "type": "application/javascript",
    "etag": "\"3545-OSkj2OM4cS9BMQzaxUn4We4AtOg\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 13637,
    "path": "../public/_nuxt/index.239f87ff.js"
  },
  "/_nuxt/index.45ef736c.js": {
    "type": "application/javascript",
    "etag": "\"194-e9Atjj+EZcc5EjF3eEBMrBCRfrk\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 404,
    "path": "../public/_nuxt/index.45ef736c.js"
  },
  "/_nuxt/index.4c0d948f.js": {
    "type": "application/javascript",
    "etag": "\"173-jRVDpU7ZEq8aLe3qrw4rZy10VoA\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 371,
    "path": "../public/_nuxt/index.4c0d948f.js"
  },
  "/_nuxt/index.52cdd11e.js": {
    "type": "application/javascript",
    "etag": "\"230-6O8uNNJkFslHTC/NRob0laDLC4M\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 560,
    "path": "../public/_nuxt/index.52cdd11e.js"
  },
  "/_nuxt/index.5c19a202.js": {
    "type": "application/javascript",
    "etag": "\"d28-VdIqh6fmpOu2cJO8wp6LA9eTZ90\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 3368,
    "path": "../public/_nuxt/index.5c19a202.js"
  },
  "/_nuxt/index.64aaf691.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"133bd-8o/O9kq43/URarGP3nTNKKmPISY\"",
    "mtime": "2022-10-03T10:35:29.165Z",
    "size": 78781,
    "path": "../public/_nuxt/index.64aaf691.css"
  },
  "/_nuxt/index.650db1d6.js": {
    "type": "application/javascript",
    "etag": "\"10e2-3afqk4UV9G4wL71hSn2wX6vXEM0\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 4322,
    "path": "../public/_nuxt/index.650db1d6.js"
  },
  "/_nuxt/index.6deab256.js": {
    "type": "application/javascript",
    "etag": "\"33c2-NmljWOFfJMSgLLIqf3Zs3cQsdzo\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 13250,
    "path": "../public/_nuxt/index.6deab256.js"
  },
  "/_nuxt/index.72bd2647.js": {
    "type": "application/javascript",
    "etag": "\"2b2b-lKVE0KIb6OO51XkmBabArWbtJvc\"",
    "mtime": "2022-10-03T10:35:29.157Z",
    "size": 11051,
    "path": "../public/_nuxt/index.72bd2647.js"
  },
  "/_nuxt/index.75e4f7d1.js": {
    "type": "application/javascript",
    "etag": "\"1f92-z1+wPLI004cvTHHl5xyfZeOU10s\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 8082,
    "path": "../public/_nuxt/index.75e4f7d1.js"
  },
  "/_nuxt/index.79de7a1e.js": {
    "type": "application/javascript",
    "etag": "\"17a3-TqvrxU4749O6haC8//Okdg/dT2Y\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 6051,
    "path": "../public/_nuxt/index.79de7a1e.js"
  },
  "/_nuxt/index.8b726dfe.js": {
    "type": "application/javascript",
    "etag": "\"fe6-jcqVbeR0lJyCDn9usSBX2QnnLPU\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 4070,
    "path": "../public/_nuxt/index.8b726dfe.js"
  },
  "/_nuxt/index.a6a864eb.js": {
    "type": "application/javascript",
    "etag": "\"f9-hLb37t1GWPg3TWn9iJNwNK9iCCw\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 249,
    "path": "../public/_nuxt/index.a6a864eb.js"
  },
  "/_nuxt/index.b6eb2cb5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139ff-wnTuKveFX2lQYo5jHQxkFMQnGVM\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 80383,
    "path": "../public/_nuxt/index.b6eb2cb5.css"
  },
  "/_nuxt/index.c68eb93f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"133bd-zryxE8Nqcv7hXmj7ISlG8t96kWQ\"",
    "mtime": "2022-10-03T10:35:29.165Z",
    "size": 78781,
    "path": "../public/_nuxt/index.c68eb93f.css"
  },
  "/_nuxt/index.c7a68abc.js": {
    "type": "application/javascript",
    "etag": "\"b73c-jPUxDxR6chEkoNGMzQKxx81kGWc\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 46908,
    "path": "../public/_nuxt/index.c7a68abc.js"
  },
  "/_nuxt/index.c97af053.js": {
    "type": "application/javascript",
    "etag": "\"34c-wpsB1dgXNEzOKGk5EzauWwVKqvA\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 844,
    "path": "../public/_nuxt/index.c97af053.js"
  },
  "/_nuxt/index.cae6f323.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13695-3nI7c0hdn0Xs+pMnjDzdhxxCGSg\"",
    "mtime": "2022-10-03T10:35:29.165Z",
    "size": 79509,
    "path": "../public/_nuxt/index.cae6f323.css"
  },
  "/_nuxt/index.d67c3924.js": {
    "type": "application/javascript",
    "etag": "\"18c1-M77pojItan1mXgSLxheUdVE0AJA\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 6337,
    "path": "../public/_nuxt/index.d67c3924.js"
  },
  "/_nuxt/index.e360174d.js": {
    "type": "application/javascript",
    "etag": "\"184-dMlkOoYSLH3R1jMyf7bHMQO9Hc4\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 388,
    "path": "../public/_nuxt/index.e360174d.js"
  },
  "/_nuxt/index.eac7f9fb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"133bd-3AVLW+iLilC1IKGL5COUbpYa3vU\"",
    "mtime": "2022-10-03T10:35:29.162Z",
    "size": 78781,
    "path": "../public/_nuxt/index.eac7f9fb.css"
  },
  "/_nuxt/index.f6240156.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"121a9-6eHt2+wJr0i9zMZ9LkdGHqU8KZo\"",
    "mtime": "2022-10-03T10:35:29.162Z",
    "size": 74153,
    "path": "../public/_nuxt/index.f6240156.css"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.a04c6b50.js": {
    "type": "application/javascript",
    "etag": "\"14eea-4jlkuK1UEVMnt7dSKjksKK2LqP4\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 85738,
    "path": "../public/_nuxt/Layout.a04c6b50.js"
  },
  "/_nuxt/LoadingEmptyErrorMessage.8ae3c568.js": {
    "type": "application/javascript",
    "etag": "\"1ab6-BHzzPXRa5o3BfM0VqAHXpB+NsfY\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 6838,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.8ae3c568.js"
  },
  "/_nuxt/logout.024665b4.js": {
    "type": "application/javascript",
    "etag": "\"9d-CL4pA7SpqZAm6c4Qqz7w+a8zPLc\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 157,
    "path": "../public/_nuxt/logout.024665b4.js"
  },
  "/_nuxt/ModalView.705bd7e7.js": {
    "type": "application/javascript",
    "etag": "\"1238c-tbBYlf3UKHuC5FOvgDK8/K1slHI\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 74636,
    "path": "../public/_nuxt/ModalView.705bd7e7.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-10-03T10:35:29.149Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.7c7d2ebd.js": {
    "type": "application/javascript",
    "etag": "\"121a8-rYp9gnvFX96BCGgJXkdgDfL75gI\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 74152,
    "path": "../public/_nuxt/Profile.7c7d2ebd.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-10-03T10:35:29.149Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-10-03T10:35:29.146Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-10-03T10:35:29.149Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-10-03T10:35:29.151Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.55b10eb9.js": {
    "type": "application/javascript",
    "etag": "\"383-dgenKA1bcgAoqHm9KcJI3KKRhXE\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 899,
    "path": "../public/_nuxt/RecoverPassword.55b10eb9.js"
  },
  "/_nuxt/RecoverPassword.802fc1e5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11de2-01L3ybbiS/S2Wkuo7H3+gIA7/BI\"",
    "mtime": "2022-10-03T10:35:29.163Z",
    "size": 73186,
    "path": "../public/_nuxt/RecoverPassword.802fc1e5.css"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-10-03T10:35:29.148Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-10-03T10:35:29.151Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-10-03T10:35:29.151Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-10-03T10:35:29.151Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.e19a427d.js": {
    "type": "application/javascript",
    "etag": "\"56cf-CqlXuCYxC/HqrMWcqH6OOdIsyOo\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 22223,
    "path": "../public/_nuxt/setting.e19a427d.js"
  },
  "/_nuxt/Spinner.7be79ae2.js": {
    "type": "application/javascript",
    "etag": "\"31b-hAtKNYYFJoRGsyxwDI7hdOwN8oA\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.7be79ae2.js"
  },
  "/_nuxt/TagFilterSelection.e84e8fdb.js": {
    "type": "application/javascript",
    "etag": "\"5d4-9N5KogtaTSXZWmGbgaG04LUbuSw\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 1492,
    "path": "../public/_nuxt/TagFilterSelection.e84e8fdb.js"
  },
  "/_nuxt/useFeed.56c6d0a5.js": {
    "type": "application/javascript",
    "etag": "\"351c-w/NBeDef+A3k756FyvY/gA3eOug\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 13596,
    "path": "../public/_nuxt/useFeed.56c6d0a5.js"
  },
  "/_nuxt/useI18n.6f8d5930.js": {
    "type": "application/javascript",
    "etag": "\"62-U18NsPMGVGffeCRKClCAHlWwTvw\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.6f8d5930.js"
  },
  "/_nuxt/user-counters-api.995b125b.js": {
    "type": "application/javascript",
    "etag": "\"1585-PbNqBpQfHqo9Gp4SR+RJgq6THIk\"",
    "mtime": "2022-10-03T10:35:29.153Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.995b125b.js"
  },
  "/_nuxt/useUser.d4c8b691.js": {
    "type": "application/javascript",
    "etag": "\"3ac5-XhHmt8HdM3BgrQKUhsWxUuMmb9A\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 15045,
    "path": "../public/_nuxt/useUser.d4c8b691.js"
  },
  "/_nuxt/_id.38265681.js": {
    "type": "application/javascript",
    "etag": "\"274-SUNmXorqbmKdMVDOqc0PXtX6x9A\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 628,
    "path": "../public/_nuxt/_id.38265681.js"
  },
  "/_nuxt/_id_.033ba65c.js": {
    "type": "application/javascript",
    "etag": "\"29f-CBVshHU0tMdsjzXxFbg0npymKVU\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 671,
    "path": "../public/_nuxt/_id_.033ba65c.js"
  },
  "/_nuxt/_id_.291128e5.js": {
    "type": "application/javascript",
    "etag": "\"1aa0-9IhS+05RPyKYtX8Vcj+u+qqHPic\"",
    "mtime": "2022-10-03T10:35:29.161Z",
    "size": 6816,
    "path": "../public/_nuxt/_id_.291128e5.js"
  },
  "/_nuxt/_id_.8864eb83.js": {
    "type": "application/javascript",
    "etag": "\"288-3q9s/JeGtk1NoeAz8/I3lGND10g\"",
    "mtime": "2022-10-03T10:35:29.155Z",
    "size": 648,
    "path": "../public/_nuxt/_id_.8864eb83.js"
  },
  "/_nuxt/_id_.a6c9568b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11fe0-G/FigNu4PqilXkwtbNEirIYdvig\"",
    "mtime": "2022-10-03T10:35:29.165Z",
    "size": 73696,
    "path": "../public/_nuxt/_id_.a6c9568b.css"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-10-03T10:35:29.152Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.5164cb36.js": {
    "type": "application/javascript",
    "etag": "\"340-dqHgxNL8KEqyvq0a1PSubSsIs8I\"",
    "mtime": "2022-10-03T10:35:29.156Z",
    "size": 832,
    "path": "../public/_nuxt/_username_.5164cb36.js"
  },
  "/_nuxt/_username_.b76e2053.js": {
    "type": "application/javascript",
    "etag": "\"340-dqHgxNL8KEqyvq0a1PSubSsIs8I\"",
    "mtime": "2022-10-03T10:35:29.159Z",
    "size": 832,
    "path": "../public/_nuxt/_username_.b76e2053.js"
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
