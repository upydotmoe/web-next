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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://api.upy.moe:2021","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"upy11.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
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
    "etag": "\"12dc-kfn+vrI1Q8iJ1eDXWdyNQSfTG/Y\"",
    "mtime": "2022-09-26T14:22:58.135Z",
    "size": 4828,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12dc-kfn+vrI1Q8iJ1eDXWdyNQSfTG/Y\"",
    "mtime": "2022-09-26T14:22:58.137Z",
    "size": 4828,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12dc-kfn+vrI1Q8iJ1eDXWdyNQSfTG/Y\"",
    "mtime": "2022-09-26T14:22:58.133Z",
    "size": 4828,
    "path": "../public/index.html"
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
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2167-EPkOw3po4ggvXSzC3LymKdWFc6I\"",
    "mtime": "2022-09-26T04:03:59.908Z",
    "size": 8551,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/_nuxt/AccountVerification.d9e2e2b6.js": {
    "type": "application/javascript",
    "etag": "\"4aa-fVRZzA1oxcwrMJZ+LGStAVCx/1s\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 1194,
    "path": "../public/_nuxt/AccountVerification.d9e2e2b6.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-09-26T14:22:17.038Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.7318f8db.js": {
    "type": "application/javascript",
    "etag": "\"97c65-2YJfWuQoQEgWh9C3e4oAxGA5jUM\"",
    "mtime": "2022-09-26T14:22:17.044Z",
    "size": 621669,
    "path": "../public/_nuxt/entry.7318f8db.js"
  },
  "/_nuxt/entry.faef2620.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"351829-4R1f7G+/F1sUACFiFZPSdPpJriM\"",
    "mtime": "2022-09-26T14:22:17.054Z",
    "size": 3479593,
    "path": "../public/_nuxt/entry.faef2620.css"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.e4e88752.js": {
    "type": "application/javascript",
    "etag": "\"8e3-BR+O6+mhfvQsY/nw0Iga2D4fuRw\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.e4e88752.js"
  },
  "/_nuxt/error-500.67f4e9b3.js": {
    "type": "application/javascript",
    "etag": "\"78c-2IkS3xJfnPZE68pmeMqwXzy/HNk\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.67f4e9b3.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.b524c880.js": {
    "type": "application/javascript",
    "etag": "\"4b5-G1AU5arQQ4P6WNUn/h4nUqT6Cho\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.b524c880.js"
  },
  "/_nuxt/ErrorMessages.9bad8f44.js": {
    "type": "application/javascript",
    "etag": "\"1aab-ogWSPQ/45jB7ytzFpd+yakRfi0Y\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 6827,
    "path": "../public/_nuxt/ErrorMessages.9bad8f44.js"
  },
  "/_nuxt/FeedModalView.48ef355b.js": {
    "type": "application/javascript",
    "etag": "\"327c-JEQGNiJwcQqxqDpaUUn2ftxHIGM\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 12924,
    "path": "../public/_nuxt/FeedModalView.48ef355b.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/Icon.a822dbd2.js": {
    "type": "application/javascript",
    "etag": "\"7d9c-C7rj4vJBvYXkVJrgf74qa7OAzjw\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 32156,
    "path": "../public/_nuxt/Icon.a822dbd2.js"
  },
  "/_nuxt/index.0fec2531.js": {
    "type": "application/javascript",
    "etag": "\"10e2-iOxZ7SJTwYgnjigFtt37u4f0NZg\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 4322,
    "path": "../public/_nuxt/index.0fec2531.js"
  },
  "/_nuxt/index.256a9ffd.js": {
    "type": "application/javascript",
    "etag": "\"218-oEgfPXtXpC78BTzYvEbJOUxgNnw\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 536,
    "path": "../public/_nuxt/index.256a9ffd.js"
  },
  "/_nuxt/index.264a1e79.js": {
    "type": "application/javascript",
    "etag": "\"194-RxCr1NEYyPOhvr4+yDYCgmZltQw\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 404,
    "path": "../public/_nuxt/index.264a1e79.js"
  },
  "/_nuxt/index.28b0e9f9.js": {
    "type": "application/javascript",
    "etag": "\"17a3-gZs3SbHwmYm9gIGDZHeAu9svYL0\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 6051,
    "path": "../public/_nuxt/index.28b0e9f9.js"
  },
  "/_nuxt/index.3168a42f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12346-LBhcOzZ2l3IiHmVakZ+FqMql8oQ\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 74566,
    "path": "../public/_nuxt/index.3168a42f.css"
  },
  "/_nuxt/index.378fb101.js": {
    "type": "application/javascript",
    "etag": "\"34c-r0/+rCj6gJSs8wz5rVOBVutB8k8\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 844,
    "path": "../public/_nuxt/index.378fb101.js"
  },
  "/_nuxt/index.47459020.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1341d-DDVzeMu9NbNHCtdOZ82fPmvI1Rk\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 78877,
    "path": "../public/_nuxt/index.47459020.css"
  },
  "/_nuxt/index.6b1cd17c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13145-CFxUaTrDRx5q7fLcugQdpm+yzvg\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 78149,
    "path": "../public/_nuxt/index.6b1cd17c.css"
  },
  "/_nuxt/index.785a03ac.js": {
    "type": "application/javascript",
    "etag": "\"1f96-d8aY4ajKUiFnyn2OJoyARjrCenM\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 8086,
    "path": "../public/_nuxt/index.785a03ac.js"
  },
  "/_nuxt/index.a27792c9.js": {
    "type": "application/javascript",
    "etag": "\"18c5-Gvsc0/91ZQLjgzC42BTT21szTjE\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 6341,
    "path": "../public/_nuxt/index.a27792c9.js"
  },
  "/_nuxt/index.a5730cbc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11f31-Hys0ew1UTv9CqE0Gj5ruHGZZseE\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 73521,
    "path": "../public/_nuxt/index.a5730cbc.css"
  },
  "/_nuxt/index.a7bdaaf6.js": {
    "type": "application/javascript",
    "etag": "\"b72c-WMJDJ8wrG78BAUzn8JiVvXI9lN8\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 46892,
    "path": "../public/_nuxt/index.a7bdaaf6.js"
  },
  "/_nuxt/index.bac10229.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13787-/V6Xh/ZcjknmB3sMx60Db3++H6s\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 79751,
    "path": "../public/_nuxt/index.bac10229.css"
  },
  "/_nuxt/index.c1477532.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13145-XRrtoevGUe4xIsjCf8J9OE5Gztk\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 78149,
    "path": "../public/_nuxt/index.c1477532.css"
  },
  "/_nuxt/index.c204d57e.js": {
    "type": "application/javascript",
    "etag": "\"f9-LrIEY3uXR/rJq59LZHt1Nl+W8Bg\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 249,
    "path": "../public/_nuxt/index.c204d57e.js"
  },
  "/_nuxt/index.c5ad43fb.js": {
    "type": "application/javascript",
    "etag": "\"d27-6fk6uxfhxGi5UyXDU1gxItypIy0\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 3367,
    "path": "../public/_nuxt/index.c5ad43fb.js"
  },
  "/_nuxt/index.c8b61b0f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13145-0Uy7sFUN9w+tHT54H070sQklAY4\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 78149,
    "path": "../public/_nuxt/index.c8b61b0f.css"
  },
  "/_nuxt/index.de349eec.js": {
    "type": "application/javascript",
    "etag": "\"1a38-d3YcbZHg50dfeH8Gs2ADLwxpZHk\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 6712,
    "path": "../public/_nuxt/index.de349eec.js"
  },
  "/_nuxt/index.e095e7d3.js": {
    "type": "application/javascript",
    "etag": "\"fe5-u+DzVCtbgF5f2mp5zNq+L+maeNg\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 4069,
    "path": "../public/_nuxt/index.e095e7d3.js"
  },
  "/_nuxt/index.e7c115e0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13145-UrfaEHZH9tGaFUvbRO9vGIvm0wo\"",
    "mtime": "2022-09-26T14:22:17.049Z",
    "size": 78149,
    "path": "../public/_nuxt/index.e7c115e0.css"
  },
  "/_nuxt/index.f48d7f56.js": {
    "type": "application/javascript",
    "etag": "\"225-FGL4rBoUkbWTQAlqmsR2E8VPBPE\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 549,
    "path": "../public/_nuxt/index.f48d7f56.js"
  },
  "/_nuxt/index.f4fa63fd.js": {
    "type": "application/javascript",
    "etag": "\"320a-1In7IapyffcbMS4bexfqx2ygO+w\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 12810,
    "path": "../public/_nuxt/index.f4fa63fd.js"
  },
  "/_nuxt/index.fa2de07f.js": {
    "type": "application/javascript",
    "etag": "\"2a6c-zcKZ5ssc8nelUbTXB1QYNHqF99E\"",
    "mtime": "2022-09-26T14:22:17.047Z",
    "size": 10860,
    "path": "../public/_nuxt/index.fa2de07f.js"
  },
  "/_nuxt/index.fdbc688f.js": {
    "type": "application/javascript",
    "etag": "\"33b6-npIrOHnCzDK5WNNhXG6itrHbNV4\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 13238,
    "path": "../public/_nuxt/index.fdbc688f.js"
  },
  "/_nuxt/index.fe17592d.js": {
    "type": "application/javascript",
    "etag": "\"17f-8L17P4q/JZNPFOMZ68ACDxYlRgI\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 383,
    "path": "../public/_nuxt/index.fe17592d.js"
  },
  "/_nuxt/index.fe1f10d5.js": {
    "type": "application/javascript",
    "etag": "\"173-nvNsJBFHKXSURYmt88sv2H0M8aM\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 371,
    "path": "../public/_nuxt/index.fe1f10d5.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-09-26T14:22:17.040Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-09-26T14:22:17.040Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.a1646ba4.js": {
    "type": "application/javascript",
    "etag": "\"149e4-VUcfi6Y7MEYlr27a8zC4hnwZdrc\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 84452,
    "path": "../public/_nuxt/Layout.a1646ba4.js"
  },
  "/_nuxt/logout.c896e36a.js": {
    "type": "application/javascript",
    "etag": "\"9d-g/FXf7B1pOZugxQhHdh7ypH9Qk8\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 157,
    "path": "../public/_nuxt/logout.c896e36a.js"
  },
  "/_nuxt/ModalView.23f396d8.js": {
    "type": "application/javascript",
    "etag": "\"12256-NyeWYea9627XR4CAQQfklBDyXDQ\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 74326,
    "path": "../public/_nuxt/ModalView.23f396d8.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.4a8a012e.js": {
    "type": "application/javascript",
    "etag": "\"11a05-+1cMCQRsal6kX1v01vgiOr52/DY\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 72197,
    "path": "../public/_nuxt/Profile.4a8a012e.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.aef2eb40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11b6a-vN7VPdCi02KEWvhvSEFHVO+j6SA\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 72554,
    "path": "../public/_nuxt/RecoverPassword.aef2eb40.css"
  },
  "/_nuxt/RecoverPassword.e76f23d6.js": {
    "type": "application/javascript",
    "etag": "\"383-uy5pbfsMJPAPBoDeGQ/XWCEAjFo\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 899,
    "path": "../public/_nuxt/RecoverPassword.e76f23d6.js"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-09-26T14:22:17.041Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.3579b2ac.js": {
    "type": "application/javascript",
    "etag": "\"56cf-TfX+qpWAAPatDZ8zYMikfp4FNw4\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 22223,
    "path": "../public/_nuxt/setting.3579b2ac.js"
  },
  "/_nuxt/Spinner.f7671633.js": {
    "type": "application/javascript",
    "etag": "\"31b-Mc3eli2PY3JSallChDDj4M+NHKE\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.f7671633.js"
  },
  "/_nuxt/TagFilterSelection.f7754074.js": {
    "type": "application/javascript",
    "etag": "\"5c4-eip8wb778Ead4XYez3Zpw9jVyIM\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 1476,
    "path": "../public/_nuxt/TagFilterSelection.f7754074.js"
  },
  "/_nuxt/useFeed.4359c0dd.js": {
    "type": "application/javascript",
    "etag": "\"351c-P8jjZYU9lU25s/y7l99AGfKhaqw\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 13596,
    "path": "../public/_nuxt/useFeed.4359c0dd.js"
  },
  "/_nuxt/useI18n.93ff2a69.js": {
    "type": "application/javascript",
    "etag": "\"62-BZnF/iLbeXbWqOmv/PuI2tAMOuw\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.93ff2a69.js"
  },
  "/_nuxt/user-counters-api.2d75dfee.js": {
    "type": "application/javascript",
    "etag": "\"1585-aYVVvPM5/JJ+3u7+weqwRUdA0AY\"",
    "mtime": "2022-09-26T14:22:17.044Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.2d75dfee.js"
  },
  "/_nuxt/useUser.7f48b4a4.js": {
    "type": "application/javascript",
    "etag": "\"3ac5-BXrqN2scovRHWLnx++XkKnVUTdo\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 15045,
    "path": "../public/_nuxt/useUser.7f48b4a4.js"
  },
  "/_nuxt/_id.0e38faa9.js": {
    "type": "application/javascript",
    "etag": "\"269-Y6XDNApRkGP/dt1wVjB2Xg1/oOo\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 617,
    "path": "../public/_nuxt/_id.0e38faa9.js"
  },
  "/_nuxt/_id_.234bde9d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11d68-PhoD5tuhLjCnb1cX5c6gs65eF8s\"",
    "mtime": "2022-09-26T14:22:17.052Z",
    "size": 73064,
    "path": "../public/_nuxt/_id_.234bde9d.css"
  },
  "/_nuxt/_id_.3370242f.js": {
    "type": "application/javascript",
    "etag": "\"27d-GLvNCXpUWcxi/vcUN9o+lBMfNFE\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 637,
    "path": "../public/_nuxt/_id_.3370242f.js"
  },
  "/_nuxt/_id_.499a1166.js": {
    "type": "application/javascript",
    "etag": "\"1a90-G7Bs5Kxvh5me5mPDCz9OBRU5pqI\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 6800,
    "path": "../public/_nuxt/_id_.499a1166.js"
  },
  "/_nuxt/_id_.c495e901.js": {
    "type": "application/javascript",
    "etag": "\"294-KiSlYGBF4mimDyxmDqL9uQ3asyU\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 660,
    "path": "../public/_nuxt/_id_.c495e901.js"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-09-26T14:22:17.043Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.a12f8f6e.js": {
    "type": "application/javascript",
    "etag": "\"335-b4SSoxHYBHDa8KB+fDkggoKQqqU\"",
    "mtime": "2022-09-26T14:22:17.046Z",
    "size": 821,
    "path": "../public/_nuxt/_username_.a12f8f6e.js"
  },
  "/_nuxt/_username_.a57d17bc.js": {
    "type": "application/javascript",
    "etag": "\"335-b4SSoxHYBHDa8KB+fDkggoKQqqU\"",
    "mtime": "2022-09-26T14:22:17.048Z",
    "size": 821,
    "path": "../public/_nuxt/_username_.a57d17bc.js"
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
