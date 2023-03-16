globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { eventHandler, setHeaders, sendRedirect, defineEventHandler, handleCacheHeaders, createEvent, getRequestHeader, getRequestHeaders, setResponseHeader, createError, lazyEventHandler, createApp, createRouter as createRouter$1, toNodeListener } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { withoutBase, parseURL, withQuery, joinURL, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import { createIPX, createIPXMiddleware } from 'ipx';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false}}},"turnstile":{"secretKey":"0x4AAAAAAACGxd-cmqDPlRhfKuH-QjptWSY"},"public":{"turnstile":{"siteKey":"0x4AAAAAAACGxbW2K6rB0xho"},"dev":false,"apiUrl":"https://api.upy.moe","appUrl":"https://upy.moe","cdnUrl":"i.upy.moe"},"ipx":{"dir":"","domains":["localhost:3000","upy.moe"],"sharp":{},"alias":{}}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
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
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
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
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
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
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
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
      const headers = event.node.res.getHeaders();
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
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
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

const script = "\"use strict\";const w=window,de=document.documentElement,knownColorSchemes=[\"dark\",\"light\"],preference=window.localStorage.getItem(\"nuxt-color-mode\")||\"system\";let value=preference===\"system\"?getColorScheme():preference;const forcedColorMode=de.getAttribute(\"data-color-mode-forced\");forcedColorMode&&(value=forcedColorMode),addColorScheme(value),w[\"__NUXT_COLOR_MODE__\"]={preference,value,getColorScheme,addColorScheme,removeColorScheme};function addColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.add(o):de.className+=\" \"+o,t&&de.setAttribute(\"data-\"+t,e)}function removeColorScheme(e){const o=\"\"+e+\"-mode\",t=\"\";de.classList?de.classList.remove(o):de.className=de.className.replace(new RegExp(o,\"g\"),\"\"),t&&de.removeAttribute(\"data-\"+t)}function prefersColorScheme(e){return w.matchMedia(\"(prefers-color-scheme\"+e+\")\")}function getColorScheme(){if(w.matchMedia&&prefersColorScheme(\"\").media!==\"not all\"){for(const e of knownColorSchemes)if(prefersColorScheme(\":\"+e).matches)return e}return\"light\"}\n";

