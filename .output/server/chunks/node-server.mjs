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
    "mtime": "2023-01-31T10:19:34.376Z",
    "size": 2897,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-01-31T10:19:34.182Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-01-31T10:19:34.375Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-01-31T10:19:34.170Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-01-31T10:19:34.175Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2023-01-31T10:19:34.175Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-01-31T10:19:34.219Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-01-31T10:19:34.193Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Poppins-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-01-31T10:19:34.375Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-10.woff2"
  },
  "/fonts/Poppins-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-01-31T10:19:34.287Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-8.woff2"
  },
  "/fonts/Poppins-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-01-31T10:19:34.193Z",
    "size": 5544,
    "path": "../public/fonts/Poppins-400-9.woff2"
  },
  "/others/gh-sponsor.png": {
    "type": "image/png",
    "etag": "\"7c6f-/sX7LSq3WijMnS3VtKBMsa1HRf4\"",
    "mtime": "2023-01-24T04:18:41.028Z",
    "size": 31855,
    "path": "../public/others/gh-sponsor.png"
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
  "/_nuxt/AccountVerification.4f48935e.js": {
    "type": "application/javascript",
    "etag": "\"4ae-tkf2WkDSW+ZSrWBZp+2YirvvIRM\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 1198,
    "path": "../public/_nuxt/AccountVerification.4f48935e.js"
  },
  "/_nuxt/ArtworkForm.0f3972dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c107-h6nT66Kdh72yV11URmzGWqDJYHI\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 114951,
    "path": "../public/_nuxt/ArtworkForm.0f3972dd.css"
  },
  "/_nuxt/ArtworkForm.aff3af1b.js": {
    "type": "application/javascript",
    "etag": "\"3aa95-7OD7T18EmQNYrRsZNuLZQig2AuM\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 240277,
    "path": "../public/_nuxt/ArtworkForm.aff3af1b.js"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.0165396c.js": {
    "type": "application/javascript",
    "etag": "\"780dd-qFxjLwZHs0jmD9v4ryUAp3B+kDA\"",
    "mtime": "2023-01-31T10:20:31.562Z",
    "size": 491741,
    "path": "../public/_nuxt/entry.0165396c.js"
  },
  "/_nuxt/entry.cbeb2f3a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4c668-TVHeVTU7HhHjL8bbnQHvY8SVTPE\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 312936,
    "path": "../public/_nuxt/entry.cbeb2f3a.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.c61239ac.js": {
    "type": "application/javascript",
    "etag": "\"8e2-RSYLRHlCbgo5nlJdja2ESkU8678\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 2274,
    "path": "../public/_nuxt/error-404.c61239ac.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-500.edfba4dd.js": {
    "type": "application/javascript",
    "etag": "\"78b-mh8NNImmFC00WOLSUIHeC38VIxs\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.edfba4dd.js"
  },
  "/_nuxt/error-component.31fab0e2.js": {
    "type": "application/javascript",
    "etag": "\"4ba-gUmDeN+XzpCUeilwrWQJrKouac8\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 1210,
    "path": "../public/_nuxt/error-component.31fab0e2.js"
  },
  "/_nuxt/FeedModalView.1a2ffe19.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3001d-uO6pBhy0IJqO3d3/tltnc9WdJtY\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 196637,
    "path": "../public/_nuxt/FeedModalView.1a2ffe19.css"
  },
  "/_nuxt/FeedModalView.62359bf4.js": {
    "type": "application/javascript",
    "etag": "\"43bf-T+wvDw7AvMoSlyqY/K0KJH/SYok\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 17343,
    "path": "../public/_nuxt/FeedModalView.62359bf4.js"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/heap.1e9642da.js": {
    "type": "application/javascript",
    "etag": "\"281-RSxx1LgPgIaRmrvtzbImdEKqe4Q\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 641,
    "path": "../public/_nuxt/heap.1e9642da.js"
  },
  "/_nuxt/index.022f29df.js": {
    "type": "application/javascript",
    "etag": "\"177-LQ0ggvXUNtFnCkdmrxg/ocNplTg\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 375,
    "path": "../public/_nuxt/index.022f29df.js"
  },
  "/_nuxt/index.0d196d6d.js": {
    "type": "application/javascript",
    "etag": "\"2b7e-CcEAOz7TTxnJgTsiG51TpefzzwY\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 11134,
    "path": "../public/_nuxt/index.0d196d6d.js"
  },
  "/_nuxt/index.17521080.js": {
    "type": "application/javascript",
    "etag": "\"2c6d-5EUl/tt65+iyO4xb5+7MzDYun2s\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 11373,
    "path": "../public/_nuxt/index.17521080.js"
  },
  "/_nuxt/index.24f7155d.js": {
    "type": "application/javascript",
    "etag": "\"2479-lC1LqwxPhrDQe8ITuYnqWsAir1g\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 9337,
    "path": "../public/_nuxt/index.24f7155d.js"
  },
  "/_nuxt/index.2eeed4ec.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17bff-8NyU+G+QA0Cfg73VVgK1iwzdVVM\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 97279,
    "path": "../public/_nuxt/index.2eeed4ec.css"
  },
  "/_nuxt/index.2f58f167.js": {
    "type": "application/javascript",
    "etag": "\"1b0-DB2enXft91pkaDsAUATDyTXXaSo\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 432,
    "path": "../public/_nuxt/index.2f58f167.js"
  },
  "/_nuxt/index.3523f658.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4768b-R0n+3BrFIkNacQ2kRMVncqmhZ4Y\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 292491,
    "path": "../public/_nuxt/index.3523f658.css"
  },
  "/_nuxt/index.38e4f407.js": {
    "type": "application/javascript",
    "etag": "\"18c-ZARNaKh47bQDVfv6prIOO6vIusA\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 396,
    "path": "../public/_nuxt/index.38e4f407.js"
  },
  "/_nuxt/index.3ab4765b.js": {
    "type": "application/javascript",
    "etag": "\"1018-osxgIPO+d6D2ZSVJFKvFAnh2DYw\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 4120,
    "path": "../public/_nuxt/index.3ab4765b.js"
  },
  "/_nuxt/index.40345a70.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17c37-jL4qlOuDgrA1X5/VyQuT3icLWmE\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 97335,
    "path": "../public/_nuxt/index.40345a70.css"
  },
  "/_nuxt/index.40620cef.js": {
    "type": "application/javascript",
    "etag": "\"19b6-KdtxFnRwISM28BrL7clrZRBm8Do\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 6582,
    "path": "../public/_nuxt/index.40620cef.js"
  },
  "/_nuxt/index.550f3a71.js": {
    "type": "application/javascript",
    "etag": "\"3a3-0/L1hRfpLgmbkWLJKqUDwLECMDQ\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 931,
    "path": "../public/_nuxt/index.550f3a71.js"
  },
  "/_nuxt/index.586a9afc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16e8f-HfB/0HQNtC02wEeKrrYBDi8rwoE\"",
    "mtime": "2023-01-31T10:20:31.547Z",
    "size": 93839,
    "path": "../public/_nuxt/index.586a9afc.css"
  },
  "/_nuxt/index.5d0a0392.js": {
    "type": "application/javascript",
    "etag": "\"f7-Yzk9YXG+hzhWvh2cn24FZLK++9o\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 247,
    "path": "../public/_nuxt/index.5d0a0392.js"
  },
  "/_nuxt/index.5f828e14.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17bff-KQ6r0U6p/M1FlyywQuy7GCmGT1o\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 97279,
    "path": "../public/_nuxt/index.5f828e14.css"
  },
  "/_nuxt/index.5fb42d24.js": {
    "type": "application/javascript",
    "etag": "\"1094-cu3QRbYOvUz7CpJDeVKDHBz7EBI\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 4244,
    "path": "../public/_nuxt/index.5fb42d24.js"
  },
  "/_nuxt/index.6ab20464.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12e60-hTwfALC+eXUx/QuprRp85TYdorE\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 77408,
    "path": "../public/_nuxt/index.6ab20464.css"
  },
  "/_nuxt/index.7faa4402.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17868-F9lZvtIcOquiHBUqPOKQxBzbU0A\"",
    "mtime": "2023-01-31T10:20:31.547Z",
    "size": 96360,
    "path": "../public/_nuxt/index.7faa4402.css"
  },
  "/_nuxt/index.894bc4a4.js": {
    "type": "application/javascript",
    "etag": "\"1aa9-vD8XTHJLsf4LuLeonnHyMXOm3D0\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 6825,
    "path": "../public/_nuxt/index.894bc4a4.js"
  },
  "/_nuxt/index.8ad89c1f.js": {
    "type": "application/javascript",
    "etag": "\"1b77-OtPpMjElo9nZPow0SSTJrHs2g38\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 7031,
    "path": "../public/_nuxt/index.8ad89c1f.js"
  },
  "/_nuxt/index.8ffb9a9c.js": {
    "type": "application/javascript",
    "etag": "\"4c5-tYDP3mm0bdiEGNkH7ujLJTFYM24\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 1221,
    "path": "../public/_nuxt/index.8ffb9a9c.js"
  },
  "/_nuxt/index.965a4f9c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"42d-HZ/Hw5CEWobHOdmpufNbsdiZLWo\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 1069,
    "path": "../public/_nuxt/index.965a4f9c.css"
  },
  "/_nuxt/index.a59481e8.js": {
    "type": "application/javascript",
    "etag": "\"e96-VbGupf2FZQTOoBuIp3qhpkOTgA8\"",
    "mtime": "2023-01-31T10:20:31.558Z",
    "size": 3734,
    "path": "../public/_nuxt/index.a59481e8.js"
  },
  "/_nuxt/index.af539870.js": {
    "type": "application/javascript",
    "etag": "\"38-8TTJTKg/ZWMIh5CnglFiA8bmWM8\"",
    "mtime": "2023-01-31T10:20:31.555Z",
    "size": 56,
    "path": "../public/_nuxt/index.af539870.js"
  },
  "/_nuxt/index.b149a38b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d7bb-O44W7cSYtBZfS9XsR061CY+YZYU\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 186299,
    "path": "../public/_nuxt/index.b149a38b.css"
  },
  "/_nuxt/index.b4b10469.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17bff-9Swfl297fn7YORvghwY89e3JVeQ\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 97279,
    "path": "../public/_nuxt/index.b4b10469.css"
  },
  "/_nuxt/index.b904b862.js": {
    "type": "application/javascript",
    "etag": "\"8dc-LqGPCAWRG+3P1QdqE+iCJshCk5E\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 2268,
    "path": "../public/_nuxt/index.b904b862.js"
  },
  "/_nuxt/index.b9587e69.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17bff-t1pRs3S/hnQ2KVNHiDv783jUeFI\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 97279,
    "path": "../public/_nuxt/index.b9587e69.css"
  },
  "/_nuxt/index.bd9f5f2a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"46256-lps16zPv8gTUcEqg2PBXpZWcqZA\"",
    "mtime": "2023-01-31T10:20:31.549Z",
    "size": 287318,
    "path": "../public/_nuxt/index.bd9f5f2a.css"
  },
  "/_nuxt/index.c8a6a7e0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16be5-TQUY6EFqs9bul7hPrWFX5Lx1DOU\"",
    "mtime": "2023-01-31T10:20:31.547Z",
    "size": 93157,
    "path": "../public/_nuxt/index.c8a6a7e0.css"
  },
  "/_nuxt/index.cf00d7fb.js": {
    "type": "application/javascript",
    "etag": "\"23a-YMcs2EIkFlsrz2yWWFfy61LlJ4c\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 570,
    "path": "../public/_nuxt/index.cf00d7fb.js"
  },
  "/_nuxt/index.d0d41d50.js": {
    "type": "application/javascript",
    "etag": "\"3811-Ix0EUZxnK3JQb2gbe8dLupejZDE\"",
    "mtime": "2023-01-31T10:20:31.560Z",
    "size": 14353,
    "path": "../public/_nuxt/index.d0d41d50.js"
  },
  "/_nuxt/index.d352b462.js": {
    "type": "application/javascript",
    "etag": "\"e35-StABJoVU2uwhc4QQC7X4tt2AyqI\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 3637,
    "path": "../public/_nuxt/index.d352b462.js"
  },
  "/_nuxt/index.e7379b3c.js": {
    "type": "application/javascript",
    "etag": "\"14e3-17ZJRK/2njoEX2KAvhlQGsvyAkM\"",
    "mtime": "2023-01-31T10:20:31.555Z",
    "size": 5347,
    "path": "../public/_nuxt/index.e7379b3c.js"
  },
  "/_nuxt/index.ef3539ba.js": {
    "type": "application/javascript",
    "etag": "\"9b-VTNblbIaRhnE2Qy+yaY3lTKbcOQ\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 155,
    "path": "../public/_nuxt/index.ef3539ba.js"
  },
  "/_nuxt/index.f7ac6da6.js": {
    "type": "application/javascript",
    "etag": "\"2ae-xvhLQEN6LVaAz0bdoqDChOGE5yw\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 686,
    "path": "../public/_nuxt/index.f7ac6da6.js"
  },
  "/_nuxt/index.fec30cfd.js": {
    "type": "application/javascript",
    "etag": "\"1098-+UC6TLzxc22MSTotGQi3yCegais\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 4248,
    "path": "../public/_nuxt/index.fec30cfd.js"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-01-31T10:20:31.539Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Layout.3a2dbbcb.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d7415-eP/o/OrEWRE5V1/yahl78n6pvBo\"",
    "mtime": "2023-01-31T10:20:31.550Z",
    "size": 881685,
    "path": "../public/_nuxt/Layout.3a2dbbcb.css"
  },
  "/_nuxt/Layout.ebc56a4d.js": {
    "type": "application/javascript",
    "etag": "\"15d84-8IE5EUZ5/7Wq1iawqj+fi7pOfTY\"",
    "mtime": "2023-01-31T10:20:31.562Z",
    "size": 89476,
    "path": "../public/_nuxt/Layout.ebc56a4d.js"
  },
  "/_nuxt/LoadingEmptyErrorMessage.f4defa80.js": {
    "type": "application/javascript",
    "etag": "\"58d-zs3Lv0Hx37HUcscUR80VjHWzdNg\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 1421,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.f4defa80.js"
  },
  "/_nuxt/LoginMessage.e1970916.js": {
    "type": "application/javascript",
    "etag": "\"134-vexQcxa+aWE+Cr0vgMU36zwUNvo\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 308,
    "path": "../public/_nuxt/LoginMessage.e1970916.js"
  },
  "/_nuxt/logo-white.c01eec53.png": {
    "type": "image/png",
    "etag": "\"a540-Kuz6rJZL9LjU+eOP0CHtnafYZgs\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 42304,
    "path": "../public/_nuxt/logo-white.c01eec53.png"
  },
  "/_nuxt/logo.a6397618.png": {
    "type": "image/png",
    "etag": "\"daed-WbMP2dDMmH3EOvlmIyaMOmY+dWg\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 56045,
    "path": "../public/_nuxt/logo.a6397618.png"
  },
  "/_nuxt/logout.4e4f0b53.js": {
    "type": "application/javascript",
    "etag": "\"b5-dqkZCDYHNlpcSEnTQhGI0YgYcqY\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 181,
    "path": "../public/_nuxt/logout.4e4f0b53.js"
  },
  "/_nuxt/MiniArtworkPreview.6fc2f007.js": {
    "type": "application/javascript",
    "etag": "\"109a-2kwlRtrEkI4+wfemVoYTS7rL7Z4\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 4250,
    "path": "../public/_nuxt/MiniArtworkPreview.6fc2f007.js"
  },
  "/_nuxt/MiniArtworkPreview.a5e83137.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17d6d-ANGb88oMK/s5ayJpg7dt4n4r20Y\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 97645,
    "path": "../public/_nuxt/MiniArtworkPreview.a5e83137.css"
  },
  "/_nuxt/ModalView.7e2f7050.js": {
    "type": "application/javascript",
    "etag": "\"1455c-4+4OwVlF1mQoe6D1Dt/mggO5B44\"",
    "mtime": "2023-01-31T10:20:31.562Z",
    "size": 83292,
    "path": "../public/_nuxt/ModalView.7e2f7050.js"
  },
  "/_nuxt/ModalView.9d7d0648.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d0aff-RjGi2PLD4nNyKfl9xkQR7LJjzPw\"",
    "mtime": "2023-01-31T10:20:31.550Z",
    "size": 854783,
    "path": "../public/_nuxt/ModalView.9d7d0648.css"
  },
  "/_nuxt/Poppins-400-10.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-10.7d93459d.woff2"
  },
  "/_nuxt/Poppins-400-8.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-8.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-9.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-9.cb8bdeab.woff2"
  },
  "/_nuxt/ProBadge.169f1b48.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17090-u82ucHX7jQYae4CywNyJsqHhBCk\"",
    "mtime": "2023-01-31T10:20:31.547Z",
    "size": 94352,
    "path": "../public/_nuxt/ProBadge.169f1b48.css"
  },
  "/_nuxt/ProBadge.858c64fa.js": {
    "type": "application/javascript",
    "etag": "\"d908-rNDVlO/Hz31R/kjaT2k5oyauU+Y\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 55560,
    "path": "../public/_nuxt/ProBadge.858c64fa.js"
  },
  "/_nuxt/Profile.85af3611.js": {
    "type": "application/javascript",
    "etag": "\"14207-qy8uQCOyGgUgjrZwyxJYHLvWyFY\"",
    "mtime": "2023-01-31T10:20:31.562Z",
    "size": 82439,
    "path": "../public/_nuxt/Profile.85af3611.js"
  },
  "/_nuxt/Profile.9caf5abf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"eae8c-HLiGIGMt4Vnx3nnZN4DmAsaV7bE\"",
    "mtime": "2023-01-31T10:20:31.551Z",
    "size": 962188,
    "path": "../public/_nuxt/Profile.9caf5abf.css"
  },
  "/_nuxt/RecoverPassword.de25b2d6.js": {
    "type": "application/javascript",
    "etag": "\"995-oakbkiYPCDF8/EAFkPK/HVMvkSo\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 2453,
    "path": "../public/_nuxt/RecoverPassword.de25b2d6.js"
  },
  "/_nuxt/redraws.0ec45caa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17bff-Z1Al6pHLRe3Wp4qWM1nCvC7WoII\"",
    "mtime": "2023-01-31T10:20:31.544Z",
    "size": 97279,
    "path": "../public/_nuxt/redraws.0ec45caa.css"
  },
  "/_nuxt/redraws.3cdbbf02.js": {
    "type": "application/javascript",
    "etag": "\"b54-cZdD5tPcz80OHir8iiF2CGmfmRI\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 2900,
    "path": "../public/_nuxt/redraws.3cdbbf02.js"
  },
  "/_nuxt/setting.77186e45.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5b6df-MU6hQ3UJo6vZHVeIpSHkWLCuqy4\"",
    "mtime": "2023-01-31T10:20:31.549Z",
    "size": 374495,
    "path": "../public/_nuxt/setting.77186e45.css"
  },
  "/_nuxt/setting.e44ef132.js": {
    "type": "application/javascript",
    "etag": "\"82d9-udBX6uZO/UKpROktSANODyNUCqQ\"",
    "mtime": "2023-01-31T10:20:31.560Z",
    "size": 33497,
    "path": "../public/_nuxt/setting.e44ef132.js"
  },
  "/_nuxt/TagFilterSelection.e345f2db.js": {
    "type": "application/javascript",
    "etag": "\"611-rxV/Mh1SjqkUqbt6wcM3w20cS+c\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 1553,
    "path": "../public/_nuxt/TagFilterSelection.e345f2db.js"
  },
  "/_nuxt/useArtTrade.64bea7f7.js": {
    "type": "application/javascript",
    "etag": "\"1846-zmsgd8vBchzn/irqnnVKW9lz3Lc\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 6214,
    "path": "../public/_nuxt/useArtTrade.64bea7f7.js"
  },
  "/_nuxt/useFeed.aa4f4fc6.js": {
    "type": "application/javascript",
    "etag": "\"3f02-vIrwmShRNJwvQvyBRLJHj/G/Wjc\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 16130,
    "path": "../public/_nuxt/useFeed.aa4f4fc6.js"
  },
  "/_nuxt/useI18n.bbcb5e0d.js": {
    "type": "application/javascript",
    "etag": "\"62-PIlvDha9wglsgW+dD/cC9npdn1w\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.bbcb5e0d.js"
  },
  "/_nuxt/user-counters-api.e80228d5.js": {
    "type": "application/javascript",
    "etag": "\"1585-Vw4HnX/Gw1HjcD2NgEGsVfOzg8E\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.e80228d5.js"
  },
  "/_nuxt/useReport.672ca52d.js": {
    "type": "application/javascript",
    "etag": "\"1768-y7IwesCDTzlMc0Ee9suv+dvOjM4\"",
    "mtime": "2023-01-31T10:20:31.557Z",
    "size": 5992,
    "path": "../public/_nuxt/useReport.672ca52d.js"
  },
  "/_nuxt/UserList.bb28d12a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16e3f-2s2rGkskVsRC4m/eJnZQt3yqJog\"",
    "mtime": "2023-01-31T10:20:31.547Z",
    "size": 93759,
    "path": "../public/_nuxt/UserList.bb28d12a.css"
  },
  "/_nuxt/UserList.c1f87960.js": {
    "type": "application/javascript",
    "etag": "\"109d-ML1MH6nLgMvMycV122GCUdcDHzA\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 4253,
    "path": "../public/_nuxt/UserList.c1f87960.js"
  },
  "/_nuxt/useSetting.b53fbf40.js": {
    "type": "application/javascript",
    "etag": "\"477-s5OVqnIdKBwv6xQDPuCXubrmsYs\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 1143,
    "path": "../public/_nuxt/useSetting.b53fbf40.js"
  },
  "/_nuxt/useUser.6a5aade3.js": {
    "type": "application/javascript",
    "etag": "\"593e-eMD0ItdxbnPKsjxvKxZyMjExpDo\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 22846,
    "path": "../public/_nuxt/useUser.6a5aade3.js"
  },
  "/_nuxt/vue3-editor.common.22c45aed.js": {
    "type": "application/javascript",
    "etag": "\"49159-AWfDK/rwmeV0sGUxmNBfcGDIfQk\"",
    "mtime": "2023-01-31T10:20:31.557Z",
    "size": 299353,
    "path": "../public/_nuxt/vue3-editor.common.22c45aed.js"
  },
  "/_nuxt/WorkList.3d41567f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18dbf-LcDajEqaPaQ5fk3L4FEttfRNqLg\"",
    "mtime": "2023-01-31T10:20:31.548Z",
    "size": 101823,
    "path": "../public/_nuxt/WorkList.3d41567f.css"
  },
  "/_nuxt/WorkList.909e482a.js": {
    "type": "application/javascript",
    "etag": "\"13f6-e2xB4s3DuK6iFxiDNAPYiGNXFmw\"",
    "mtime": "2023-01-31T10:20:31.559Z",
    "size": 5110,
    "path": "../public/_nuxt/WorkList.909e482a.js"
  },
  "/_nuxt/_id.09060681.js": {
    "type": "application/javascript",
    "etag": "\"31e-joqto+J1rwwZz9KEMV041jf9t6E\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 798,
    "path": "../public/_nuxt/_id.09060681.js"
  },
  "/_nuxt/_id_.081d0301.js": {
    "type": "application/javascript",
    "etag": "\"2616-2aZhT8FuwmwF5PAvD2HDcmT+FC8\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 9750,
    "path": "../public/_nuxt/_id_.081d0301.js"
  },
  "/_nuxt/_id_.8e059b32.js": {
    "type": "application/javascript",
    "etag": "\"5ca-phDCeu6ErSe9PWYApNWAJz7stuI\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 1482,
    "path": "../public/_nuxt/_id_.8e059b32.js"
  },
  "/_nuxt/_id_.d1d7b638.js": {
    "type": "application/javascript",
    "etag": "\"384-g6QaukhYNGtOl5qjw1v/+4VAF2E\"",
    "mtime": "2023-01-31T10:20:31.552Z",
    "size": 900,
    "path": "../public/_nuxt/_id_.d1d7b638.js"
  },
  "/_nuxt/_id_.d97abc05.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"489-55e1Zay8DICZkwL1nU6hGqGJIgA\"",
    "mtime": "2023-01-31T10:20:31.543Z",
    "size": 1161,
    "path": "../public/_nuxt/_id_.d97abc05.css"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-01-31T10:20:31.555Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/_nuxt/_username_.3764e080.js": {
    "type": "application/javascript",
    "etag": "\"419-eTRe2w1BA4l5AmRpH7SWU4V7UeI\"",
    "mtime": "2023-01-31T10:20:31.553Z",
    "size": 1049,
    "path": "../public/_nuxt/_username_.3764e080.js"
  },
  "/_nuxt/_username_.60876666.js": {
    "type": "application/javascript",
    "etag": "\"3eb-kzjHd3MwMa/uoqQ4P2Fqy6JuVWg\"",
    "mtime": "2023-01-31T10:20:31.556Z",
    "size": 1003,
    "path": "../public/_nuxt/_username_.60876666.js"
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
