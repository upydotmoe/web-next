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

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://api.upy.moe","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"up12.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
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
    "etag": "\"12d6-X9O8C92lUmZhKeGIjFlEOID2PwY\"",
    "mtime": "2022-10-14T12:11:31.183Z",
    "size": 4822,
    "path": "../public/200.html"
  },
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d6-X9O8C92lUmZhKeGIjFlEOID2PwY\"",
    "mtime": "2022-10-14T12:11:31.185Z",
    "size": 4822,
    "path": "../public/404.html"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"12d6-X9O8C92lUmZhKeGIjFlEOID2PwY\"",
    "mtime": "2022-10-14T12:11:31.181Z",
    "size": 4822,
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
  "/_nuxt/AccountVerification.02431737.js": {
    "type": "application/javascript",
    "etag": "\"4b0-ZXHgg0pqzWEfvy6cHboaXBQ6yGQ\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 1200,
    "path": "../public/_nuxt/AccountVerification.02431737.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-10-14T12:10:46.043Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.879fa290.js": {
    "type": "application/javascript",
    "etag": "\"e4f45-fFniUz9ydTkcKbAVanBBua9xrjw\"",
    "mtime": "2022-10-14T12:10:46.048Z",
    "size": 937797,
    "path": "../public/_nuxt/entry.879fa290.js"
  },
  "/_nuxt/entry.cd6bea3c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"36286f-maA1TLwZGKeCj2JzpIrGPe10yTo\"",
    "mtime": "2022-10-14T12:10:46.057Z",
    "size": 3549295,
    "path": "../public/_nuxt/entry.cd6bea3c.css"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-10-14T12:10:46.053Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.511800e9.js": {
    "type": "application/javascript",
    "etag": "\"8e3-3N1J+WGW0B/cb6EPMA4RtoStnuc\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.511800e9.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-500.e9f291b1.js": {
    "type": "application/javascript",
    "etag": "\"78c-dWTnROJVYuayoikGz0HAn1mSb1s\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.e9f291b1.js"
  },
  "/_nuxt/error-component.b6eb611f.js": {
    "type": "application/javascript",
    "etag": "\"4b5-iJXiJYAGTpXzptXSp7/nJo7jN3c\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.b6eb611f.js"
  },
  "/_nuxt/FeedModalView.d8762133.js": {
    "type": "application/javascript",
    "etag": "\"378f-KK1FzwcoPbrFjePF0UIh7jDGe1U\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 14223,
    "path": "../public/_nuxt/FeedModalView.d8762133.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/index.04af2868.js": {
    "type": "application/javascript",
    "etag": "\"f9-WiQDhWLarDwqGAGQiqxGOeKQVlw\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 249,
    "path": "../public/_nuxt/index.04af2868.js"
  },
  "/_nuxt/index.0990a346.js": {
    "type": "application/javascript",
    "etag": "\"1fc9-13GtEK+9pl7VOwQiGnHc2LLwb74\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 8137,
    "path": "../public/_nuxt/index.0990a346.js"
  },
  "/_nuxt/index.0e231e20.js": {
    "type": "application/javascript",
    "etag": "\"d37-1ct2JzkhSV2ebmj0ZHtXVUJRNRA\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 3383,
    "path": "../public/_nuxt/index.0e231e20.js"
  },
  "/_nuxt/index.1b978e48.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1373e-bvSEv02Fk40ChMr/B2HI3+H1Izc\"",
    "mtime": "2022-10-14T12:10:46.053Z",
    "size": 79678,
    "path": "../public/_nuxt/index.1b978e48.css"
  },
  "/_nuxt/index.4f057941.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13a2b-CBUkZSpNyPzz+T+vQXk9ccQYM8s\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 80427,
    "path": "../public/_nuxt/index.4f057941.css"
  },
  "/_nuxt/index.6547d894.js": {
    "type": "application/javascript",
    "etag": "\"18d5-PFREfTFzpuEUTOOihxEHvmtTpiY\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 6357,
    "path": "../public/_nuxt/index.6547d894.js"
  },
  "/_nuxt/index.760866c0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1373e-BWhh2w1+ugsSGE2wijOKOwn+y1A\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 79678,
    "path": "../public/_nuxt/index.760866c0.css"
  },
  "/_nuxt/index.77f9f84d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12540-2QmrWj0rit06NGUo+zKfhEa7r3o\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 75072,
    "path": "../public/_nuxt/index.77f9f84d.css"
  },
  "/_nuxt/index.7eb2673f.js": {
    "type": "application/javascript",
    "etag": "\"352-WQIGHn76CjpysHbXaq2gnJEjSvg\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 850,
    "path": "../public/_nuxt/index.7eb2673f.js"
  },
  "/_nuxt/index.7ee5a082.js": {
    "type": "application/javascript",
    "etag": "\"179-+g7fKwLPo3rPDdByd8FwWOfR4Ik\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 377,
    "path": "../public/_nuxt/index.7ee5a082.js"
  },
  "/_nuxt/index.8d7e3c82.js": {
    "type": "application/javascript",
    "etag": "\"10e3-0kI64XG7pgT5YuKa7sZIwa05xN8\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 4323,
    "path": "../public/_nuxt/index.8d7e3c82.js"
  },
  "/_nuxt/index.9682ae7b.js": {
    "type": "application/javascript",
    "etag": "\"229-Ox0XhS8laWN/AF1NHwpQUX9zu5I\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 553,
    "path": "../public/_nuxt/index.9682ae7b.js"
  },
  "/_nuxt/index.a36d50c3.js": {
    "type": "application/javascript",
    "etag": "\"17a4-VBZDlosX+fPtQQmdQX6Hk8W4SYY\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 6052,
    "path": "../public/_nuxt/index.a36d50c3.js"
  },
  "/_nuxt/index.bd6b9617.js": {
    "type": "application/javascript",
    "etag": "\"1a6a-9OG+ZoB8xWXIpEj4lcVir+vT52E\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 6762,
    "path": "../public/_nuxt/index.bd6b9617.js"
  },
  "/_nuxt/index.be47b245.js": {
    "type": "application/javascript",
    "etag": "\"19a-E7nk57UGcexAs4OUPKr7D0L6E3E\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 410,
    "path": "../public/_nuxt/index.be47b245.js"
  },
  "/_nuxt/index.c27eab06.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12955-xcIUst+HgH+4mIEmAE+feKYqDcU\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 76117,
    "path": "../public/_nuxt/index.c27eab06.css"
  },
  "/_nuxt/index.dca22a64.js": {
    "type": "application/javascript",
    "etag": "\"33c8-sTy3pPKab1pUTmmci+FL/Oo8sgE\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 13256,
    "path": "../public/_nuxt/index.dca22a64.js"
  },
  "/_nuxt/index.dd6da9f8.js": {
    "type": "application/javascript",
    "etag": "\"3707-Btmorasu3o23zCLI2H0jE2r1iXY\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 14087,
    "path": "../public/_nuxt/index.dd6da9f8.js"
  },
  "/_nuxt/index.decf1c69.js": {
    "type": "application/javascript",
    "etag": "\"2b2c-b+PXfqz0ji5aCNCq7X1exSdQCvo\"",
    "mtime": "2022-10-14T12:10:46.051Z",
    "size": 11052,
    "path": "../public/_nuxt/index.decf1c69.js"
  },
  "/_nuxt/index.e93e9f29.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13d96-aDkq0rLW502GEkKFaRDxh13MT2s\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 81302,
    "path": "../public/_nuxt/index.e93e9f29.css"
  },
  "/_nuxt/index.e9e274c9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1373e-iGHoRydRP57XsGLfhNGicL0cRbM\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 79678,
    "path": "../public/_nuxt/index.e9e274c9.css"
  },
  "/_nuxt/index.eaed0e1e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1373e-3z/5CxzM+NkM/E/QfYqLlHMXuLs\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 79678,
    "path": "../public/_nuxt/index.eaed0e1e.css"
  },
  "/_nuxt/index.ec9c53b6.js": {
    "type": "application/javascript",
    "etag": "\"18a-Rbr0NTLizQEfm9UBMMWBiaqrlKw\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 394,
    "path": "../public/_nuxt/index.ec9c53b6.js"
  },
  "/_nuxt/index.f8f51853.js": {
    "type": "application/javascript",
    "etag": "\"236-kH3DiILsewHr1TnZijmNDiSaXLU\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 566,
    "path": "../public/_nuxt/index.f8f51853.js"
  },
  "/_nuxt/index.face740c.js": {
    "type": "application/javascript",
    "etag": "\"ffa-Dy6Ei68sutYbHPPfZwl6SNAv9ho\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 4090,
    "path": "../public/_nuxt/index.face740c.js"
  },
  "/_nuxt/index.fe13548e.js": {
    "type": "application/javascript",
    "etag": "\"b4d1-6lFKU6rFT2XXkSTcZJ3hVMYCuA8\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 46289,
    "path": "../public/_nuxt/index.fe13548e.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.b50292ba.js": {
    "type": "application/javascript",
    "etag": "\"14f49-X9bobMgwVlygwqmx7FVk5DbuaSs\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 85833,
    "path": "../public/_nuxt/Layout.b50292ba.js"
  },
  "/_nuxt/LoadingEmptyErrorMessage.c774b096.js": {
    "type": "application/javascript",
    "etag": "\"1b47-jAjkHFvR5DNT0kA20FnO5zdzJPg\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 6983,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.c774b096.js"
  },
  "/_nuxt/logout.3a0cad9e.js": {
    "type": "application/javascript",
    "etag": "\"9d-FCkKi299+qr/0LoayUVdjAxmtGk\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 157,
    "path": "../public/_nuxt/logout.3a0cad9e.js"
  },
  "/_nuxt/ModalView.20a27763.js": {
    "type": "application/javascript",
    "etag": "\"13c80-3Pb8ddh1hnfVW3aJPy9tvfWQfHU\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 81024,
    "path": "../public/_nuxt/ModalView.20a27763.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.91067d8f.js": {
    "type": "application/javascript",
    "etag": "\"12b68-YYgIGr5k4a6P2nvdIqyi2I4GASM\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 76648,
    "path": "../public/_nuxt/Profile.91067d8f.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-10-14T12:10:46.045Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.02c0d45c.js": {
    "type": "application/javascript",
    "etag": "\"389-JlkOgvKM7EXNv6QpPRgPdilc/aw\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 905,
    "path": "../public/_nuxt/RecoverPassword.02c0d45c.js"
  },
  "/_nuxt/RecoverPassword.fae8213e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12179-y29uoZUQHO6VoAcq/Q0JZ4WkQ4Y\"",
    "mtime": "2022-10-14T12:10:46.053Z",
    "size": 74105,
    "path": "../public/_nuxt/RecoverPassword.fae8213e.css"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-10-14T12:10:46.044Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.ccdbc824.js": {
    "type": "application/javascript",
    "etag": "\"578b-P4eyzxOzmGt/fRZsoUbT2TQqgtU\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 22411,
    "path": "../public/_nuxt/setting.ccdbc824.js"
  },
  "/_nuxt/Spinner.cf543d74.js": {
    "type": "application/javascript",
    "etag": "\"31b-oNgxyGPhCEU6QXacuGwkhx71CD0\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.cf543d74.js"
  },
  "/_nuxt/TagFilterSelection.a455c13e.js": {
    "type": "application/javascript",
    "etag": "\"5d4-tAigf6easQNzfd9wc73f2/65ZAQ\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 1492,
    "path": "../public/_nuxt/TagFilterSelection.a455c13e.js"
  },
  "/_nuxt/useArtwork.23f2471a.js": {
    "type": "application/javascript",
    "etag": "\"7c31-gj05u/N4wvVd06p/QRvYMKBv46M\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 31793,
    "path": "../public/_nuxt/useArtwork.23f2471a.js"
  },
  "/_nuxt/useFeed.ea08ed29.js": {
    "type": "application/javascript",
    "etag": "\"3cba-axVJ8yJj6elVFbX+xCRtBTsd5VI\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 15546,
    "path": "../public/_nuxt/useFeed.ea08ed29.js"
  },
  "/_nuxt/useI18n.948ee0c0.js": {
    "type": "application/javascript",
    "etag": "\"62-p9uOySLT/pjUvi6+tATZAZjzWiM\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.948ee0c0.js"
  },
  "/_nuxt/user-counters-api.55343b8b.js": {
    "type": "application/javascript",
    "etag": "\"1585-zPkfuTx+D4+0/KaaoEiYy2BfKPw\"",
    "mtime": "2022-10-14T12:10:46.048Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.55343b8b.js"
  },
  "/_nuxt/useUser.c1a51eb5.js": {
    "type": "application/javascript",
    "etag": "\"3acb-6YOzlPHOi0NV5R4ZJG7Eb9hvmc4\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 15051,
    "path": "../public/_nuxt/useUser.c1a51eb5.js"
  },
  "/_nuxt/_id.c7024a9c.js": {
    "type": "application/javascript",
    "etag": "\"27a-viZ/JgxvqsiFG3iRLeyMplVKDQw\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 634,
    "path": "../public/_nuxt/_id.c7024a9c.js"
  },
  "/_nuxt/_id_.3a3aa333.js": {
    "type": "application/javascript",
    "etag": "\"436-MkXKA5ynNZg2EA0KDBmVLJNqUN0\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 1078,
    "path": "../public/_nuxt/_id_.3a3aa333.js"
  },
  "/_nuxt/_id_.6f17428e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12377-4LZPRT1CwCjMfjJrrqCe1vxgIEQ\"",
    "mtime": "2022-10-14T12:10:46.056Z",
    "size": 74615,
    "path": "../public/_nuxt/_id_.6f17428e.css"
  },
  "/_nuxt/_id_.cb7f8830.js": {
    "type": "application/javascript",
    "etag": "\"1a92-jhBjAwKxEUp72zSqcjLZlpDSu2I\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 6802,
    "path": "../public/_nuxt/_id_.cb7f8830.js"
  },
  "/_nuxt/_id_.e62c1385.js": {
    "type": "application/javascript",
    "etag": "\"40b-PpV+NXSdhpozAQjlbm1qZRWBCsI\"",
    "mtime": "2022-10-14T12:10:46.049Z",
    "size": 1035,
    "path": "../public/_nuxt/_id_.e62c1385.js"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-10-14T12:10:46.047Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.6553fc59.js": {
    "type": "application/javascript",
    "etag": "\"346-Mc+kdsnp6GaOc+YWOb4u5YoQmJ8\"",
    "mtime": "2022-10-14T12:10:46.050Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.6553fc59.js"
  },
  "/_nuxt/_username_.ff3f1002.js": {
    "type": "application/javascript",
    "etag": "\"346-Mc+kdsnp6GaOc+YWOb4u5YoQmJ8\"",
    "mtime": "2022-10-14T12:10:46.052Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.ff3f1002.js"
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
