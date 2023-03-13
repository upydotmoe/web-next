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
    "mtime": "2023-03-13T06:27:38.348Z",
    "size": 2897,
    "path": "../public/css/nuxt-google-fonts.css"
  },
  "/fonts/Inter-400-1.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-03-13T06:27:38.306Z",
    "size": 9344,
    "path": "../public/fonts/Inter-400-1.woff2"
  },
  "/fonts/Inter-400-2.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-03-13T06:27:38.308Z",
    "size": 6304,
    "path": "../public/fonts/Inter-400-2.woff2"
  },
  "/fonts/Inter-400-3.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-03-13T06:27:38.310Z",
    "size": 4760,
    "path": "../public/fonts/Inter-400-3.woff2"
  },
  "/fonts/Inter-400-4.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-03-13T06:27:38.306Z",
    "size": 7936,
    "path": "../public/fonts/Inter-400-4.woff2"
  },
  "/fonts/Inter-400-5.woff2": {
    "type": "font/woff2",
    "etag": "\"e80-l/PHQ7mBTko1XNmFRvC/8hNkLX8\"",
    "mtime": "2023-03-13T06:27:38.312Z",
    "size": 3712,
    "path": "../public/fonts/Inter-400-5.woff2"
  },
  "/fonts/Inter-400-6.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-03-13T06:27:38.324Z",
    "size": 20432,
    "path": "../public/fonts/Inter-400-6.woff2"
  },
  "/fonts/Inter-400-7.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-03-13T06:27:38.315Z",
    "size": 16708,
    "path": "../public/fonts/Inter-400-7.woff2"
  },
  "/fonts/Poppins-400-10.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-03-13T06:27:38.316Z",
    "size": 7884,
    "path": "../public/fonts/Poppins-400-10.woff2"
  },
  "/fonts/Poppins-400-8.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-03-13T06:27:38.347Z",
    "size": 39564,
    "path": "../public/fonts/Poppins-400-8.woff2"
  },
  "/fonts/Poppins-400-9.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-03-13T06:27:38.316Z",
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
  "/_nuxt/AccountVerification.ba2216e1.js": {
    "type": "application/javascript",
    "etag": "\"4ae-V49I4quwTM2TsgyPLMAzzQ3v8HU\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 1198,
    "path": "../public/_nuxt/AccountVerification.ba2216e1.js"
  },
  "/_nuxt/ArtworkForm.32597bec.js": {
    "type": "application/javascript",
    "etag": "\"3aca7-inhW/4DGizDiP6C1WMg+bSd9w/8\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 240807,
    "path": "../public/_nuxt/ArtworkForm.32597bec.js"
  },
  "/_nuxt/ArtworkForm.49e39d2f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c1ad-+2Ed5KFFfe4zvKgn2ZO3LXg19NU\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 115117,
    "path": "../public/_nuxt/ArtworkForm.49e39d2f.css"
  },
  "/_nuxt/bg-abstract.5b021a0f.png": {
    "type": "image/png",
    "etag": "\"67e2c-nIlHLJUgJzY9SiIietMesGUoPNE\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 425516,
    "path": "../public/_nuxt/bg-abstract.5b021a0f.png"
  },
  "/_nuxt/blank.48926400.png": {
    "type": "image/png",
    "etag": "\"1eca-cWYpFNaTbqQxOl0/tK/8vPMqXJY\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 7882,
    "path": "../public/_nuxt/blank.48926400.png"
  },
  "/_nuxt/entry.05f698ef.js": {
    "type": "application/javascript",
    "etag": "\"8a076-Jz/1rV+g3NOlzdnF8peArG3dGEI\"",
    "mtime": "2023-03-13T06:28:37.880Z",
    "size": 565366,
    "path": "../public/_nuxt/entry.05f698ef.js"
  },
  "/_nuxt/entry.b09d7e21.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4d214-iq2JMHer7Ptl7dOLeVlrjFQdC3U\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 315924,
    "path": "../public/_nuxt/entry.b09d7e21.css"
  },
  "/_nuxt/error-404.3d372569.js": {
    "type": "application/javascript",
    "etag": "\"8e2-46LHRKbRMuUzD7iHzgZcTbcvoq8\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 2274,
    "path": "../public/_nuxt/error-404.3d372569.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-03-13T06:28:37.867Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.167e0961.js": {
    "type": "application/javascript",
    "etag": "\"78b-lYuRlSDRC6Tan+mvDk1p5rkLrNg\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 1931,
    "path": "../public/_nuxt/error-500.167e0961.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-03-13T06:28:37.867Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.474fb47f.js": {
    "type": "application/javascript",
    "etag": "\"4ba-Sn3JFt6oaMvKUXLxzsr8rtVqkRw\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 1210,
    "path": "../public/_nuxt/error-component.474fb47f.js"
  },
  "/_nuxt/FeedModalView.54b93ba3.js": {
    "type": "application/javascript",
    "etag": "\"43b5-7c6NUguaOLeKv/Y0YlYT8WQzubU\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 17333,
    "path": "../public/_nuxt/FeedModalView.54b93ba3.js"
  },
  "/_nuxt/FeedModalView.a534172e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3019f-p27hG90b96m/1rBTpIsDBAeAGlw\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 197023,
    "path": "../public/_nuxt/FeedModalView.a534172e.css"
  },
  "/_nuxt/folder.11be08fa.png": {
    "type": "image/png",
    "etag": "\"35e6-VB6US8uN7xYnIuG8CZX2yLC47CI\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 13798,
    "path": "../public/_nuxt/folder.11be08fa.png"
  },
  "/_nuxt/heap.1e9642da.js": {
    "type": "application/javascript",
    "etag": "\"281-RSxx1LgPgIaRmrvtzbImdEKqe4Q\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 641,
    "path": "../public/_nuxt/heap.1e9642da.js"
  },
  "/_nuxt/index.026a1529.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12ed3-nbOhN8UQRjxAazCtn9ucnNI4iIo\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 77523,
    "path": "../public/_nuxt/index.026a1529.css"
  },
  "/_nuxt/index.0ee6a991.js": {
    "type": "application/javascript",
    "etag": "\"239-uGxDhOImovXyXo5Eytg5F+vrKhs\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 569,
    "path": "../public/_nuxt/index.0ee6a991.js"
  },
  "/_nuxt/index.18829dc1.js": {
    "type": "application/javascript",
    "etag": "\"1b0-EsU/aJtfVYuySjxoatXPIkCFjrk\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 432,
    "path": "../public/_nuxt/index.18829dc1.js"
  },
  "/_nuxt/index.235be03b.js": {
    "type": "application/javascript",
    "etag": "\"1bfb-SEuCrmA2bxoKJ2PV44QrN3W0yjE\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 7163,
    "path": "../public/_nuxt/index.235be03b.js"
  },
  "/_nuxt/index.307179bf.js": {
    "type": "application/javascript",
    "etag": "\"2b82-NkH/1GPgUSL7wQzneyzEu/yA4oM\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 11138,
    "path": "../public/_nuxt/index.307179bf.js"
  },
  "/_nuxt/index.3105de03.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"42d-fHmsTiWx5UOstZZqDWxQ6TDGAyE\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 1069,
    "path": "../public/_nuxt/index.3105de03.css"
  },
  "/_nuxt/index.32ec2a79.js": {
    "type": "application/javascript",
    "etag": "\"177-m9W30jWFvLzGyg1GPxzEE3o0lpM\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 375,
    "path": "../public/_nuxt/index.32ec2a79.js"
  },
  "/_nuxt/index.3ea6e72a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16c8b-nAUmbrHR/VYwhLQFEaYFenng8QA\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 93323,
    "path": "../public/_nuxt/index.3ea6e72a.css"
  },
  "/_nuxt/index.3fccca3a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17ca5-BBLlfbB74pdfAVMOWzgrqIovsUQ\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 97445,
    "path": "../public/_nuxt/index.3fccca3a.css"
  },
  "/_nuxt/index.4141ddcc.js": {
    "type": "application/javascript",
    "etag": "\"1097-eAcQ8xazgirXZWzxVhJtyWNJSag\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 4247,
    "path": "../public/_nuxt/index.4141ddcc.js"
  },
  "/_nuxt/index.4c1bf333.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1790e-nJBz4sN6pNjpFFbGG1gEv2fSi6w\"",
    "mtime": "2023-03-13T06:28:37.867Z",
    "size": 96526,
    "path": "../public/_nuxt/index.4c1bf333.css"
  },
  "/_nuxt/index.4c322f38.js": {
    "type": "application/javascript",
    "etag": "\"3a2-T6BfR28A9ofNTu8p8KTkanFkqSI\"",
    "mtime": "2023-03-13T06:28:37.878Z",
    "size": 930,
    "path": "../public/_nuxt/index.4c322f38.js"
  },
  "/_nuxt/index.5528615d.js": {
    "type": "application/javascript",
    "etag": "\"18c-q2c8Hl+4doZHdrKmLZkFclXxZUA\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 396,
    "path": "../public/_nuxt/index.5528615d.js"
  },
  "/_nuxt/index.5ee530f8.js": {
    "type": "application/javascript",
    "etag": "\"e2f-EicDy6tikUo4sZ8VN/WfNFxDEHY\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 3631,
    "path": "../public/_nuxt/index.5ee530f8.js"
  },
  "/_nuxt/index.602bff4a.js": {
    "type": "application/javascript",
    "etag": "\"8ae-j+4a+luEmyhATFJl7vRjhR0FfNs\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 2222,
    "path": "../public/_nuxt/index.602bff4a.js"
  },
  "/_nuxt/index.621c284d.js": {
    "type": "application/javascript",
    "etag": "\"2ae-5P6XnXNBvnaqj2NU1r/bp5Mof6k\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 686,
    "path": "../public/_nuxt/index.621c284d.js"
  },
  "/_nuxt/index.67c83655.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17ca5-pH+KHcN1qODfPjxdBkQr2jkhb4c\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 97445,
    "path": "../public/_nuxt/index.67c83655.css"
  },
  "/_nuxt/index.716331f0.js": {
    "type": "application/javascript",
    "etag": "\"1093-47emojenhCC/pJtQKnRd3tLsOvE\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 4243,
    "path": "../public/_nuxt/index.716331f0.js"
  },
  "/_nuxt/index.77e1d2b5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2d907-CLO+lF3RU3jfPKHvuUphkhChrgY\"",
    "mtime": "2023-03-13T06:28:37.867Z",
    "size": 186631,
    "path": "../public/_nuxt/index.77e1d2b5.css"
  },
  "/_nuxt/index.7fd19614.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"46448-S+70szmBUaQ28JvjXurW/iaw2P8\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 287816,
    "path": "../public/_nuxt/index.7fd19614.css"
  },
  "/_nuxt/index.89faa5ad.js": {
    "type": "application/javascript",
    "etag": "\"14de-jNgKSTRH3UFDgICMlpOVSGhVWUA\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 5342,
    "path": "../public/_nuxt/index.89faa5ad.js"
  },
  "/_nuxt/index.8c50ae6c.js": {
    "type": "application/javascript",
    "etag": "\"3802-32aTFryCYxlvQO9VsZOSAAQ8+Fk\"",
    "mtime": "2023-03-13T06:28:37.878Z",
    "size": 14338,
    "path": "../public/_nuxt/index.8c50ae6c.js"
  },
  "/_nuxt/index.8fd00f86.js": {
    "type": "application/javascript",
    "etag": "\"2479-YRqkZoD9dIHeYZYo13/3iIFVyjc\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 9337,
    "path": "../public/_nuxt/index.8fd00f86.js"
  },
  "/_nuxt/index.9b0883c6.js": {
    "type": "application/javascript",
    "etag": "\"96-QfiGqvEJGdco203ap/C/lC/ux4U\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 150,
    "path": "../public/_nuxt/index.9b0883c6.js"
  },
  "/_nuxt/index.9f5a68be.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17ca5-BALY+afJkfZPMZa7d+YiiIWqTB4\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 97445,
    "path": "../public/_nuxt/index.9f5a68be.css"
  },
  "/_nuxt/index.a25f89c5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17cdd-ZeAqxrz15ZGtDqNpBxGtDjcpm00\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 97501,
    "path": "../public/_nuxt/index.a25f89c5.css"
  },
  "/_nuxt/index.a45eaa98.js": {
    "type": "application/javascript",
    "etag": "\"2c0c-bM4oya0pQdAIeKjc7gEvZuSNtxc\"",
    "mtime": "2023-03-13T06:28:37.878Z",
    "size": 11276,
    "path": "../public/_nuxt/index.a45eaa98.js"
  },
  "/_nuxt/index.af539870.js": {
    "type": "application/javascript",
    "etag": "\"38-8TTJTKg/ZWMIh5CnglFiA8bmWM8\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 56,
    "path": "../public/_nuxt/index.af539870.js"
  },
  "/_nuxt/index.d2018ee9.js": {
    "type": "application/javascript",
    "etag": "\"4c5-Vcslf5la5HD+4TrHNV8xBs5gNdo\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 1221,
    "path": "../public/_nuxt/index.d2018ee9.js"
  },
  "/_nuxt/index.d7d3b772.js": {
    "type": "application/javascript",
    "etag": "\"19b5-hYqhIaKG9kLxjlKg+YjhWbSHjA0\"",
    "mtime": "2023-03-13T06:28:37.878Z",
    "size": 6581,
    "path": "../public/_nuxt/index.d7d3b772.js"
  },
  "/_nuxt/index.d7f30a8b.js": {
    "type": "application/javascript",
    "etag": "\"e95-P1JHs0kgRZ1eSoH7561PYpb30Ew\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 3733,
    "path": "../public/_nuxt/index.d7f30a8b.js"
  },
  "/_nuxt/index.e67c23f1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17ca5-uuk/LiNZGPuXQGyxxz6saf/3LCg\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 97445,
    "path": "../public/_nuxt/index.e67c23f1.css"
  },
  "/_nuxt/index.e748659a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4b-P4Yk7jX01c9QdC2gMZuU+qSDKLA\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 75,
    "path": "../public/_nuxt/index.e748659a.css"
  },
  "/_nuxt/index.e7713019.js": {
    "type": "application/javascript",
    "etag": "\"1b76-QH+MJZ2dWgu64m5LW9TAxCLEmbU\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 7030,
    "path": "../public/_nuxt/index.e7713019.js"
  },
  "/_nuxt/index.e9e838e3.js": {
    "type": "application/javascript",
    "etag": "\"f7-du+zkrdG0xWlOhQSdlcAG1Gaov8\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 247,
    "path": "../public/_nuxt/index.e9e838e3.js"
  },
  "/_nuxt/index.ed08ebb7.js": {
    "type": "application/javascript",
    "etag": "\"1096-oI1rPQRhUo8YYc+Gmz9js2omWoc\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 4246,
    "path": "../public/_nuxt/index.ed08ebb7.js"
  },
  "/_nuxt/index.ef093ae8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16f35-55DR4e0Sv6SuXhvtqgxRxs6U9FM\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 94005,
    "path": "../public/_nuxt/index.ef093ae8.css"
  },
  "/_nuxt/index.f1702ded.js": {
    "type": "application/javascript",
    "etag": "\"2a1-Vwmg40SBPYwkicYizY0aJPh0zdw\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 673,
    "path": "../public/_nuxt/index.f1702ded.js"
  },
  "/_nuxt/index.f672e8c9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4787d-mECIqWastW+YIGqAS1p5e0P7jMQ\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 292989,
    "path": "../public/_nuxt/index.f672e8c9.css"
  },
  "/_nuxt/Inter-400-1.f7666a51.woff2": {
    "type": "font/woff2",
    "etag": "\"2480-RPsleFd8vOCBQCAqjTw0PKXfnPM\"",
    "mtime": "2023-03-13T06:28:37.861Z",
    "size": 9344,
    "path": "../public/_nuxt/Inter-400-1.f7666a51.woff2"
  },
  "/_nuxt/Inter-400-2.e9493683.woff2": {
    "type": "font/woff2",
    "etag": "\"18a0-ukrRLUnHqKKLCsI9Dbf8S2ciqrs\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 6304,
    "path": "../public/_nuxt/Inter-400-2.e9493683.woff2"
  },
  "/_nuxt/Inter-400-3.d3e30cde.woff2": {
    "type": "font/woff2",
    "etag": "\"1298-fgpuVSjGRKJN4LvExxfEsL58DjY\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 4760,
    "path": "../public/_nuxt/Inter-400-3.d3e30cde.woff2"
  },
  "/_nuxt/Inter-400-4.2f2d421a.woff2": {
    "type": "font/woff2",
    "etag": "\"1f00-an57hzt+8gpw0oZzHrbJN2fkxDI\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 7936,
    "path": "../public/_nuxt/Inter-400-4.2f2d421a.woff2"
  },
  "/_nuxt/Inter-400-6.64a98f58.woff2": {
    "type": "font/woff2",
    "etag": "\"4fd0-4iF8j44tPPJJgjWY+hAyNAz4zUM\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 20432,
    "path": "../public/_nuxt/Inter-400-6.64a98f58.woff2"
  },
  "/_nuxt/Inter-400-7.0364d368.woff2": {
    "type": "font/woff2",
    "etag": "\"4144-SvUDeeE1FFWN1T0SPbjqEB7F4kw\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 16708,
    "path": "../public/_nuxt/Inter-400-7.0364d368.woff2"
  },
  "/_nuxt/Layout.896833a6.js": {
    "type": "application/javascript",
    "etag": "\"16267-RFIor9NceHGfH+Oo7nDi9oO4Q0o\"",
    "mtime": "2023-03-13T06:28:37.880Z",
    "size": 90727,
    "path": "../public/_nuxt/Layout.896833a6.js"
  },
  "/_nuxt/Layout.e8dd5323.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d79b8-yyJB3Rni3GWxs+FJX7vs8GfS0JM\"",
    "mtime": "2023-03-13T06:28:37.870Z",
    "size": 883128,
    "path": "../public/_nuxt/Layout.e8dd5323.css"
  },
  "/_nuxt/LoadingEmptyErrorMessage.983e35c1.js": {
    "type": "application/javascript",
    "etag": "\"58d-uUb+hMjb4hKaDX+MyYNE1Tr6YwQ\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 1421,
    "path": "../public/_nuxt/LoadingEmptyErrorMessage.983e35c1.js"
  },
  "/_nuxt/logo-white.c01eec53.png": {
    "type": "image/png",
    "etag": "\"a540-Kuz6rJZL9LjU+eOP0CHtnafYZgs\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 42304,
    "path": "../public/_nuxt/logo-white.c01eec53.png"
  },
  "/_nuxt/logo.a6397618.png": {
    "type": "image/png",
    "etag": "\"daed-WbMP2dDMmH3EOvlmIyaMOmY+dWg\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 56045,
    "path": "../public/_nuxt/logo.a6397618.png"
  },
  "/_nuxt/logout.ab6350b2.js": {
    "type": "application/javascript",
    "etag": "\"af-Y4gxbU9aSskq0c+8T0dlWKGBjhw\"",
    "mtime": "2023-03-13T06:28:37.873Z",
    "size": 175,
    "path": "../public/_nuxt/logout.ab6350b2.js"
  },
  "/_nuxt/MiniArtworkPreview.115a27a0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17e13-cZVe/rup+87SXeAxcOFDZfiwl4Y\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 97811,
    "path": "../public/_nuxt/MiniArtworkPreview.115a27a0.css"
  },
  "/_nuxt/MiniArtworkPreview.2cbb70b4.js": {
    "type": "application/javascript",
    "etag": "\"1074-W6CWsngJR1FbCR/HKU7zOl0pY9Y\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 4212,
    "path": "../public/_nuxt/MiniArtworkPreview.2cbb70b4.js"
  },
  "/_nuxt/ModalView.10bf4b3d.js": {
    "type": "application/javascript",
    "etag": "\"1456c-wpt/e8gfSvN8FUE9vKpyWmFGfmw\"",
    "mtime": "2023-03-13T06:28:37.880Z",
    "size": 83308,
    "path": "../public/_nuxt/ModalView.10bf4b3d.js"
  },
  "/_nuxt/ModalView.361868db.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d10d1-KBlq8lxym2LZ8MuRp2qxFZPSxKo\"",
    "mtime": "2023-03-13T06:28:37.871Z",
    "size": 856273,
    "path": "../public/_nuxt/ModalView.361868db.css"
  },
  "/_nuxt/Poppins-400-10.7d93459d.woff2": {
    "type": "font/woff2",
    "etag": "\"1ecc-rG1xtNX90rPavJoG/2wAHkJR2gs\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 7884,
    "path": "../public/_nuxt/Poppins-400-10.7d93459d.woff2"
  },
  "/_nuxt/Poppins-400-8.478b3ab7.woff2": {
    "type": "font/woff2",
    "etag": "\"9a8c-QeVlUMyPGaf2XBYEFlju2/iIzJg\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 39564,
    "path": "../public/_nuxt/Poppins-400-8.478b3ab7.woff2"
  },
  "/_nuxt/Poppins-400-9.cb8bdeab.woff2": {
    "type": "font/woff2",
    "etag": "\"15a8-Za8qA3pe+KjTg9UYN36h+faDdjE\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 5544,
    "path": "../public/_nuxt/Poppins-400-9.cb8bdeab.woff2"
  },
  "/_nuxt/ProBadge.0148f2b1.js": {
    "type": "application/javascript",
    "etag": "\"d908-9Ej15vRZlwaAue+Z7EbUbquX3Io\"",
    "mtime": "2023-03-13T06:28:37.876Z",
    "size": 55560,
    "path": "../public/_nuxt/ProBadge.0148f2b1.js"
  },
  "/_nuxt/ProBadge.44fcdf22.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17136-KuOF0u9UFvc3fCT+O7ejFRCPCh8\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 94518,
    "path": "../public/_nuxt/ProBadge.44fcdf22.css"
  },
  "/_nuxt/Profile.2d0f9a4c.js": {
    "type": "application/javascript",
    "etag": "\"1432c-3r1fleBHLLUIa9VTxGPdx+LykNM\"",
    "mtime": "2023-03-13T06:28:37.880Z",
    "size": 82732,
    "path": "../public/_nuxt/Profile.2d0f9a4c.js"
  },
  "/_nuxt/Profile.95edbe91.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"eb508-YuIjGQnF4XtFqeNg2yOBg0woz1Y\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 963848,
    "path": "../public/_nuxt/Profile.95edbe91.css"
  },
  "/_nuxt/RecoverPassword.08a4efab.js": {
    "type": "application/javascript",
    "etag": "\"995-Fl4M9XMZh82Q12gPQdqbVKiO1S8\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 2453,
    "path": "../public/_nuxt/RecoverPassword.08a4efab.js"
  },
  "/_nuxt/redraws.328fd7db.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17ca5-8rEoQ5xH+oAJL2vf91HiOSSvrEU\"",
    "mtime": "2023-03-13T06:28:37.867Z",
    "size": 97445,
    "path": "../public/_nuxt/redraws.328fd7db.css"
  },
  "/_nuxt/redraws.dc70b921.js": {
    "type": "application/javascript",
    "etag": "\"b59-fdRkkLMt4Ns/PhXMu6qHVQWSlzM\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 2905,
    "path": "../public/_nuxt/redraws.dc70b921.js"
  },
  "/_nuxt/setting.84ba156e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"5b977-pLpv2wa+FzsJFwUTjd0WSA/2EqA\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 375159,
    "path": "../public/_nuxt/setting.84ba156e.css"
  },
  "/_nuxt/setting.85b1bef3.js": {
    "type": "application/javascript",
    "etag": "\"82e7-QprLd2OY8rf4Lc2nLUcf9r7bpw8\"",
    "mtime": "2023-03-13T06:28:37.878Z",
    "size": 33511,
    "path": "../public/_nuxt/setting.85b1bef3.js"
  },
  "/_nuxt/TagFilterSelection.9d4f7603.js": {
    "type": "application/javascript",
    "etag": "\"611-wbQ0R2qTdsdoE1YDrlJ8V1u73so\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 1553,
    "path": "../public/_nuxt/TagFilterSelection.9d4f7603.js"
  },
  "/_nuxt/useArtTrade.dcd2d94d.js": {
    "type": "application/javascript",
    "etag": "\"1846-pmYtPdYrwx1q+P+7hNJypm4CJ2M\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 6214,
    "path": "../public/_nuxt/useArtTrade.dcd2d94d.js"
  },
  "/_nuxt/useFeed.d5b8d816.js": {
    "type": "application/javascript",
    "etag": "\"3f02-giScP4Iiofk0K/AvJ8e8Qf6eGDo\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 16130,
    "path": "../public/_nuxt/useFeed.d5b8d816.js"
  },
  "/_nuxt/useI18n.779ba6b7.js": {
    "type": "application/javascript",
    "etag": "\"62-S3Gh1thRoUPx78HHxq1ZFxPjxvE\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 98,
    "path": "../public/_nuxt/useI18n.779ba6b7.js"
  },
  "/_nuxt/user-counters-api.9c94d46c.js": {
    "type": "application/javascript",
    "etag": "\"1585-WwmDrED1y9deFaFVvfvPEvlD5ag\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 5509,
    "path": "../public/_nuxt/user-counters-api.9c94d46c.js"
  },
  "/_nuxt/useReport.b296a84d.js": {
    "type": "application/javascript",
    "etag": "\"1768-EQ/1W5uSK8YZWbdiD5ezyxCS/04\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 5992,
    "path": "../public/_nuxt/useReport.b296a84d.js"
  },
  "/_nuxt/UserList.35f28958.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"16ee5-bgmWNa0ZT/PPFvf6fBLOJGwad2g\"",
    "mtime": "2023-03-13T06:28:37.868Z",
    "size": 93925,
    "path": "../public/_nuxt/UserList.35f28958.css"
  },
  "/_nuxt/UserList.46ac20b3.js": {
    "type": "application/javascript",
    "etag": "\"10a2-yDsdFwgnV17wYfFx5AvYThIPdpk\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 4258,
    "path": "../public/_nuxt/UserList.46ac20b3.js"
  },
  "/_nuxt/useSetting.c4a424f7.js": {
    "type": "application/javascript",
    "etag": "\"477-pclNEZHz5TOb/471kjmoNJhU8+s\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 1143,
    "path": "../public/_nuxt/useSetting.c4a424f7.js"
  },
  "/_nuxt/useUser.65e8f8bc.js": {
    "type": "application/javascript",
    "etag": "\"593e-bEh7wK2r02fHksYWNu8RGya4vVI\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 22846,
    "path": "../public/_nuxt/useUser.65e8f8bc.js"
  },
  "/_nuxt/vue3-editor.common.90d68174.js": {
    "type": "application/javascript",
    "etag": "\"49159-5bEUeZ6p/tpdM2S5G0LvAnl/ork\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 299353,
    "path": "../public/_nuxt/vue3-editor.common.90d68174.js"
  },
  "/_nuxt/WorkList.1ac47803.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"18e65-HmMqig/X2pA8E/gmRZtFKouoxmE\"",
    "mtime": "2023-03-13T06:28:37.865Z",
    "size": 101989,
    "path": "../public/_nuxt/WorkList.1ac47803.css"
  },
  "/_nuxt/WorkList.5f1716c3.js": {
    "type": "application/javascript",
    "etag": "\"13f6-7BpTBopDzggTHOFDyWzLxxd9f7w\"",
    "mtime": "2023-03-13T06:28:37.877Z",
    "size": 5110,
    "path": "../public/_nuxt/WorkList.5f1716c3.js"
  },
  "/_nuxt/_id.cd6b91a4.js": {
    "type": "application/javascript",
    "etag": "\"31e-whuAV9u1GyYI38x9NfLbTQzOYv0\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 798,
    "path": "../public/_nuxt/_id.cd6b91a4.js"
  },
  "/_nuxt/_id_.2abbe8b5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"4bf-Acogm2AlsODRv3zCozy6+1fTgGE\"",
    "mtime": "2023-03-13T06:28:37.864Z",
    "size": 1215,
    "path": "../public/_nuxt/_id_.2abbe8b5.css"
  },
  "/_nuxt/_id_.7f38829d.js": {
    "type": "application/javascript",
    "etag": "\"5c5-WSiokTxK7mzE3Jy4ZPQjr2vmp3M\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 1477,
    "path": "../public/_nuxt/_id_.7f38829d.js"
  },
  "/_nuxt/_id_.8020b83b.js": {
    "type": "application/javascript",
    "etag": "\"383-w6APG7SzGU7RuFLRXpxG3XAJWqM\"",
    "mtime": "2023-03-13T06:28:37.874Z",
    "size": 899,
    "path": "../public/_nuxt/_id_.8020b83b.js"
  },
  "/_nuxt/_id_.f28ce2e3.js": {
    "type": "application/javascript",
    "etag": "\"2616-eD/01KQFSon6gT+zTbzAEK5jXfw\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 9750,
    "path": "../public/_nuxt/_id_.f28ce2e3.js"
  },
  "/_nuxt/_plugin-vue_export-helper.c27b6911.js": {
    "type": "application/javascript",
    "etag": "\"5b-eFCz/UrraTh721pgAl0VxBNR1es\"",
    "mtime": "2023-03-13T06:28:37.872Z",
    "size": 91,
    "path": "../public/_nuxt/_plugin-vue_export-helper.c27b6911.js"
  },
  "/_nuxt/_username_.b954a49c.js": {
    "type": "application/javascript",
    "etag": "\"3ea-jFuIvZl7dSXpOMvvTVRUX/QVRF8\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 1002,
    "path": "../public/_nuxt/_username_.b954a49c.js"
  },
  "/_nuxt/_username_.c41475a7.js": {
    "type": "application/javascript",
    "etag": "\"418-dnJBHPukHS6VpDgf8dzPxS6+knA\"",
    "mtime": "2023-03-13T06:28:37.875Z",
    "size": 1048,
    "path": "../public/_nuxt/_username_.c41475a7.js"
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
