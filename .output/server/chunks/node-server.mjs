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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://api.upy.moe","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"upy10.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
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

const plugins = [
  
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
    "etag": "\"f5a-l8DrsTlXJwGv+2tiPrOUocF89+c\"",
    "mtime": "2022-09-22T06:57:35.365Z",
    "size": 3930,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"f5a-N70YuTynX+ACPhOaaPAZosfqjL8\"",
    "mtime": "2022-09-22T06:57:35.367Z",
    "size": 3930,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"f5e-JTbXkzwGPk5hX5BbAq7EDCjX6/A\"",
    "mtime": "2022-09-22T06:57:35.364Z",
    "size": 3934,
    "path": "../public/index.html"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2167-EPkOw3po4ggvXSzC3LymKdWFc6I\"",
    "mtime": "2022-09-15T02:47:56.966Z",
    "size": 8551,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-09-15T02:47:56.689Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2022-09-15T02:47:56.667Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-09-15T02:47:56.711Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Lato-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 5472,
    "path": "../public/fonts/Lato-400-8.woff2"
  },
  "/fonts/Lato-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 23580,
    "path": "../public/fonts/Lato-400-9.woff2"
  },
  "/fonts/Nunito-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-09-15T02:47:56.689Z",
    "size": 10372,
    "path": "../public/fonts/Nunito-400-10.woff2"
  },
  "/fonts/Nunito-400-11.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-09-15T02:47:56.689Z",
    "size": 7780,
    "path": "../public/fonts/Nunito-400-11.woff2"
  },
  "/fonts/Nunito-400-12.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 4252,
    "path": "../public/fonts/Nunito-400-12.woff2"
  },
  "/fonts/Nunito-400-13.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 12736,
    "path": "../public/fonts/Nunito-400-13.woff2"
  },
  "/fonts/Nunito-400-14.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-09-15T02:47:56.689Z",
    "size": 14060,
    "path": "../public/fonts/Nunito-400-14.woff2"
  },
  "/fonts/Poppins-400-15.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-15.woff2"
  },
  "/fonts/Poppins-400-16.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 5544,
    "path": "../public/fonts/Poppins-400-16.woff2"
  },
  "/fonts/Poppins-400-17.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-17.woff2"
  },
  "/fonts/Quicksand-400-18.woff2": {
    "type": "font/woff2",
    "etag": "\"e40-ueOd0idOrOcHm89BrZFoiH4yADg\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 3648,
    "path": "../public/fonts/Quicksand-400-18.woff2"
  },
  "/fonts/Quicksand-400-19.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 11564,
    "path": "../public/fonts/Quicksand-400-19.woff2"
  },
  "/fonts/Quicksand-400-20.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 13888,
    "path": "../public/fonts/Quicksand-400-20.woff2"
  },
  "/fonts/Readex_Pro-400-21.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 8820,
    "path": "../public/fonts/Readex_Pro-400-21.woff2"
  },
  "/fonts/Readex_Pro-400-22.woff2": {
    "type": "font/woff2",
    "etag": "\"e08-mJZvi/KTLLbEpU4gc8JE6zvkzQo\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 3592,
    "path": "../public/fonts/Readex_Pro-400-22.woff2"
  },
  "/fonts/Readex_Pro-400-23.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 9752,
    "path": "../public/fonts/Readex_Pro-400-23.woff2"
  },
  "/fonts/Readex_Pro-400-24.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 12208,
    "path": "../public/fonts/Readex_Pro-400-24.woff2"
  },
  "/fonts/Rubik-400-25.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 5832,
    "path": "../public/fonts/Rubik-400-25.woff2"
  },
  "/fonts/Rubik-400-26.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-09-15T02:47:56.707Z",
    "size": 7296,
    "path": "../public/fonts/Rubik-400-26.woff2"
  },
  "/fonts/Rubik-400-27.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 4392,
    "path": "../public/fonts/Rubik-400-27.woff2"
  },
  "/fonts/Rubik-400-28.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-09-15T02:47:56.710Z",
    "size": 8712,
    "path": "../public/fonts/Rubik-400-28.woff2"
  },
  "/fonts/Rubik-400-29.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-09-15T02:47:56.965Z",
    "size": 17132,
    "path": "../public/fonts/Rubik-400-29.woff2"
  },
  "/_nuxt/AccountVerification.29d96373.js": {
    "type": "application/javascript",
    "etag": "\"4aa-CcXKKsiANVwnveurD4OW2FfH9Bs\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 1194,
    "path": "../public/_nuxt/AccountVerification.29d96373.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.cde267c1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"368b52-L42T6cncIKo9FazbXl8CcCniM20\"",
    "mtime": "2022-09-22T06:56:56.438Z",
    "size": 3574610,
    "path": "../public/_nuxt/entry.cde267c1.css"
  },
  "/_nuxt/entry.ece145ee.js": {
    "type": "application/javascript",
    "etag": "\"9b95c-VdbihAXD5nU/dUulFwQZPHFJFmw\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 637276,
    "path": "../public/_nuxt/entry.ece145ee.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.5512a14f.js": {
    "type": "application/javascript",
    "etag": "\"8e3-7q6X/V4ZzKBtPZ8h+lwwVcVkbOY\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.5512a14f.js"
  },
  "/_nuxt/error-500.9b1532fa.js": {
    "type": "application/javascript",
    "etag": "\"78c-S5xC9iKIapI96xBtR52ie44QSiE\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.9b1532fa.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.aa09e006.js": {
    "type": "application/javascript",
    "etag": "\"4b5-r+Ig0gO3U7YK5CqEF+PDBs5SsKI\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.aa09e006.js"
  },
  "/_nuxt/ErrorMessages.988aa1e8.js": {
    "type": "application/javascript",
    "etag": "\"1aab-isLyLkxJUrnEYo4rFHTmsSXN0Pg\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 6827,
    "path": "../public/_nuxt/ErrorMessages.988aa1e8.js"
  },
  "/_nuxt/FeedModalView.178fac63.js": {
    "type": "application/javascript",
    "etag": "\"327c-00Hr99dVlNFm7ILq/lGATMLOBb4\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 12924,
    "path": "../public/_nuxt/FeedModalView.178fac63.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/Icon.6574d282.js": {
    "type": "application/javascript",
    "etag": "\"7d9c-Zu4VLUO5Tdh+iyZBsP4Z2j1EGG4\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 32156,
    "path": "../public/_nuxt/Icon.6574d282.js"
  },
  "/_nuxt/index.1468dbdd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13fd7-FKplyfYVq8iywF3hIrc1P9vT+iQ\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 81879,
    "path": "../public/_nuxt/index.1468dbdd.css"
  },
  "/_nuxt/index.2398033e.js": {
    "type": "application/javascript",
    "etag": "\"b7fd-kYqnMYVM4WGMZBPvqRLW4Xs1BUY\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 47101,
    "path": "../public/_nuxt/index.2398033e.js"
  },
  "/_nuxt/index.3b4bd3c2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12b96-fF1sx1vTpjq7u+TiZx9CgzX/dwc\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 76694,
    "path": "../public/_nuxt/index.3b4bd3c2.css"
  },
  "/_nuxt/index.3e1f8b76.js": {
    "type": "application/javascript",
    "etag": "\"17f-ecjcDhPWceu50k8Zt9nce6E7VSM\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 383,
    "path": "../public/_nuxt/index.3e1f8b76.js"
  },
  "/_nuxt/index.42cc07a3.js": {
    "type": "application/javascript",
    "etag": "\"f9-zlNCoydJOKlsGfj02qiTzKOx/YY\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 249,
    "path": "../public/_nuxt/index.42cc07a3.js"
  },
  "/_nuxt/index.4c5cb842.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13995-Kc2Z033acUxfzqsjAQC5gkCNwDg\"",
    "mtime": "2022-09-22T06:56:56.436Z",
    "size": 80277,
    "path": "../public/_nuxt/index.4c5cb842.css"
  },
  "/_nuxt/index.52b2ac91.js": {
    "type": "application/javascript",
    "etag": "\"b72c-LlQk4bZryxl7zFpuz6CdHqw9z8M\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 46892,
    "path": "../public/_nuxt/index.52b2ac91.js"
  },
  "/_nuxt/index.5762295e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12781-X7shRT2aXwkqDPydTE5FPSAjh4Y\"",
    "mtime": "2022-09-22T06:56:56.434Z",
    "size": 75649,
    "path": "../public/_nuxt/index.5762295e.css"
  },
  "/_nuxt/index.6103a8fb.js": {
    "type": "application/javascript",
    "etag": "\"2a67-fWdkLUhQ4RAdWnAVVcdjdQO/KLs\"",
    "mtime": "2022-09-22T06:56:56.432Z",
    "size": 10855,
    "path": "../public/_nuxt/index.6103a8fb.js"
  },
  "/_nuxt/index.6eb6520e.js": {
    "type": "application/javascript",
    "etag": "\"fdf-rSC5fCw3z0dhhpWiTe8Rc7rI/q8\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 4063,
    "path": "../public/_nuxt/index.6eb6520e.js"
  },
  "/_nuxt/index.7220ea20.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13c6d-KrxfHML9SRE2H/SUd66m/UF5JGk\"",
    "mtime": "2022-09-22T06:56:56.437Z",
    "size": 81005,
    "path": "../public/_nuxt/index.7220ea20.css"
  },
  "/_nuxt/index.72ec799c.js": {
    "type": "application/javascript",
    "etag": "\"33b5-qSK5yPGUPNlRWUb9SRx+li3oUCA\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 13237,
    "path": "../public/_nuxt/index.72ec799c.js"
  },
  "/_nuxt/index.7dec2bdb.js": {
    "type": "application/javascript",
    "etag": "\"194-lyUTfqLpCfdT6/W7pUfdCBPjKlc\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 404,
    "path": "../public/_nuxt/index.7dec2bdb.js"
  },
  "/_nuxt/index.8871d77d.js": {
    "type": "application/javascript",
    "etag": "\"34d-qHzKAbMh5jRmBj3zov23No++NsY\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 845,
    "path": "../public/_nuxt/index.8871d77d.js"
  },
  "/_nuxt/index.8c4b1d13.js": {
    "type": "application/javascript",
    "etag": "\"17a3-hm/ofaIzOZz6EEIOmF/dP75Bm54\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 6051,
    "path": "../public/_nuxt/index.8c4b1d13.js"
  },
  "/_nuxt/index.8eca77ad.js": {
    "type": "application/javascript",
    "etag": "\"173-TxSVlfiHDCiJ/AoOI4h9Jy6OPfw\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 371,
    "path": "../public/_nuxt/index.8eca77ad.js"
  },
  "/_nuxt/index.93f015b5.js": {
    "type": "application/javascript",
    "etag": "\"1f96-+lB9mrjIgGaB5BtM13GNnvUzGq8\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 8086,
    "path": "../public/_nuxt/index.93f015b5.js"
  },
  "/_nuxt/index.964f702d.js": {
    "type": "application/javascript",
    "etag": "\"18c4-aXae9jCppX7VZehROJzYoQH09N8\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 6340,
    "path": "../public/_nuxt/index.964f702d.js"
  },
  "/_nuxt/index.998237c3.js": {
    "type": "application/javascript",
    "etag": "\"10e1-zSVP0x085izabZQ4/admljVcYd0\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 4321,
    "path": "../public/_nuxt/index.998237c3.js"
  },
  "/_nuxt/index.a18625a2.js": {
    "type": "application/javascript",
    "etag": "\"d26-qMZqoTxn/218rg/UpRfTPmcciSo\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 3366,
    "path": "../public/_nuxt/index.a18625a2.js"
  },
  "/_nuxt/index.a9c925d5.js": {
    "type": "application/javascript",
    "etag": "\"225-Khuq3/C7SxNvRvVm0zzXfO9S05Q\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 549,
    "path": "../public/_nuxt/index.a9c925d5.js"
  },
  "/_nuxt/index.aaa53866.js": {
    "type": "application/javascript",
    "etag": "\"218-6h+4J/L4Z5jr/4KPxP5T5jqXk4I\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 536,
    "path": "../public/_nuxt/index.aaa53866.js"
  },
  "/_nuxt/index.abdfbe71.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13995-5K/+i/0eyOR6IEJSdZbIE8q3o0w\"",
    "mtime": "2022-09-22T06:56:56.434Z",
    "size": 80277,
    "path": "../public/_nuxt/index.abdfbe71.css"
  },
  "/_nuxt/index.ada4b35a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13995-IXHzXE7ERUFXkIaBoujiLiWOGAI\"",
    "mtime": "2022-09-22T06:56:56.436Z",
    "size": 80277,
    "path": "../public/_nuxt/index.ada4b35a.css"
  },
  "/_nuxt/index.c579b7f5.js": {
    "type": "application/javascript",
    "etag": "\"1a38-Szn21Vfy4u1S2CekZBY8MII7gCU\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 6712,
    "path": "../public/_nuxt/index.c579b7f5.js"
  },
  "/_nuxt/index.ee04c362.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13995-BZQYgDBcBzQRvgf6a8lV6TwUEkk\"",
    "mtime": "2022-09-22T06:56:56.434Z",
    "size": 80277,
    "path": "../public/_nuxt/index.ee04c362.css"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-09-22T06:56:56.423Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.811f3195.js": {
    "type": "application/javascript",
    "etag": "\"14062-aEymr6QcKbstqB5ZUc222O57+Ps\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 82018,
    "path": "../public/_nuxt/Layout.811f3195.js"
  },
  "/_nuxt/logout.ae334cec.js": {
    "type": "application/javascript",
    "etag": "\"9c-V3kateQr8Is/qhnx3yKTAmqHvh0\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 156,
    "path": "../public/_nuxt/logout.ae334cec.js"
  },
  "/_nuxt/ModalView.f725dc87.js": {
    "type": "application/javascript",
    "etag": "\"1222e-o9vtPCuTkZc1Tf7JmXOhPsxbz6M\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 74286,
    "path": "../public/_nuxt/ModalView.f725dc87.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.4de973de.js": {
    "type": "application/javascript",
    "etag": "\"11133-hxaHHkOBGFQklEBc2No9plMlQU8\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 69939,
    "path": "../public/_nuxt/Profile.4de973de.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-09-22T06:56:56.427Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-09-22T06:56:56.426Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.062760b8.js": {
    "type": "application/javascript",
    "etag": "\"383-1ffxSRZn2pqObQsn6aYXabP8LEg\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 899,
    "path": "../public/_nuxt/RecoverPassword.062760b8.js"
  },
  "/_nuxt/RecoverPassword.965d8984.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"123ba-qiGZ+cghqYNg76Qm80FAqDRz1zE\"",
    "mtime": "2022-09-22T06:56:56.434Z",
    "size": 74682,
    "path": "../public/_nuxt/RecoverPassword.965d8984.css"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-09-22T06:56:56.428Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.21d3cca7.js": {
    "type": "application/javascript",
    "etag": "\"56ce-ZLsYQr+R3zlRMzctjFJ6QjgwKjw\"",
    "mtime": "2022-09-22T06:56:56.432Z",
    "size": 22222,
    "path": "../public/_nuxt/setting.21d3cca7.js"
  },
  "/_nuxt/Spinner.56d480ea.js": {
    "type": "application/javascript",
    "etag": "\"31b-yn+U256dolf+W03oap/5/a+MaJk\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.56d480ea.js"
  },
  "/_nuxt/TagFilterSelection.58f68130.js": {
    "type": "application/javascript",
    "etag": "\"5c4-rbcomfLmzz+b/+5XOVgDZhju4Mg\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 1476,
    "path": "../public/_nuxt/TagFilterSelection.58f68130.js"
  },
  "/_nuxt/useFeed.e93a5333.js": {
    "type": "application/javascript",
    "etag": "\"351c-hs9gYy4jOcj5uStcU4xemGCQuFE\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 13596,
    "path": "../public/_nuxt/useFeed.e93a5333.js"
  },
  "/_nuxt/useI18n.97a1667f.js": {
    "type": "application/javascript",
    "etag": "\"62-Q2RkOe7LYydQZiJ5qn5pt6inOGE\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.97a1667f.js"
  },
  "/_nuxt/user-counters-api.63ef0669.js": {
    "type": "application/javascript",
    "etag": "\"1585-OxW6fiE04RRPbQygI6mMcCr5UM4\"",
    "mtime": "2022-09-22T06:56:56.430Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.63ef0669.js"
  },
  "/_nuxt/useUser.094e0fe8.js": {
    "type": "application/javascript",
    "etag": "\"3ac5-kuXITdega0drJ4sgGpj4/GhX4fQ\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 15045,
    "path": "../public/_nuxt/useUser.094e0fe8.js"
  },
  "/_nuxt/_id.5ba0acab.js": {
    "type": "application/javascript",
    "etag": "\"269-YZKoHf6wH5mabZFbzcd+p/DgcxU\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 617,
    "path": "../public/_nuxt/_id.5ba0acab.js"
  },
  "/_nuxt/_id_.1c073e12.js": {
    "type": "application/javascript",
    "etag": "\"1a8f-R0iODFU/Uwfj8ILmc6KVkJrnMAs\"",
    "mtime": "2022-09-22T06:56:56.433Z",
    "size": 6799,
    "path": "../public/_nuxt/_id_.1c073e12.js"
  },
  "/_nuxt/_id_.29fb72b2.js": {
    "type": "application/javascript",
    "etag": "\"294-k8FMszynmau5m1I3OqltfFreNZA\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 660,
    "path": "../public/_nuxt/_id_.29fb72b2.js"
  },
  "/_nuxt/_id_.3f28f6e2.js": {
    "type": "application/javascript",
    "etag": "\"27d-aGPmi1saQrIXlgrSv/42Cyv6hx0\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 637,
    "path": "../public/_nuxt/_id_.3f28f6e2.js"
  },
  "/_nuxt/_id_.f8044268.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"125b8-fr48mZ9XTlX7s25DoMWPS5KUrlQ\"",
    "mtime": "2022-09-22T06:56:56.436Z",
    "size": 75192,
    "path": "../public/_nuxt/_id_.f8044268.css"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-09-22T06:56:56.429Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.fd7a91e9.js": {
    "type": "application/javascript",
    "etag": "\"317-TqRJfZnvMn8ic4iqNxX1luh2FLM\"",
    "mtime": "2022-09-22T06:56:56.431Z",
    "size": 791,
    "path": "../public/_nuxt/_username_.fd7a91e9.js"
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
const s = server.listen({ host, port }, (err) => {
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
