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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://public-api.upy.moe","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"upy10.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
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
    "etag": "\"f61-Ujdxunx85LN3Q+QerGwtuoIF8FM\"",
    "mtime": "2022-09-23T08:31:19.144Z",
    "size": 3937,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"f61-T7gDRo9XJBedX3qZP6/Brgqs078\"",
    "mtime": "2022-09-23T08:31:19.146Z",
    "size": 3937,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"f65-tUx5tYZR5Tr2uW4DDOmZjcHOT/E\"",
    "mtime": "2022-09-23T08:31:19.142Z",
    "size": 3941,
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
  "/_nuxt/AccountVerification.be527846.js": {
    "type": "application/javascript",
    "etag": "\"4aa-cVLpY24pfTQFEZIYwFNi4bDIQQk\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 1194,
    "path": "../public/_nuxt/AccountVerification.be527846.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.d2181764.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"368ee0-2ycfhn6vWttSWIWnOSZh9mItovM\"",
    "mtime": "2022-09-23T08:30:38.909Z",
    "size": 3575520,
    "path": "../public/_nuxt/entry.d2181764.css"
  },
  "/_nuxt/entry.fc4220be.js": {
    "type": "application/javascript",
    "etag": "\"9b966-9v0tiQHJ4ZfTvyUgyoPTc2RRBYs\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 637286,
    "path": "../public/_nuxt/entry.fc4220be.js"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.1e0666f0.js": {
    "type": "application/javascript",
    "etag": "\"8e3-aIbVxXCbGW76MJi0tR73vZs5Jmw\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.1e0666f0.js"
  },
  "/_nuxt/error-500.0b24c177.js": {
    "type": "application/javascript",
    "etag": "\"78c-n3GwsTUSFQnmmClTicYBwZgh6Pg\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.0b24c177.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.5f4a0884.js": {
    "type": "application/javascript",
    "etag": "\"4b5-T7zmLAzywXTzs1ozJJJ30Yj94bo\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.5f4a0884.js"
  },
  "/_nuxt/ErrorMessages.9a2b4b45.js": {
    "type": "application/javascript",
    "etag": "\"1aab-3vH+ZqxKQxL/LgjOJKEUX6JyOnE\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 6827,
    "path": "../public/_nuxt/ErrorMessages.9a2b4b45.js"
  },
  "/_nuxt/FeedModalView.ddf0bc64.js": {
    "type": "application/javascript",
    "etag": "\"327c-NCHjIDOeyRSdme0b/+8bDB8eqTM\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 12924,
    "path": "../public/_nuxt/FeedModalView.ddf0bc64.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/Icon.7928b8d2.js": {
    "type": "application/javascript",
    "etag": "\"7d9c-6luySkZ4QgzdXXTNfpqtlLSNAic\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 32156,
    "path": "../public/_nuxt/Icon.7928b8d2.js"
  },
  "/_nuxt/index.0156096f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139a3-/cG61WWFB/gwc5mBgX9bTOYF23Y\"",
    "mtime": "2022-09-23T08:30:38.905Z",
    "size": 80291,
    "path": "../public/_nuxt/index.0156096f.css"
  },
  "/_nuxt/index.0d857a7e.js": {
    "type": "application/javascript",
    "etag": "\"b72c-4B4HZbwggelYFfsogFu+aQTOtCk\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 46892,
    "path": "../public/_nuxt/index.0d857a7e.js"
  },
  "/_nuxt/index.1e3f02e3.js": {
    "type": "application/javascript",
    "etag": "\"173-RqlJINCZoaKBzuQx0Aa7texhBwk\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 371,
    "path": "../public/_nuxt/index.1e3f02e3.js"
  },
  "/_nuxt/index.231ca174.js": {
    "type": "application/javascript",
    "etag": "\"2a67-/HG9PKfcVaQ8tG5xk9fDclqL/os\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 10855,
    "path": "../public/_nuxt/index.231ca174.js"
  },
  "/_nuxt/index.2adfe997.js": {
    "type": "application/javascript",
    "etag": "\"218-kBziKxT/oHyLcH/0yi2DliSUUFg\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 536,
    "path": "../public/_nuxt/index.2adfe997.js"
  },
  "/_nuxt/index.332e4de7.js": {
    "type": "application/javascript",
    "etag": "\"1a38-aRlpoTzLkn//iL20caZK6jJ1IRs\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 6712,
    "path": "../public/_nuxt/index.332e4de7.js"
  },
  "/_nuxt/index.3831825b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139a3-4sex57ayNg2OzobB2PBosphYWcw\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 80291,
    "path": "../public/_nuxt/index.3831825b.css"
  },
  "/_nuxt/index.38cf8203.js": {
    "type": "application/javascript",
    "etag": "\"194-ve+ukGhjp9I4qxx3ianWAFTw15E\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 404,
    "path": "../public/_nuxt/index.38cf8203.js"
  },
  "/_nuxt/index.5082999f.js": {
    "type": "application/javascript",
    "etag": "\"f9-wRpJGYsA5E+0yLGQ+hMopfSlQCA\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 249,
    "path": "../public/_nuxt/index.5082999f.js"
  },
  "/_nuxt/index.5271da9b.js": {
    "type": "application/javascript",
    "etag": "\"10e1-4j0P/UsZM+68LDKzJZqZ62t5LAE\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 4321,
    "path": "../public/_nuxt/index.5271da9b.js"
  },
  "/_nuxt/index.5a0b7b87.js": {
    "type": "application/javascript",
    "etag": "\"17a3-vry+dI7FZUhB/mQsW54KWQxUrT8\"",
    "mtime": "2022-09-23T08:30:38.903Z",
    "size": 6051,
    "path": "../public/_nuxt/index.5a0b7b87.js"
  },
  "/_nuxt/index.5bfadea5.js": {
    "type": "application/javascript",
    "etag": "\"b859-oc55BhGQehVApseb+1BTrokRDCI\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 47193,
    "path": "../public/_nuxt/index.5bfadea5.js"
  },
  "/_nuxt/index.671133c4.js": {
    "type": "application/javascript",
    "etag": "\"17f-HsQVQVI+Ogb9i3YG0IJVdl2KZGM\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 383,
    "path": "../public/_nuxt/index.671133c4.js"
  },
  "/_nuxt/index.6acdab75.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139a3-iu7bFpzZ2ScC/t7AHJaF40EOCmM\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 80291,
    "path": "../public/_nuxt/index.6acdab75.css"
  },
  "/_nuxt/index.73c6ba99.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1278f-N0+ylKx/dJRzlDKQGYpDy3eHt1U\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 75663,
    "path": "../public/_nuxt/index.73c6ba99.css"
  },
  "/_nuxt/index.94100a2a.js": {
    "type": "application/javascript",
    "etag": "\"34d-/YeZBW7EEZCRAQCh8UDlcweNcF4\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 845,
    "path": "../public/_nuxt/index.94100a2a.js"
  },
  "/_nuxt/index.a463943d.js": {
    "type": "application/javascript",
    "etag": "\"18c4-y2RTT94CEoRFwsf38rfZMMPXft8\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 6340,
    "path": "../public/_nuxt/index.a463943d.js"
  },
  "/_nuxt/index.a5722b63.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"139a3-uk1prUGTeJ1/AHfGd0slkI2LcS4\"",
    "mtime": "2022-09-23T08:30:38.907Z",
    "size": 80291,
    "path": "../public/_nuxt/index.a5722b63.css"
  },
  "/_nuxt/index.aa6c3aed.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12ba4-FGiuCFM4TtTH0UW/JY3OA2xtp2I\"",
    "mtime": "2022-09-23T08:30:38.907Z",
    "size": 76708,
    "path": "../public/_nuxt/index.aa6c3aed.css"
  },
  "/_nuxt/index.cc7a6fa8.js": {
    "type": "application/javascript",
    "etag": "\"33b5-ePB1r/1pjVXJRaPqcgwl2PEcdTU\"",
    "mtime": "2022-09-23T08:30:38.903Z",
    "size": 13237,
    "path": "../public/_nuxt/index.cc7a6fa8.js"
  },
  "/_nuxt/index.d64bffd4.js": {
    "type": "application/javascript",
    "etag": "\"fdf-4jlrtIIq91/cPmBAaiDLRI/fBwk\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 4063,
    "path": "../public/_nuxt/index.d64bffd4.js"
  },
  "/_nuxt/index.d79b3726.js": {
    "type": "application/javascript",
    "etag": "\"d26-S1+ilJp1KgsIl73NWQxKqxTNCxk\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 3366,
    "path": "../public/_nuxt/index.d79b3726.js"
  },
  "/_nuxt/index.d7b03279.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13c7b-muf7dgyaXJikodN+1KDzteJg3+4\"",
    "mtime": "2022-09-23T08:30:38.905Z",
    "size": 81019,
    "path": "../public/_nuxt/index.d7b03279.css"
  },
  "/_nuxt/index.df4198b1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13fe5-gpp6k0P1zLBePW8f2PY494pvbbQ\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 81893,
    "path": "../public/_nuxt/index.df4198b1.css"
  },
  "/_nuxt/index.e52039c5.js": {
    "type": "application/javascript",
    "etag": "\"225-GMiBCNwirF3/sTe7WDZiHd/IFVs\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 549,
    "path": "../public/_nuxt/index.e52039c5.js"
  },
  "/_nuxt/index.f3b370cb.js": {
    "type": "application/javascript",
    "etag": "\"1f96-Gxx3iYyvMKYz/WYkoftPMZBxlWU\"",
    "mtime": "2022-09-23T08:30:38.903Z",
    "size": 8086,
    "path": "../public/_nuxt/index.f3b370cb.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-09-23T08:30:38.893Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-09-23T08:30:38.896Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-09-23T08:30:38.896Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-09-23T08:30:38.896Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-09-23T08:30:38.896Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-09-23T08:30:38.896Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.b986ff28.js": {
    "type": "application/javascript",
    "etag": "\"14124-ck192Yb+FlTGSug2aC7Q5Gpmi38\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 82212,
    "path": "../public/_nuxt/Layout.b986ff28.js"
  },
  "/_nuxt/logout.98adb39e.js": {
    "type": "application/javascript",
    "etag": "\"9c-/wTeSaUWyULxGsgcAQeNXLelGv8\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 156,
    "path": "../public/_nuxt/logout.98adb39e.js"
  },
  "/_nuxt/ModalView.7c3ba9df.js": {
    "type": "application/javascript",
    "etag": "\"1225c-gOmbwP4W1aoi9YFeEjEz6hGv8Ww\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 74332,
    "path": "../public/_nuxt/ModalView.7c3ba9df.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.42b0fe7d.js": {
    "type": "application/javascript",
    "etag": "\"11a5b-MTHsEZoiIGldJKmftOTo4ASrU28\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 72283,
    "path": "../public/_nuxt/Profile.42b0fe7d.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.3f81a028.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"123c8-gWJ0mgamBkMmqINCeB8tuuwt9Pk\"",
    "mtime": "2022-09-23T08:30:38.907Z",
    "size": 74696,
    "path": "../public/_nuxt/RecoverPassword.3f81a028.css"
  },
  "/_nuxt/RecoverPassword.642ea9ef.js": {
    "type": "application/javascript",
    "etag": "\"383-wBpTYS3SLNkIhgg2YqPThjTnZPk\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 899,
    "path": "../public/_nuxt/RecoverPassword.642ea9ef.js"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-09-23T08:30:38.897Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.a3a162a1.js": {
    "type": "application/javascript",
    "etag": "\"56ce-mmn2oSfbx+UIMYCs5aeTJIWxvjA\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 22222,
    "path": "../public/_nuxt/setting.a3a162a1.js"
  },
  "/_nuxt/Spinner.39585f84.js": {
    "type": "application/javascript",
    "etag": "\"31b-mmv6XhLw8rpiwbFwd9tl0D7XvlE\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.39585f84.js"
  },
  "/_nuxt/TagFilterSelection.671e439f.js": {
    "type": "application/javascript",
    "etag": "\"5c4-LsOuWRmtHxqXBte9Vzo4d44I0Y8\"",
    "mtime": "2022-09-23T08:30:38.903Z",
    "size": 1476,
    "path": "../public/_nuxt/TagFilterSelection.671e439f.js"
  },
  "/_nuxt/useFeed.754f0795.js": {
    "type": "application/javascript",
    "etag": "\"351c-MW96OrSDps00HkKUIgEoWMVMmz0\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 13596,
    "path": "../public/_nuxt/useFeed.754f0795.js"
  },
  "/_nuxt/useI18n.2fe67126.js": {
    "type": "application/javascript",
    "etag": "\"62-YxA6Zwasc4Gsh0vWE9EQJyGHpL0\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.2fe67126.js"
  },
  "/_nuxt/user-counters-api.b0bb9dce.js": {
    "type": "application/javascript",
    "etag": "\"1585-8HdIbJRqMZbtgFjp6OIXHpe4waw\"",
    "mtime": "2022-09-23T08:30:38.900Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.b0bb9dce.js"
  },
  "/_nuxt/useUser.a9f1b3f4.js": {
    "type": "application/javascript",
    "etag": "\"3ac5-tckPPDIR33i70adFT7MIcoovbaM\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 15045,
    "path": "../public/_nuxt/useUser.a9f1b3f4.js"
  },
  "/_nuxt/_id.56b1d5c1.js": {
    "type": "application/javascript",
    "etag": "\"269-062uH8/Mj5NQLIZirl0eMtI3lco\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 617,
    "path": "../public/_nuxt/_id.56b1d5c1.js"
  },
  "/_nuxt/_id_.323349f9.js": {
    "type": "application/javascript",
    "etag": "\"1a8f-G/bKjcuZAA3JGfWc4h9dzNSSaHY\"",
    "mtime": "2022-09-23T08:30:38.904Z",
    "size": 6799,
    "path": "../public/_nuxt/_id_.323349f9.js"
  },
  "/_nuxt/_id_.3602fedc.js": {
    "type": "application/javascript",
    "etag": "\"294-uCBvCTUwdsMAjQoWYmn5CG8EZpY\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 660,
    "path": "../public/_nuxt/_id_.3602fedc.js"
  },
  "/_nuxt/_id_.5bbc8056.js": {
    "type": "application/javascript",
    "etag": "\"27d-R/OVZuBNwF+TQUZlwb9MMb5EaqY\"",
    "mtime": "2022-09-23T08:30:38.901Z",
    "size": 637,
    "path": "../public/_nuxt/_id_.5bbc8056.js"
  },
  "/_nuxt/_id_.dedbecfc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"125c6-ZVg8FOqkd5kUNzwtadiIB4F6jKw\"",
    "mtime": "2022-09-23T08:30:38.908Z",
    "size": 75206,
    "path": "../public/_nuxt/_id_.dedbecfc.css"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-09-23T08:30:38.899Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.18f35718.js": {
    "type": "application/javascript",
    "etag": "\"317-FxjpO0ppTTEK57dyVsjP/xAQVls\"",
    "mtime": "2022-09-23T08:30:38.902Z",
    "size": 791,
    "path": "../public/_nuxt/_username_.18f35718.js"
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