const _J7XoJM2o2T = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _J7XoJM2o2T
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.node.req.url?.endsWith(".json") || event.node.req.url?.includes("/api/");
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
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
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
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('./error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-mknw8DtBBEO4+mZHu/yOPIoiLg4\"",
    "mtime": "2022-11-21T09:55:46.108Z",
    "size": 4286,
    "path": "../public/favicon.ico"
  },
  "/css/nuxt-google-fonts.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b51-JeNENqvWbzYWVLt3IOUFgCu5n3I\"",
    "mtime": "2023-03-16T08:57:35.971Z",
    "size": 2897,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/others/gh-sponsor.png": {
    "type": "image/png",
    "etag": "\"7c6f-/sX7LSq3WijMnS3VtKBMsa1HRf4\"",
    "mtime": "2023-01-24T04:18:41.028Z",
    "size": 31855,
    "path": "../public/others/gh-sponsor.png"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-03-16T08:57:35.830Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-03-16T08:57:35.798Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-03-16T08:57:35.787Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-03-16T08:57:35.830Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2023-03-16T08:57:35.834Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-03-16T08:57:35.936Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-03-16T08:57:35.904Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Poppins-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-03-16T08:57:35.927Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-10.woff2"
  },
  "/fonts/Poppins-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-03-16T08:57:35.970Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-8.woff2"
  },
  "/fonts/Poppins-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-03-16T08:57:35.914Z",
    "size": 5544,
    "path": "../public/fonts/Poppins-400-9.woff2"
  },
  "/pro/follow-privately.png": {
    "type": "image/png",
    "etag": "\"481a-f20BdgEVorIN176fub3ve3tdKY8\"",
    "mtime": "2022-12-05T10:26:06.568Z",
    "size": 18458,
    "path": "../public/pro/follow-privately.png"
  },
  "/pro/hide-followers.png": {
    "type": "image/png",
    "etag": "\"30a4-vAFTmCJJ4ASdWISNDT75ok/N/sU\"",
    "mtime": "2022-12-05T10:26:06.569Z",
    "size": 12452,
    "path": "../public/pro/hide-followers.png"
  },
  "/pro/hide-followings.png": {
    "type": "image/png",
    "etag": "\"6bad-e88HUGogC+8nxMGoArekuDU8gFM\"",
    "mtime": "2022-12-05T10:26:06.569Z",
    "size": 27565,
    "path": "../public/pro/hide-followings.png"
  },
  "/pro/list-all-my-liked-arts.png": {
    "type": "image/png",
    "etag": "\"371f-w3jz1Qh0PV4BDfsGn+Go9n417Ks\"",
    "mtime": "2022-12-05T10:26:06.570Z",
    "size": 14111,
    "path": "../public/pro/list-all-my-liked-arts.png"
  },
  "/pro/private-album.png": {
    "type": "image/png",
    "etag": "\"35a0-pQGvPJhk+uETx8Fs5L6xMFDqLZc\"",
    "mtime": "2022-12-05T10:26:06.570Z",
    "size": 13728,
    "path": "../public/pro/private-album.png"
  },
  "/pro/private-collection.png": {
    "type": "image/png",
    "etag": "\"3b77-iUMXcWlAUIFlTx9xA323IEtMrr0\"",
    "mtime": "2022-12-05T10:26:06.571Z",
    "size": 15223,
    "path": "../public/pro/private-collection.png"
  },
  "/pro/unlimited-album-items.png": {
    "type": "image/png",
    "etag": "\"401d-Q3mtefi2i8EzCLy0ynpV5B6iwaQ\"",
    "mtime": "2022-12-05T10:26:06.571Z",
    "size": 16413,
    "path": "../public/pro/unlimited-album-items.png"
  },
  "/pro/unlimited-albums.png": {
    "type": "image/png",
    "etag": "\"3ff0-tARyo2WZnFWUQnSO2Ah9ps98MH4\"",
    "mtime": "2022-12-05T10:26:06.572Z",
    "size": 16368,
    "path": "../public/pro/unlimited-albums.png"
  },
  "/pro/unlimited-collection-items.png": {
    "type": "image/png",
    "etag": "\"3e1b-hqHcy/MdkjgMGpzWyihk1ecB3IU\"",
    "mtime": "2022-12-05T10:26:06.572Z",
    "size": 15899,
    "path": "../public/pro/unlimited-collection-items.png"
  },
  "/pro/unlimited-collections.png": {
    "type": "image/png",
    "etag": "\"4aa0-VENOXnSrdlD6YcXGHaI+iSgADkY\"",
    "mtime": "2022-12-05T10:26:06.573Z",
    "size": 19104,
    "path": "../public/pro/unlimited-collections.png"
  },
  "/pro/upload-multiple-images.png": {
    "type": "image/png",
    "etag": "\"3d86-L+Ua+XT+vMdqkGuMeDydvn2qzOY\"",
    "mtime": "2022-12-05T10:26:06.573Z",
    "size": 15750,
    "path": "../public/pro/upload-multiple-images.png"
  },
  "/_nuxt/AccountVerification.729f810a.js": {
    "type": "application/javascript",
    "etag": "\"4ae-QcXQw9msXoX7NDFvk06T9EX5oRU\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 1198,
    "path": "../public/_nuxt/AccountVerification.729f810a.js"
  },
  "/_nuxt/ArtworkForm.1da4d4de.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c409-UeQKAh/eMvUW3mOAMdNa506ZTUg\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 115721,
    "path": "../public/_nuxt/ArtworkForm.1da4d4de.css"
  },
  "/_nuxt/ArtworkForm.c1493d00.js": {
    "type": "application/javascript",
    "etag": "\"3ad7b-SfAZxm4LOBy4AX7sXyxuVnGF00I\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 241019,
    "path": "../public/_nuxt/ArtworkForm.c1493d00.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.3ff908b9.js": {
    "type": "application/javascript",
    "etag": "\"8d1e8-r7wvYL3BxQ5gF8fGZrmg81NruFc\"",
    "mtime": "2023-03-16T08:58:37.382Z",
    "size": 578024,
    "path": "../public/_nuxt/entry.3ff908b9.js"
  },
  "/_nuxt/entry.aa8fa7a1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4da0a-mxI15Q8NCOsWUUWLJSU8UsN3Bho\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 317962,
    "path": "../public/_nuxt/entry.aa8fa7a1.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-03-16T08:58:37.363Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.f6200f39.js": {
    "type": "application/javascript",
    "etag": "\"8e2-DBlMibs+d5QFk+UZlUbwmr4pvoQ\"",
    "mtime": "2023-03-16T08:58:37.377Z",
    "size": 2274,
    "path": "../public/_nuxt/error-404.f6200f39.js"
  },
  "/_nuxt/error-500.4be78722.js": {
    "type": "application/javascript",
    "etag": "\"78b-p0vjd1brqwux9QlNADvVHwL49+c\"",
    "mtime": "2023-03-16T08:58:37.376Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.4be78722.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.ed5ffa33.js": {
    "type": "application/javascript",
    "etag": "\"4ba-TlYUMSXsrWEfiJsfq/w8jvAh0F4\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 1210,
    "path": "../public/_nuxt/error-component.ed5ffa33.js"
  },
  "/_nuxt/FeedModalView.ca2d1b0b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"30657-1WuK3zbqXFhMmRnUN55uNC2viTs\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 198231,
    "path": "../public/_nuxt/FeedModalView.ca2d1b0b.css"
  },
  "/_nuxt/FeedModalView.e96cc371.js": {
    "type": "application/javascript",
    "etag": "\"43b5-jjZTqQfIm/fM1c8lToOBR1PEJMM\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 17333,
    "path": "../public/_nuxt/FeedModalView.e96cc371.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2023-03-16T08:58:37.363Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/heap.1e9642da.js": {
    "type": "application/javascript",
    "etag": "\"281-RSxx1LgPgIaRmrvtzbImdEKqe4Q\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 641,
    "path": "../public/_nuxt/heap.1e9642da.js"
  },
  "/_nuxt/index.0746096c.js": {
    "type": "application/javascript",
    "etag": "\"2479-f5WMlT9hn+RMOJVGjkuBl9jd1tw\"",
    "mtime": "2023-03-16T08:58:37.376Z",
    "size": 9337,
    "path": "../public/_nuxt/index.0746096c.js"
  },
  "/_nuxt/index.17210f47.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"130eb-RgRSRQxqU+uXD0ezJJ44SpMaE8o\"",
    "mtime": "2023-03-16T08:58:37.363Z",
    "size": 78059,
    "path": "../public/_nuxt/index.17210f47.css"
  },
  "/_nuxt/index.17edd538.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"47f91-TKV+JLGPcXElVxRP4bpp4GYMiXc\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 294801,
    "path": "../public/_nuxt/index.17edd538.css"
  },
  "/_nuxt/index.1f11d7e6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17781-bdXQ7pPSXZdG3Jt1zOdvWpg1Hvo\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 96129,
    "path": "../public/_nuxt/index.1f11d7e6.css"
  },
  "/_nuxt/index.1ffd7217.js": {
    "type": "application/javascript",
    "etag": "\"e95-RGcyiyGm5RilnpnFASsK2y+THzA\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 3733,
    "path": "../public/_nuxt/index.1ffd7217.js"
  },
  "/_nuxt/index.212bb016.js": {
    "type": "application/javascript",
    "etag": "\"3802-kuZlLT3dWgmQtgVKseeS14yyvZk\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 14338,
    "path": "../public/_nuxt/index.212bb016.js"
  },
  "/_nuxt/index.2d470df6.js": {
    "type": "application/javascript",
    "etag": "\"239-yCOjjmy4NBvQFj9Nh0nMkNox9NY\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 569,
    "path": "../public/_nuxt/index.2d470df6.js"
  },
  "/_nuxt/index.39de4941.js": {
    "type": "application/javascript",
    "etag": "\"f7-10+eFi+vFyPsPmDMbII7ftJC7yg\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 247,
    "path": "../public/_nuxt/index.39de4941.js"
  },
  "/_nuxt/index.3f13738d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16ee7-0UJURlQvGZnsrrWq2kpHpxU7TkQ\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 93927,
    "path": "../public/_nuxt/index.3f13738d.css"
  },
  "/_nuxt/index.3f3d031a.js": {
    "type": "application/javascript",
    "etag": "\"19b0-JpX3xnrWLJCJ+1+/WqzDSA1IUN0\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 6576,
    "path": "../public/_nuxt/index.3f3d031a.js"
  },
  "/_nuxt/index.572c17ac.js": {
    "type": "application/javascript",
    "etag": "\"3a2-Z8vxUvzqbofKvEoMlLFUaIMx6XM\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 930,
    "path": "../public/_nuxt/index.572c17ac.js"
  },
  "/_nuxt/index.5c5aa9e8.js": {
    "type": "application/javascript",
    "etag": "\"1b76-54u9nZlbN2Ms34K6jVmyW0kc9Ko\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 7030,
    "path": "../public/_nuxt/index.5c5aa9e8.js"
  },
  "/_nuxt/index.64dc77b7.js": {
    "type": "application/javascript",
    "etag": "\"14de-wENl3QNPjli5HDJdcvO0YWI9fjY\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 5342,
    "path": "../public/_nuxt/index.64dc77b7.js"
  },
  "/_nuxt/index.6e78b69f.js": {
    "type": "application/javascript",
    "etag": "\"e2f-9N64Im4hHVu2NzYEkCbxuWbe7YM\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 3631,
    "path": "../public/_nuxt/index.6e78b69f.js"
  },
  "/_nuxt/index.7225a9bd.js": {
    "type": "application/javascript",
    "etag": "\"54-nFLUhBo874WeCxSYVfp8HKK3/Q8\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 84,
    "path": "../public/_nuxt/index.7225a9bd.js"
  },
  "/_nuxt/index.75ca150d.js": {
    "type": "application/javascript",
    "etag": "\"1096-pn+oYSbQxrdtIJTS1zLfIO+BNMs\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 4246,
    "path": "../public/_nuxt/index.75ca150d.js"
  },
  "/_nuxt/index.792f7e36.js": {
    "type": "application/javascript",
    "etag": "\"1b0-7rT3C6/zor0i+MYNV1nZPLO05bY\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 432,
    "path": "../public/_nuxt/index.792f7e36.js"
  },
  "/_nuxt/index.851e121d.js": {
    "type": "application/javascript",
    "etag": "\"96-5kW1+tOH4Le8/LnPzF17yFKe2bc\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 150,
    "path": "../public/_nuxt/index.851e121d.js"
  },
  "/_nuxt/index.90a2db04.js": {
    "type": "application/javascript",
    "etag": "\"4bdf-5YJQrtCFLqNiJu35rnR0fPrRxjw\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 19423,
    "path": "../public/_nuxt/index.90a2db04.js"
  },
  "/_nuxt/index.91bd4b0b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17b6a-2ppMeFLnG7TF/zHb2NUo8NjvSvM\"",
    "mtime": "2023-03-16T08:58:37.367Z",
    "size": 97130,
    "path": "../public/_nuxt/index.91bd4b0b.css"
  },
  "/_nuxt/index.b2cc9ffd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f01-A4qu9KGF2YDqFVeh29XfSdIMVAQ\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 98049,
    "path": "../public/_nuxt/index.b2cc9ffd.css"
  },
  "/_nuxt/index.b325687a.js": {
    "type": "application/javascript",
    "etag": "\"2ae-L9XmIaMNNm6+oEOckyfwwvyuz5Y\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 686,
    "path": "../public/_nuxt/index.b325687a.js"
  },
  "/_nuxt/index.bb1e24d3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f39-nP/liDt0G+D+mcpUEAshLBge5DQ\"",
    "mtime": "2023-03-16T08:58:37.363Z",
    "size": 98105,
    "path": "../public/_nuxt/index.bb1e24d3.css"
  },
  "/_nuxt/index.c49aa0b1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f01-Zl7PImqnl4MLNoPkcgG4A3FbGnM\"",
    "mtime": "2023-03-16T08:58:37.366Z",
    "size": 98049,
    "path": "../public/_nuxt/index.c49aa0b1.css"
  },
  "/_nuxt/index.cc0b9c92.js": {
    "type": "application/javascript",
    "etag": "\"4c5-yM9Yl6Kg4hQwnXEwuhpsei8DC0U\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 1221,
    "path": "../public/_nuxt/index.cc0b9c92.js"
  },
  "/_nuxt/index.d165f778.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17191-i0hcme5yqRNxQYIhXYOXUM8DyvE\"",
    "mtime": "2023-03-16T08:58:37.367Z",
    "size": 94609,
    "path": "../public/_nuxt/index.d165f778.css"
  },
  "/_nuxt/index.d3539c72.js": {
    "type": "application/javascript",
    "etag": "\"2a1-0kh6u3d9/vCePS29inbaDv7ybEU\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 673,
    "path": "../public/_nuxt/index.d3539c72.js"
  },
  "/_nuxt/index.d452a2df.js": {
    "type": "application/javascript",
    "etag": "\"1bfb-albYqtSHKstVje1BtXzWFE8Z0W8\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 7163,
    "path": "../public/_nuxt/index.d452a2df.js"
  },
  "/_nuxt/index.d7f360ae.js": {
    "type": "application/javascript",
    "etag": "\"2c0c-74PqrdTFlBlLnskWRSEkqFyQAts\"",
    "mtime": "2023-03-16T08:58:37.379Z",
    "size": 11276,
    "path": "../public/_nuxt/index.d7f360ae.js"
  },
  "/_nuxt/index.e2eafbe3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f01-7NmDhKohZJXb3YkVUcXXZBvJUBE\"",
    "mtime": "2023-03-16T08:58:37.363Z",
    "size": 98049,
    "path": "../public/_nuxt/index.e2eafbe3.css"
  },
  "/_nuxt/index.e675c148.js": {
    "type": "application/javascript",
    "etag": "\"8ae-VV3b5zBKh1czqSiJRibWnmgmMMo\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 2222,
    "path": "../public/_nuxt/index.e675c148.js"
  },
  "/_nuxt/index.e69ca7e6.js": {
    "type": "application/javascript",
    "etag": "\"1093-mxxlKeaWQn3d5VaI644+vXTXJYM\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 4243,
    "path": "../public/_nuxt/index.e69ca7e6.js"
  },
  "/_nuxt/index.e748659a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b-P4Yk7jX01c9QdC2gMZuU+qSDKLA\"",
    "mtime": "2023-03-16T08:58:37.367Z",
    "size": 75,
    "path": "../public/_nuxt/index.e748659a.css"
  },
  "/_nuxt/index.e92d20f6.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2ddbf-uqv38RpHeLDWdix346CoLJHcmfc\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 187839,
    "path": "../public/_nuxt/index.e92d20f6.css"
  },
  "/_nuxt/index.e9e2f7ea.js": {
    "type": "application/javascript",
    "etag": "\"18c-obR6VX7L/6wEZLpRX0qWpGZZBf8\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 396,
    "path": "../public/_nuxt/index.e9e2f7ea.js"
  },
  "/_nuxt/index.efba249c.js": {
    "type": "application/javascript",
    "etag": "\"2b82-ywfAoGfS/cto8FbFCvoqIhMC9a4\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 11138,
    "path": "../public/_nuxt/index.efba249c.js"
  },
  "/_nuxt/index.f0300c76.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f01-37mZIdR0EXNhKn4gEZ6WTPGzBxY\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 98049,
    "path": "../public/_nuxt/index.f0300c76.css"
  },
  "/_nuxt/index.f2f67924.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"46b5c-Nl02ag7CTuc4V/6Z7RrP7+CjZTc\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 289628,
    "path": "../public/_nuxt/index.f2f67924.css"
  },
  "/_nuxt/index.f8389e4e.js": {
    "type": "application/javascript",
    "etag": "\"177-YkiIElVwYGUELvSYwBx5e/ZYy/g\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 375,
    "path": "../public/_nuxt/index.f8389e4e.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-03-16T08:58:37.359Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Layout.063ecd63.js": {
    "type": "application/javascript",
    "etag": "\"16267-AXZ3jIkqwNjOPG/BSpgbKEOaKcM\"",
    "mtime": "2023-03-16T08:58:37.382Z",
    "size": 90727,
    "path": "../public/_nuxt/Layout.063ecd63.js"
  },
  "/_nuxt/Layout.125854ba.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d8eb0-/XnyKnahXxT9IvSrHEU0vnfWVJY\"",
    "mtime": "2023-03-16T08:58:37.369Z",
    "size": 888496,
    "path": "../public/_nuxt/Layout.125854ba.css"
  },
  "/_nuxt/LoadingEmptyErrorMessage.55442a3a.js": {
    "type": "application/javascript",
    "etag": "\"58d-2vLEnZjJrhilydB/fsi8uMZXvDI\"",
    "mtime": "2023-03-16T08:58:37.373Z",
    "size": 1421,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.55442a3a.js"
  },
  "/_nuxt/logo-white.c01eec53.png": {
    "type": "image/png",
    "etag": "\"a540-Kuz6rJZL9LjU+eOP0CHtnafYZgs\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 42304,
    "path": "../public/_nuxt/logo-white.c01eec53.png"
  },
  "/_nuxt/logo.a6397618.png": {
    "type": "image/png",
    "etag": "\"daed-WbMP2dDMmH3EOvlmIyaMOmY+dWg\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 56045,
    "path": "../public/_nuxt/logo.a6397618.png"
  },
  "/_nuxt/logout.c5d615e6.js": {
    "type": "application/javascript",
    "etag": "\"af-8K5pRHIKNemr4iDmUD3A5e6FWec\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 175,
    "path": "../public/_nuxt/logout.c5d615e6.js"
  },
  "/_nuxt/MiniArtworkPreview.22f51b4b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1806f-G9YEvBrUft05CX8g0sKe1No+GYA\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 98415,
    "path": "../public/_nuxt/MiniArtworkPreview.22f51b4b.css"
  },
  "/_nuxt/MiniArtworkPreview.f9593abe.js": {
    "type": "application/javascript",
    "etag": "\"1074-fX71k8eas+sgEECgIF65AMvjMWc\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 4212,
    "path": "../public/_nuxt/MiniArtworkPreview.f9593abe.js"
  },
  "/_nuxt/ModalView.086d5495.js": {
    "type": "application/javascript",
    "etag": "\"14936-B+p6j6x3XJ5VG4rtpY8PL1NTL/M\"",
    "mtime": "2023-03-16T08:58:37.382Z",
    "size": 84278,
    "path": "../public/_nuxt/ModalView.086d5495.js"
  },
  "/_nuxt/ModalView.fa1cc1a5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d266b-M18BBHeSGEGIQg7mQCOXHuJ3mxA\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 861803,
    "path": "../public/_nuxt/ModalView.fa1cc1a5.css"
  },
  "/_nuxt/Poppins-400-10.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-10.7d93459d.woff2"
  },
  "/_nuxt/Poppins-400-8.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-8.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-9.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-9.cb8bdeab.woff2"
  },
  "/_nuxt/ProBadge.5979b0c9.js": {
    "type": "application/javascript",
    "etag": "\"d908-wVmpgdh7fFBlBKoxyYpmeMHBt6g\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 55560,
    "path": "../public/_nuxt/ProBadge.5979b0c9.js"
  },
  "/_nuxt/ProBadge.be51f48d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17392-RuxcpuQfKP9o8bokG5nxS/4sTZs\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 95122,
    "path": "../public/_nuxt/ProBadge.be51f48d.css"
  },
  "/_nuxt/Profile.19b33934.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ecca0-1yst9RejHAVfW6xZlE8HZQiIET8\"",
    "mtime": "2023-03-16T08:58:37.371Z",
    "size": 969888,
    "path": "../public/_nuxt/Profile.19b33934.css"
  },
  "/_nuxt/Profile.becbf387.js": {
    "type": "application/javascript",
    "etag": "\"1432c-7SzfTLzl5cijWvQ6AmYhxq6+HBE\"",
    "mtime": "2023-03-16T08:58:37.382Z",
    "size": 82732,
    "path": "../public/_nuxt/Profile.becbf387.js"
  },
  "/_nuxt/RecoverPassword.79bc9e11.js": {
    "type": "application/javascript",
    "etag": "\"995-mXDnp+jHTD96Jh6Aey3N7tXh0KI\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 2453,
    "path": "../public/_nuxt/RecoverPassword.79bc9e11.js"
  },
  "/_nuxt/redraws.590400dd.js": {
    "type": "application/javascript",
    "etag": "\"b59-EbhH6+B+Z1GiijOA4mfiGPDWUcM\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 2905,
    "path": "../public/_nuxt/redraws.590400dd.js"
  },
  "/_nuxt/redraws.aaa89183.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17f01-6q7D47mLDDR+m9klMbf60ropeeI\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 98049,
    "path": "../public/_nuxt/redraws.aaa89183.css"
  },
  "/_nuxt/setting.208fce74.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5c2e7-/wCQ6ATQikhQQ6Se/YLdV84mOkk\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 377575,
    "path": "../public/_nuxt/setting.208fce74.css"
  },
  "/_nuxt/setting.37f8a011.js": {
    "type": "application/javascript",
    "etag": "\"82e7-z7r0X/VGqmBPb7zA5xxz7Fi3CwQ\"",
    "mtime": "2023-03-16T08:58:37.379Z",
    "size": 33511,
    "path": "../public/_nuxt/setting.37f8a011.js"
  },
  "/_nuxt/TagFilterSelection.e9370611.js": {
    "type": "application/javascript",
    "etag": "\"611-QQcBTyd38hLwmyVsLY+sm5cgx+8\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 1553,
    "path": "../public/_nuxt/TagFilterSelection.e9370611.js"
  },
  "/_nuxt/useArtTrade.39ae0e25.js": {
    "type": "application/javascript",
    "etag": "\"1846-YEG7kpN6J2hOJDKW5MNrWxagF/o\"",
    "mtime": "2023-03-16T08:58:37.373Z",
    "size": 6214,
    "path": "../public/_nuxt/useArtTrade.39ae0e25.js"
  },
  "/_nuxt/useFeed.a442ade6.js": {
    "type": "application/javascript",
    "etag": "\"3f02-Hd9pWuwBFvukFpUoLfYskqHIOCQ\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 16130,
    "path": "../public/_nuxt/useFeed.a442ade6.js"
  },
  "/_nuxt/useI18n.d0aa78f2.js": {
    "type": "application/javascript",
    "etag": "\"62-ioKtW1zvVgyCuxBY5L//9I1ZyEc\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.d0aa78f2.js"
  },
  "/_nuxt/user-counters-api.7fea0895.js": {
    "type": "application/javascript",
    "etag": "\"1585-bnKj3Vu8nlm9VKf4zyuhIWrXGNw\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.7fea0895.js"
  },
  "/_nuxt/useReport.1562cb9a.js": {
    "type": "application/javascript",
    "etag": "\"1768-Sj3i1WOnhc7+YvxxqXndtgc0AtY\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 5992,
    "path": "../public/_nuxt/useReport.1562cb9a.js"
  },
  "/_nuxt/UserList.1e4b7cb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17141-Q7o2aoyT/+CSR92r7AsLw5m3Ky8\"",
    "mtime": "2023-03-16T08:58:37.368Z",
    "size": 94529,
    "path": "../public/_nuxt/UserList.1e4b7cb8.css"
  },
  "/_nuxt/UserList.57d1291e.js": {
    "type": "application/javascript",
    "etag": "\"109d-IqSgYcDJUC9dcAph9cc1N0sgpXU\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 4253,
    "path": "../public/_nuxt/UserList.57d1291e.js"
  },
  "/_nuxt/useSetting.fdccbf5d.js": {
    "type": "application/javascript",
    "etag": "\"477-7k1l/R7v8f5tnCdKSnw8cVqP2AU\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 1143,
    "path": "../public/_nuxt/useSetting.fdccbf5d.js"
  },
  "/_nuxt/useUser.c5ec5e37.js": {
    "type": "application/javascript",
    "etag": "\"593e-vNMAZRj7JdSUvBCH3UV1FhPxei4\"",
    "mtime": "2023-03-16T08:58:37.373Z",
    "size": 22846,
    "path": "../public/_nuxt/useUser.c5ec5e37.js"
  },
  "/_nuxt/vue3-editor.common.d9127422.js": {
    "type": "application/javascript",
    "etag": "\"49159-4Qx3p+wjGzETNtdj8eWRrItIpPE\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 299353,
    "path": "../public/_nuxt/vue3-editor.common.d9127422.js"
  },
  "/_nuxt/WorkList.027c8c85.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"190c1-gFxYGPmRCOpH3eytUH4VJNU0VRs\"",
    "mtime": "2023-03-16T08:58:37.367Z",
    "size": 102593,
    "path": "../public/_nuxt/WorkList.027c8c85.css"
  },
  "/_nuxt/WorkList.6007ea80.js": {
    "type": "application/javascript",
    "etag": "\"1bbf-1ovlK2C3jUZl1S0AuteSaE73bnI\"",
    "mtime": "2023-03-16T08:58:37.378Z",
    "size": 7103,
    "path": "../public/_nuxt/WorkList.6007ea80.js"
  },
  "/_nuxt/_id.2e2f0daa.js": {
    "type": "application/javascript",
    "etag": "\"31e-rQkoiI02ceOJyJ2HSokqNJg2agM\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 798,
    "path": "../public/_nuxt/_id.2e2f0daa.js"
  },
  "/_nuxt/_id_.150e93d9.js": {
    "type": "application/javascript",
    "etag": "\"383-22MUqtKHJ0UU87UH/5mKPrwBCds\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 899,
    "path": "../public/_nuxt/_id_.150e93d9.js"
  },
  "/_nuxt/_id_.2abbe8b5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4bf-Acogm2AlsODRv3zCozy6+1fTgGE\"",
    "mtime": "2023-03-16T08:58:37.362Z",
    "size": 1215,
    "path": "../public/_nuxt/_id_.2abbe8b5.css"
  },
  "/_nuxt/_id_.aa345671.js": {
    "type": "application/javascript",
    "etag": "\"5c5-BGYXSzN2sDi6zqun5fs76dgrgKE\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 1477,
    "path": "../public/_nuxt/_id_.aa345671.js"
  },
  "/_nuxt/_id_.e1d1d040.js": {
    "type": "application/javascript",
    "etag": "\"2616-f3cd+iuUYx66hm5IUDWdiyaPh2Y\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 9750,
    "path": "../public/_nuxt/_id_.e1d1d040.js"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-03-16T08:58:37.375Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/_nuxt/_username_.7660db85.js": {
    "type": "application/javascript",
    "etag": "\"3ea-d4/musQ39j4Gvo6mrS6BLpuLCFQ\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 1002,
    "path": "../public/_nuxt/_username_.7660db85.js"
  },
  "/_nuxt/_username_.d82b90fd.js": {
    "type": "application/javascript",
    "etag": "\"418-JiLAhYf5VUButK9aN72BqCRaS8A\"",
    "mtime": "2023-03-16T08:58:37.372Z",
    "size": 1048,
    "path": "../public/_nuxt/_username_.d82b90fd.js"
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

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
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
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _I3fgWL = lazyEventHandler(() => {
  const ipxOptions = {
    ...useRuntimeConfig().ipx || {},
    dir: fileURLToPath(new URL("../public", globalThis._importMeta_.url))
  };
  const ipx = createIPX(ipxOptions);
  const middleware = createIPXMiddleware(ipx);
  return eventHandler(async (event) => {
    event.req.url = withLeadingSlash(event.context.params._);
    await middleware(event.req, event.res);
  });
});

const _lazy_z9V8rj = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_z9V8rj, lazy: true, middleware: false, method: undefined },
  { route: '/_ipx/**', handler: _I3fgWL, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_z9V8rj, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
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
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
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
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
