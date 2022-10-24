globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, createError, lazyEventHandler, createApp, createRouter as createRouter$1, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash, joinURL } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';
import { fileURLToPath as fileURLToPath$1 } from 'node:url';
import { createIPX, createIPXMiddleware } from 'ipx';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routeRules":{"/__nuxt_error":{"cache":false}},"envPrefix":"NUXT_"},"public":{"dev":false,"apiUrl":"https://api.upy.moe","appUrl":"https://upy.moe","activeCdn":"bunny","cloudflareUrl":"photos.niazatech.com","bunnyUrl":"up12.b-cdn.net","staticallyCdn":"https://cdn.statically.io/img"},"ipx":{"dir":"","domains":["localhost","upy.moe"],"sharp":{},"alias":{}}};
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
const config$1 = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config$1;
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
const timingMiddleware = eventHandler((event) => {
  const start = globalTiming.start();
  const _end = event.res.end;
  event.res.end = function(chunk, encoding, cb) {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!event.res.headersSent) {
      event.res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(event.res, chunk, encoding, cb);
    return this;
  }.bind(event.res);
});

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

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(createRouter({ routes: config.nitro.routeRules }));
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(event, routeRules.redirect.to, routeRules.redirect.statusCode);
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(path);
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

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
  const validate = opts.validate || (() => true);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
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
      if (validate(entry)) {
        useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
      }
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
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
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
    let _resSendBody;
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
      },
      end(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      write(chunk, arg2, arg3) {
        if (typeof chunk === "string") {
          _resSendBody = chunk;
        }
        if (typeof arg2 === "function") {
          arg2();
        }
        if (typeof arg3 === "function") {
          arg3();
        }
        return this;
      },
      writeHead(statusCode, headers2) {
        this.statusCode = statusCode;
        if (headers2) {
          for (const header in headers2) {
            this.setHeader(header, headers2[header]);
          }
        }
        return this;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event) || _resSendBody;
    const headers = event.res.getHeaders();
    headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
    headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || new Date().toUTCString();
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
      headers["cache-control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
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

const script = "const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _02kC61PisY = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _02kC61PisY
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
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
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
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
  event.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.res.statusMessage = errorObject.statusMessage;
  }
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
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2202-oHbwm0MIkO+aypcLua1aq7dPwck\"",
    "mtime": "2022-10-21T12:16:12.836Z",
    "size": 8706,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-10-21T12:16:12.523Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-10-21T12:16:12.603Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-10-21T12:16:12.618Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-10-21T12:16:12.562Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2022-10-21T12:16:12.576Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-10-21T12:16:12.668Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-10-21T12:16:12.835Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Lato-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-10-21T12:16:12.610Z",
    "size": 5472,
    "path": "../public/fonts/Lato-400-8.woff2"
  },
  "/fonts/Lato-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-10-21T12:16:12.616Z",
    "size": 23580,
    "path": "../public/fonts/Lato-400-9.woff2"
  },
  "/fonts/Nunito-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-10-21T12:16:12.619Z",
    "size": 10372,
    "path": "../public/fonts/Nunito-400-10.woff2"
  },
  "/fonts/Nunito-400-11.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-10-21T12:16:12.544Z",
    "size": 7780,
    "path": "../public/fonts/Nunito-400-11.woff2"
  },
  "/fonts/Nunito-400-12.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-10-21T12:16:12.520Z",
    "size": 4252,
    "path": "../public/fonts/Nunito-400-12.woff2"
  },
  "/fonts/Nunito-400-13.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-10-21T12:16:12.550Z",
    "size": 12736,
    "path": "../public/fonts/Nunito-400-13.woff2"
  },
  "/fonts/Nunito-400-14.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-10-21T12:16:12.638Z",
    "size": 14060,
    "path": "../public/fonts/Nunito-400-14.woff2"
  },
  "/fonts/Poppins-400-15.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-10-21T12:16:12.636Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-15.woff2"
  },
  "/fonts/Poppins-400-16.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-10-21T12:16:12.604Z",
    "size": 5544,
    "path": "../public/fonts/Poppins-400-16.woff2"
  },
  "/fonts/Poppins-400-17.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-10-21T12:16:12.612Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-17.woff2"
  },
  "/fonts/Quicksand-400-18.woff2": {
    "type": "font/woff2",
    "etag": "\"e40-ueOd0idOrOcHm89BrZFoiH4yADg\"",
    "mtime": "2022-10-21T12:16:12.638Z",
    "size": 3648,
    "path": "../public/fonts/Quicksand-400-18.woff2"
  },
  "/fonts/Quicksand-400-19.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-10-21T12:16:12.644Z",
    "size": 11564,
    "path": "../public/fonts/Quicksand-400-19.woff2"
  },
  "/fonts/Quicksand-400-20.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-10-21T12:16:12.610Z",
    "size": 13888,
    "path": "../public/fonts/Quicksand-400-20.woff2"
  },
  "/fonts/Readex_Pro-400-21.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-10-21T12:16:12.556Z",
    "size": 8820,
    "path": "../public/fonts/Readex_Pro-400-21.woff2"
  },
  "/fonts/Readex_Pro-400-22.woff2": {
    "type": "font/woff2",
    "etag": "\"e08-mJZvi/KTLLbEpU4gc8JE6zvkzQo\"",
    "mtime": "2022-10-21T12:16:12.628Z",
    "size": 3592,
    "path": "../public/fonts/Readex_Pro-400-22.woff2"
  },
  "/fonts/Readex_Pro-400-23.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-10-21T12:16:12.700Z",
    "size": 9752,
    "path": "../public/fonts/Readex_Pro-400-23.woff2"
  },
  "/fonts/Readex_Pro-400-24.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-10-21T12:16:12.592Z",
    "size": 12208,
    "path": "../public/fonts/Readex_Pro-400-24.woff2"
  },
  "/fonts/Rubik-400-25.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-10-21T12:16:12.535Z",
    "size": 5832,
    "path": "../public/fonts/Rubik-400-25.woff2"
  },
  "/fonts/Rubik-400-26.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-10-21T12:16:12.603Z",
    "size": 7296,
    "path": "../public/fonts/Rubik-400-26.woff2"
  },
  "/fonts/Rubik-400-27.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-10-21T12:16:12.629Z",
    "size": 4392,
    "path": "../public/fonts/Rubik-400-27.woff2"
  },
  "/fonts/Rubik-400-28.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-10-21T12:16:12.569Z",
    "size": 8712,
    "path": "../public/fonts/Rubik-400-28.woff2"
  },
  "/fonts/Rubik-400-29.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-10-21T12:16:12.616Z",
    "size": 17132,
    "path": "../public/fonts/Rubik-400-29.woff2"
  },
  "/_nuxt/AccountVerification.44a51cf8.js": {
    "type": "application/javascript",
    "etag": "\"4ac-6ZxS7jMUqVgxmMNFSOysPXPZX9c\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 1196,
    "path": "../public/_nuxt/AccountVerification.44a51cf8.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.0330daa5.js": {
    "type": "application/javascript",
    "etag": "\"e580f-KNae1B3G+XUnCrHxqJdu/MBIFN4\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 940047,
    "path": "../public/_nuxt/entry.0330daa5.js"
  },
  "/_nuxt/entry.6f2bb15b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"38bdb6-iHTycYxvYvjQ9WKrwhUg02nMcVM\"",
    "mtime": "2022-10-21T12:17:07.924Z",
    "size": 3718582,
    "path": "../public/_nuxt/entry.6f2bb15b.css"
  },
  "/_nuxt/error-404.18ced855.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e2e-F8gJ3uSz6Dg2HRyb374Ax3RegKE\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 3630,
    "path": "../public/_nuxt/error-404.18ced855.css"
  },
  "/_nuxt/error-404.3ac4d636.js": {
    "type": "application/javascript",
    "etag": "\"8e3-0OWMRXsfKOCiUlA5Sj9ROHlhqTM\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 2275,
    "path": "../public/_nuxt/error-404.3ac4d636.js"
  },
  "/_nuxt/error-500.c8fd503f.js": {
    "type": "application/javascript",
    "etag": "\"78c-l+iGp5nqE/mAMA5znLuCGccvXz4\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 1932,
    "path": "../public/_nuxt/error-500.c8fd503f.js"
  },
  "/_nuxt/error-500.e60962de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"79e-VhleGjkSRH7z4cQDJV3dxcboMhU\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 1950,
    "path": "../public/_nuxt/error-500.e60962de.css"
  },
  "/_nuxt/error-component.4b385de5.js": {
    "type": "application/javascript",
    "etag": "\"4b5-fpqy6fGbh0aAMWlud++0aiJJrX0\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 1205,
    "path": "../public/_nuxt/error-component.4b385de5.js"
  },
  "/_nuxt/FeedModalView.ad430ea4.js": {
    "type": "application/javascript",
    "etag": "\"378f-Y1qeVDJRHpMeHoCYZb8uYMMp+js\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 14223,
    "path": "../public/_nuxt/FeedModalView.ad430ea4.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/index.02f61f44.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14c21-/MX1bOC2yNVQTnEuRE1A5kwEJfM\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 85025,
    "path": "../public/_nuxt/index.02f61f44.css"
  },
  "/_nuxt/index.0780e7c6.js": {
    "type": "application/javascript",
    "etag": "\"179-wq27qqCHUFvVzyvO48i8bpNdgo4\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 377,
    "path": "../public/_nuxt/index.0780e7c6.js"
  },
  "/_nuxt/index.097394ef.js": {
    "type": "application/javascript",
    "etag": "\"352-kWWkX4omf37t95CWAdLXYCXtMuw\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 850,
    "path": "../public/_nuxt/index.097394ef.js"
  },
  "/_nuxt/index.0a0ad026.js": {
    "type": "application/javascript",
    "etag": "\"b72b-tPhbFzrpG5d9qMguTWtcM6Mt+Uc\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 46891,
    "path": "../public/_nuxt/index.0a0ad026.js"
  },
  "/_nuxt/index.100eb40d.js": {
    "type": "application/javascript",
    "etag": "\"279-xq0QYscVKhlFVVaZ/UA5JhplZrc\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 633,
    "path": "../public/_nuxt/index.100eb40d.js"
  },
  "/_nuxt/index.11995c5d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"148b6-fsY8PqgisWowZuRR9mSAKkWgEHc\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 84150,
    "path": "../public/_nuxt/index.11995c5d.css"
  },
  "/_nuxt/index.21344c62.js": {
    "type": "application/javascript",
    "etag": "\"33c8-xZ5UG1q8VRefRW5G/DIxj8m78OA\"",
    "mtime": "2022-10-21T12:17:07.918Z",
    "size": 13256,
    "path": "../public/_nuxt/index.21344c62.js"
  },
  "/_nuxt/index.226568bb.js": {
    "type": "application/javascript",
    "etag": "\"19a-xRXrwR1IYA7si44LucN3JO5HNXg\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 410,
    "path": "../public/_nuxt/index.226568bb.js"
  },
  "/_nuxt/index.2ae0f744.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"145c9-BXTYAlVDsoh9ULpO4YCnM77mlVo\"",
    "mtime": "2022-10-21T12:17:07.923Z",
    "size": 83401,
    "path": "../public/_nuxt/index.2ae0f744.css"
  },
  "/_nuxt/index.3fac83cf.js": {
    "type": "application/javascript",
    "etag": "\"18d5-nARP/OW+81KD4+uFN1ZSTAMVSJs\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 6357,
    "path": "../public/_nuxt/index.3fac83cf.js"
  },
  "/_nuxt/index.40cd6d36.js": {
    "type": "application/javascript",
    "etag": "\"d37-Burl9xQmyDCq9KtLw58Pi//kvC4\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 3383,
    "path": "../public/_nuxt/index.40cd6d36.js"
  },
  "/_nuxt/index.418fa668.js": {
    "type": "application/javascript",
    "etag": "\"2018-9lJ0bCWszoM1c7/14GTVOSWP/6U\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 8216,
    "path": "../public/_nuxt/index.418fa668.js"
  },
  "/_nuxt/index.489b746d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"133cb-do08sLNLdt00Z0hWKWZiWsbCV8Q\"",
    "mtime": "2022-10-21T12:17:07.920Z",
    "size": 78795,
    "path": "../public/_nuxt/index.489b746d.css"
  },
  "/_nuxt/index.538c7b97.js": {
    "type": "application/javascript",
    "etag": "\"18a-+b/la4Y+FojVyZJu0FxuFEOr5as\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 394,
    "path": "../public/_nuxt/index.538c7b97.js"
  },
  "/_nuxt/index.87035c6a.js": {
    "type": "application/javascript",
    "etag": "\"f9-LTiV+MwDypCDMKdS6yjB+8DBWs8\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 249,
    "path": "../public/_nuxt/index.87035c6a.js"
  },
  "/_nuxt/index.87784500.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"145c9-7FFML9exHjbjClIGvz2QtXDeASo\"",
    "mtime": "2022-10-21T12:17:07.923Z",
    "size": 83401,
    "path": "../public/_nuxt/index.87784500.css"
  },
  "/_nuxt/index.937079c6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"145c9-fg7WFAWizrLHaz3H5rYnZNWylLo\"",
    "mtime": "2022-10-21T12:17:07.923Z",
    "size": 83401,
    "path": "../public/_nuxt/index.937079c6.css"
  },
  "/_nuxt/index.9631d8a4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"137e0-ediNArEjCLU5GWuN3Hnn2/JCBQM\"",
    "mtime": "2022-10-21T12:17:07.920Z",
    "size": 79840,
    "path": "../public/_nuxt/index.9631d8a4.css"
  },
  "/_nuxt/index.9b13eead.js": {
    "type": "application/javascript",
    "etag": "\"1774-ikmKQe2yW8QFl40q1wTLhjTAXNU\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 6004,
    "path": "../public/_nuxt/index.9b13eead.js"
  },
  "/_nuxt/index.a25dfe3d.js": {
    "type": "application/javascript",
    "etag": "\"1a6b-pkYlL6NJ9CfP9POTbgAlKyUfJZk\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 6763,
    "path": "../public/_nuxt/index.a25dfe3d.js"
  },
  "/_nuxt/index.bb92464b.js": {
    "type": "application/javascript",
    "etag": "\"10e3-FzMIzoeurbA/nw/Hcus1x+ZNSFk\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 4323,
    "path": "../public/_nuxt/index.bb92464b.js"
  },
  "/_nuxt/index.c18409a0.js": {
    "type": "application/javascript",
    "etag": "\"ffa-L0TBDE0zN18wdngTyBRt765gR3Y\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 4090,
    "path": "../public/_nuxt/index.c18409a0.js"
  },
  "/_nuxt/index.f256dd67.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"145c9-D+OMYHfLZZ/kmtagwLLRnIsP8SM\"",
    "mtime": "2022-10-21T12:17:07.923Z",
    "size": 83401,
    "path": "../public/_nuxt/index.f256dd67.css"
  },
  "/_nuxt/index.f9a17790.js": {
    "type": "application/javascript",
    "etag": "\"229-fk7qJ5EtxbFe6FLsh/wBIEbXtVU\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 553,
    "path": "../public/_nuxt/index.f9a17790.js"
  },
  "/_nuxt/index.fa8376da.js": {
    "type": "application/javascript",
    "etag": "\"2b2c-I4IQHfROLA4FRQGq/YJgHDsbno0\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 11052,
    "path": "../public/_nuxt/index.fa8376da.js"
  },
  "/_nuxt/index.fbea068e.js": {
    "type": "application/javascript",
    "etag": "\"376b-2JHRDmTEotGfdxM5geMcL2E1aIY\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 14187,
    "path": "../public/_nuxt/index.fbea068e.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2022-10-21T12:17:07.910Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2022-10-21T12:17:07.909Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2022-10-21T12:17:07.910Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Lato-400-8.1c2fc265.woff2": {
    "type": "font/woff2",
    "etag": "\"1560-7VPp+JZxQupKov0RP2lnmTGdkbI\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 5472,
    "path": "../public/_nuxt/Lato-400-8.1c2fc265.woff2"
  },
  "/_nuxt/Lato-400-9.918b7dc3.woff2": {
    "type": "font/woff2",
    "etag": "\"5c1c-/NQTYIXyoDSB2ZWMxnk6XtmOcUw\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 23580,
    "path": "../public/_nuxt/Lato-400-9.918b7dc3.woff2"
  },
  "/_nuxt/Layout.95a54192.js": {
    "type": "application/javascript",
    "etag": "\"14fbf-xN7ao+9jAGBvY2Dnbbo9/GurTUc\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 85951,
    "path": "../public/_nuxt/Layout.95a54192.js"
  },
  "/_nuxt/LoadingEmptyErrorMessage.265d2132.js": {
    "type": "application/javascript",
    "etag": "\"1b47-VVbjvocehd0kd3cmCZM7rCHLqOs\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 6983,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.265d2132.js"
  },
  "/_nuxt/logout.0f04194d.js": {
    "type": "application/javascript",
    "etag": "\"9d-E8+JodVNkUVTY5yCHYjpF+JFGdw\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 157,
    "path": "../public/_nuxt/logout.0f04194d.js"
  },
  "/_nuxt/ModalView.e8f58535.js": {
    "type": "application/javascript",
    "etag": "\"13a1f-CHgElyhrFBw7YJrWq0EvgaGgvbs\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 80415,
    "path": "../public/_nuxt/ModalView.e8f58535.js"
  },
  "/_nuxt/Nunito-400-10.29a4d00e.woff2": {
    "type": "font/woff2",
    "etag": "\"2884-PEU9ZZZJolbbwttcAv50dVqiEDo\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 10372,
    "path": "../public/_nuxt/Nunito-400-10.29a4d00e.woff2"
  },
  "/_nuxt/Nunito-400-11.ce5142e3.woff2": {
    "type": "font/woff2",
    "etag": "\"1e64-B0w/V2/DPKprnDSKAKDC0Eqe2cI\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 7780,
    "path": "../public/_nuxt/Nunito-400-11.ce5142e3.woff2"
  },
  "/_nuxt/Nunito-400-12.7ed3b3e7.woff2": {
    "type": "font/woff2",
    "etag": "\"109c-BZjbfuYE2+HWTleJaRSJlUvzM6M\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 4252,
    "path": "../public/_nuxt/Nunito-400-12.7ed3b3e7.woff2"
  },
  "/_nuxt/Nunito-400-13.a8aed46d.woff2": {
    "type": "font/woff2",
    "etag": "\"31c0-TYJzHsR3fYOgI/JNsNJz4hedC6M\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 12736,
    "path": "../public/_nuxt/Nunito-400-13.a8aed46d.woff2"
  },
  "/_nuxt/Nunito-400-14.5e2f97ea.woff2": {
    "type": "font/woff2",
    "etag": "\"36ec-rQbz/9DbYDTrChL5iqiqTerUMPs\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 14060,
    "path": "../public/_nuxt/Nunito-400-14.5e2f97ea.woff2"
  },
  "/_nuxt/Poppins-400-15.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-15.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-16.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-16.cb8bdeab.woff2"
  },
  "/_nuxt/Poppins-400-17.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-17.7d93459d.woff2"
  },
  "/_nuxt/Profile.62adb010.js": {
    "type": "application/javascript",
    "etag": "\"1382b-L1cO0yXU+FNVf97ZyJAfjxtAnp0\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 79915,
    "path": "../public/_nuxt/Profile.62adb010.js"
  },
  "/_nuxt/Quicksand-400-19.bb022ef8.woff2": {
    "type": "font/woff2",
    "etag": "\"2d2c-YvmWdDnBYoQ6WV9yuF6QmbOkdNQ\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 11564,
    "path": "../public/_nuxt/Quicksand-400-19.bb022ef8.woff2"
  },
  "/_nuxt/Quicksand-400-20.e3616551.woff2": {
    "type": "font/woff2",
    "etag": "\"3640-dQX8r59P42Y0NSsyKp9f7RJWqfY\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 13888,
    "path": "../public/_nuxt/Quicksand-400-20.e3616551.woff2"
  },
  "/_nuxt/Readex_Pro-400-21.49998ebe.woff2": {
    "type": "font/woff2",
    "etag": "\"2274-V4kcBrQS6mFAu1PkJXx15VziTB4\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 8820,
    "path": "../public/_nuxt/Readex_Pro-400-21.49998ebe.woff2"
  },
  "/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2": {
    "type": "font/woff2",
    "etag": "\"2618-eL6Gf8ldGgexxxYdWXYTeLSw4Is\"",
    "mtime": "2022-10-21T12:17:07.911Z",
    "size": 9752,
    "path": "../public/_nuxt/Readex_Pro-400-23.9aa35e2a.woff2"
  },
  "/_nuxt/Readex_Pro-400-24.aad6f94c.woff2": {
    "type": "font/woff2",
    "etag": "\"2fb0-A7vkqkJN4/UAdDXSeWGNnL9mgnE\"",
    "mtime": "2022-10-21T12:17:07.912Z",
    "size": 12208,
    "path": "../public/_nuxt/Readex_Pro-400-24.aad6f94c.woff2"
  },
  "/_nuxt/RecoverPassword.17bdcbd1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13004-wbFmOOtFFYreEw7aajPswB+Pv2g\"",
    "mtime": "2022-10-21T12:17:07.923Z",
    "size": 77828,
    "path": "../public/_nuxt/RecoverPassword.17bdcbd1.css"
  },
  "/_nuxt/RecoverPassword.f50210b7.js": {
    "type": "application/javascript",
    "etag": "\"389-Wx2SeztS8qeq2mlj1HEpKTke/0E\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 905,
    "path": "../public/_nuxt/RecoverPassword.f50210b7.js"
  },
  "/_nuxt/ripple.edc1a59c.gif": {
    "type": "image/gif",
    "etag": "\"2b774-ZQJp8B5hQFcvQoBpvgD2hfBHjBY\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 178036,
    "path": "../public/_nuxt/ripple.edc1a59c.gif"
  },
  "/_nuxt/Rubik-400-25.3a8db66e.woff2": {
    "type": "font/woff2",
    "etag": "\"16c8-5PsWldoPi6EGR7ZoLMF2qQRIimQ\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 5832,
    "path": "../public/_nuxt/Rubik-400-25.3a8db66e.woff2"
  },
  "/_nuxt/Rubik-400-26.116c9b0a.woff2": {
    "type": "font/woff2",
    "etag": "\"1c80-tXPO5OhrAjOOaDsQk2pNjvfC9Yo\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 7296,
    "path": "../public/_nuxt/Rubik-400-26.116c9b0a.woff2"
  },
  "/_nuxt/Rubik-400-27.300c9f68.woff2": {
    "type": "font/woff2",
    "etag": "\"1128-AQbDvtsiw3OslDHAqMxgWqz5fag\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 4392,
    "path": "../public/_nuxt/Rubik-400-27.300c9f68.woff2"
  },
  "/_nuxt/Rubik-400-28.bc5e3f53.woff2": {
    "type": "font/woff2",
    "etag": "\"2208-5YagMMVa8TUbAMi5KshxlqG84ag\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 8712,
    "path": "../public/_nuxt/Rubik-400-28.bc5e3f53.woff2"
  },
  "/_nuxt/Rubik-400-29.f1e0d25f.woff2": {
    "type": "font/woff2",
    "etag": "\"42ec-7u/E7gYMBz5GZ/mHC+p2mh69tWM\"",
    "mtime": "2022-10-21T12:17:07.913Z",
    "size": 17132,
    "path": "../public/_nuxt/Rubik-400-29.f1e0d25f.woff2"
  },
  "/_nuxt/setting.c72ca59c.js": {
    "type": "application/javascript",
    "etag": "\"569a-6SCLsgGI6CWnrTw7xQlQBUpmbw4\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 22170,
    "path": "../public/_nuxt/setting.c72ca59c.js"
  },
  "/_nuxt/Spinner.bde24df9.js": {
    "type": "application/javascript",
    "etag": "\"31b-0bEbkLV80HwWxq3LGRVHX9NRQoY\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 795,
    "path": "../public/_nuxt/Spinner.bde24df9.js"
  },
  "/_nuxt/TagFilterSelection.a2abf303.js": {
    "type": "application/javascript",
    "etag": "\"5c5-ynztqiBtCA+Lnjuo6TMMKr/3eNg\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 1477,
    "path": "../public/_nuxt/TagFilterSelection.a2abf303.js"
  },
  "/_nuxt/useArtwork.3ef797ef.js": {
    "type": "application/javascript",
    "etag": "\"7c31-HoXisKGJNVOvsTsnMlYhUOgc1A8\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 31793,
    "path": "../public/_nuxt/useArtwork.3ef797ef.js"
  },
  "/_nuxt/useFeed.e06a7783.js": {
    "type": "application/javascript",
    "etag": "\"3cba-875wkjUVDXLMvI/OyzizvedVYmA\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 15546,
    "path": "../public/_nuxt/useFeed.e06a7783.js"
  },
  "/_nuxt/useI18n.4634fe72.js": {
    "type": "application/javascript",
    "etag": "\"62-yk3HpJfTAQNiexJAYnaDLqUf4Ac\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.4634fe72.js"
  },
  "/_nuxt/user-counters-api.f82a6d2e.js": {
    "type": "application/javascript",
    "etag": "\"1585-YWV3Rt2Cw/e4YCNkLvpxoMv+mOQ\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.f82a6d2e.js"
  },
  "/_nuxt/useUser.7fe57f48.js": {
    "type": "application/javascript",
    "etag": "\"404c-CSrAuQyzcxHEMCWAFFt5KHyTMds\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 16460,
    "path": "../public/_nuxt/useUser.7fe57f48.js"
  },
  "/_nuxt/_id.27ae546d.js": {
    "type": "application/javascript",
    "etag": "\"27a-KRaEbjWntP5dXhLBh8ug6s1bG1E\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 634,
    "path": "../public/_nuxt/_id.27ae546d.js"
  },
  "/_nuxt/_id_.4bd6b868.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"13202-fXH590AFx6/t/wDiU8MQfsgGpZI\"",
    "mtime": "2022-10-21T12:17:07.920Z",
    "size": 78338,
    "path": "../public/_nuxt/_id_.4bd6b868.css"
  },
  "/_nuxt/_id_.78c78423.js": {
    "type": "application/javascript",
    "etag": "\"1a8d-sZi/BdSCpPUhtvi8d7ZzDe93/ro\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 6797,
    "path": "../public/_nuxt/_id_.78c78423.js"
  },
  "/_nuxt/_id_.e0242bb1.js": {
    "type": "application/javascript",
    "etag": "\"40b-6jNnLVePMoz0WGiwQFcZkUXTnTc\"",
    "mtime": "2022-10-21T12:17:07.916Z",
    "size": 1035,
    "path": "../public/_nuxt/_id_.e0242bb1.js"
  },
  "/_nuxt/_id_.e975365c.js": {
    "type": "application/javascript",
    "etag": "\"436-PYw+609vaxS9VvB9qsoHJH4XY+0\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 1078,
    "path": "../public/_nuxt/_id_.e975365c.js"
  },
  "/_nuxt/_plugin-vue_export-helper.a1a6add7.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2022-10-21T12:17:07.914Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.a1a6add7.js"
  },
  "/_nuxt/_username_.5b501e5c.js": {
    "type": "application/javascript",
    "etag": "\"346-4mYRSuUPkY+5agvl6hVa2Lb8E4k\"",
    "mtime": "2022-10-21T12:17:07.917Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.5b501e5c.js"
  },
  "/_nuxt/_username_.d2e49d8e.js": {
    "type": "application/javascript",
    "etag": "\"346-4mYRSuUPkY+5agvl6hVa2Lb8E4k\"",
    "mtime": "2022-10-21T12:17:07.919Z",
    "size": 838,
    "path": "../public/_nuxt/_username_.d2e49d8e.js"
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
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(h.route.replace(/:\w+|\*\*/g, "_"));
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(toNodeListener(h3App));
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
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
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

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
