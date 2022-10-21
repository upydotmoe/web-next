import{B as P,f as w,h as y,R as p,j as V}from"./entry.0330daa5.js";const g=function(c){return{commentFeed:async(e,a={})=>{const s="/feeds/comment",t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={};i["Content-Type"]="application/json";const h=new URLSearchParams(t.search);for(const o in u)h.set(o,u[o]);for(const o in a.params)h.set(o,a.params[o]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};n.headers={...i,...m,...a.headers};const l=typeof e!="string"||n.headers["Content-Type"]==="application/json";return n.data=l?JSON.stringify(e!==void 0?e:{}):e||"",{url:t.pathname+t.search+t.hash,options:n}},createFeed:async(e,a={})=>{const s="/feeds/create",t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={};i["Content-Type"]="application/json";const h=new URLSearchParams(t.search);for(const o in u)h.set(o,u[o]);for(const o in a.params)h.set(o,a.params[o]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};n.headers={...i,...m,...a.headers};const l=typeof e!="string"||n.headers["Content-Type"]==="application/json";return n.data=l?JSON.stringify(e!==void 0?e:{}):e||"",{url:t.pathname+t.search+t.hash,options:n}},deleteFeed:async(e,a={})=>{if(e==null)throw new p("feedId","Required parameter feedId was null or undefined when calling deleteFeed.");const s="/feeds/{feedId}".replace("{feedId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"DELETE",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},getFeedById:async(e,a={})=>{if(e==null)throw new p("feedId","Required parameter feedId was null or undefined when calling getFeedById.");const s="/feeds/{feedId}".replace("{feedId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"GET",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},getFeedComments:async(e,a,s,t={})=>{if(e==null)throw new p("feedId","Required parameter feedId was null or undefined when calling getFeedComments.");if(a==null)throw new p("page","Required parameter page was null or undefined when calling getFeedComments.");if(s==null)throw new p("perPage","Required parameter perPage was null or undefined when calling getFeedComments.");const r="/feeds/{feedId}/comments".replace("{feedId}",encodeURIComponent(String(e))),n=new URL(r,"https://example.com");let i;c&&(i=c.baseOptions);const u={method:"GET",...i,...t},h={},m={};a!==void 0&&(m.page=a),s!==void 0&&(m.per_page=s);const l=new URLSearchParams(n.search);for(const d in m)l.set(d,m[d]);for(const d in t.params)l.set(d,t.params[d]);n.search=new URLSearchParams(l).toString();let o=i&&i.headers?i.headers:{};return u.headers={...h,...o,...t.headers},{url:n.pathname+n.search+n.hash,options:u}},getFeeds:async(e,a,s,t={})=>{if(e==null)throw new p("perPage","Required parameter perPage was null or undefined when calling getFeeds.");if(a==null)throw new p("page","Required parameter page was null or undefined when calling getFeeds.");const r="/feeds",n=new URL(r,"https://example.com");let i;c&&(i=c.baseOptions);const u={method:"GET",...i,...t},h={},m={};e!==void 0&&(m.per_page=e),a!==void 0&&(m.page=a),s!==void 0&&(m.mode=s);const l=new URLSearchParams(n.search);for(const d in m)l.set(d,m[d]);for(const d in t.params)l.set(d,t.params[d]);n.search=new URLSearchParams(l).toString();let o=i&&i.headers?i.headers:{};return u.headers={...h,...o,...t.headers},{url:n.pathname+n.search+n.hash,options:u}},getFeedsByUserId:async(e,a,s,t={})=>{if(e==null)throw new p("userId","Required parameter userId was null or undefined when calling getFeedsByUserId.");if(a==null)throw new p("page","Required parameter page was null or undefined when calling getFeedsByUserId.");if(s==null)throw new p("perPage","Required parameter perPage was null or undefined when calling getFeedsByUserId.");const r="/feeds/user/{userId}".replace("{userId}",encodeURIComponent(String(e))),n=new URL(r,"https://example.com");let i;c&&(i=c.baseOptions);const u={method:"GET",...i,...t},h={},m={};a!==void 0&&(m.page=a),s!==void 0&&(m.per_page=s);const l=new URLSearchParams(n.search);for(const d in m)l.set(d,m[d]);for(const d in t.params)l.set(d,t.params[d]);n.search=new URLSearchParams(l).toString();let o=i&&i.headers?i.headers:{};return u.headers={...h,...o,...t.headers},{url:n.pathname+n.search+n.hash,options:u}},getFollowingFeed:async(e,a,s={})=>{if(e==null)throw new p("page","Required parameter page was null or undefined when calling getFollowingFeed.");if(a==null)throw new p("perPage","Required parameter perPage was null or undefined when calling getFollowingFeed.");const t="/feeds/following",r=new URL(t,"https://example.com");let n;c&&(n=c.baseOptions);const i={method:"GET",...n,...s},u={},h={};e!==void 0&&(h.page=e),a!==void 0&&(h.per_page=a);const m=new URLSearchParams(r.search);for(const o in h)m.set(o,h[o]);for(const o in s.params)m.set(o,s.params[o]);r.search=new URLSearchParams(m).toString();let l=n&&n.headers?n.headers:{};return i.headers={...u,...l,...s.headers},{url:r.pathname+r.search+r.hash,options:i}},getLatestFeeds:async(e,a,s={})=>{if(e==null)throw new p("page","Required parameter page was null or undefined when calling getLatestFeeds.");if(a==null)throw new p("perPage","Required parameter perPage was null or undefined when calling getLatestFeeds.");const t="/feeds/latest",r=new URL(t,"https://example.com");let n;c&&(n=c.baseOptions);const i={method:"GET",...n,...s},u={},h={};e!==void 0&&(h.page=e),a!==void 0&&(h.per_page=a);const m=new URLSearchParams(r.search);for(const o in h)m.set(o,h[o]);for(const o in s.params)m.set(o,s.params[o]);r.search=new URLSearchParams(m).toString();let l=n&&n.headers?n.headers:{};return i.headers={...u,...l,...s.headers},{url:r.pathname+r.search+r.hash,options:i}},likeFeed:async(e,a={})=>{if(e==null)throw new p("feedId","Required parameter feedId was null or undefined when calling likeFeed.");const s="/feeds/like/{feedId}".replace("{feedId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},likeFeedComment:async(e,a={})=>{if(e==null)throw new p("commentId","Required parameter commentId was null or undefined when calling likeFeedComment.");const s="/feeds/{commentId}/like".replace("{commentId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},unlikeFeed:async(e,a={})=>{if(e==null)throw new p("feedId","Required parameter feedId was null or undefined when calling unlikeFeed.");const s="/feeds/unlike/{feedId}".replace("{feedId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},unlikeFeedComment:async(e,a={})=>{if(e==null)throw new p("commentId","Required parameter commentId was null or undefined when calling unlikeFeedComment.");const s="/feeds/{commentId}/unlike".replace("{commentId}",encodeURIComponent(String(e))),t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={},h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}},updateFeedPost:async(e,a={})=>{const s="/feeds/update",t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"POST",...r,...a},i={},u={};i["Content-Type"]="application/json";const h=new URLSearchParams(t.search);for(const o in u)h.set(o,u[o]);for(const o in a.params)h.set(o,a.params[o]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};n.headers={...i,...m,...a.headers};const l=typeof e!="string"||n.headers["Content-Type"]==="application/json";return n.data=l?JSON.stringify(e!==void 0?e:{}):e||"",{url:t.pathname+t.search+t.hash,options:n}}}},F=function(c){return{async commentFeed(e,a){const s=await g(c).commentFeed(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async createFeed(e,a){const s=await g(c).createFeed(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async deleteFeed(e,a){const s=await g(c).deleteFeed(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async getFeedById(e,a){const s=await g(c).getFeedById(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async getFeedComments(e,a,s,t){const r=await g(c).getFeedComments(e,a,s,t);return(n=w,i=y)=>{const u={...r.options,url:i+r.url};return n.request(u)}},async getFeeds(e,a,s,t){const r=await g(c).getFeeds(e,a,s,t);return(n=w,i=y)=>{const u={...r.options,url:i+r.url};return n.request(u)}},async getFeedsByUserId(e,a,s,t){const r=await g(c).getFeedsByUserId(e,a,s,t);return(n=w,i=y)=>{const u={...r.options,url:i+r.url};return n.request(u)}},async getFollowingFeed(e,a,s){const t=await g(c).getFollowingFeed(e,a,s);return(r=w,n=y)=>{const i={...t.options,url:n+t.url};return r.request(i)}},async getLatestFeeds(e,a,s){const t=await g(c).getLatestFeeds(e,a,s);return(r=w,n=y)=>{const i={...t.options,url:n+t.url};return r.request(i)}},async likeFeed(e,a){const s=await g(c).likeFeed(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async likeFeedComment(e,a){const s=await g(c).likeFeedComment(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async unlikeFeed(e,a){const s=await g(c).unlikeFeed(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async unlikeFeedComment(e,a){const s=await g(c).unlikeFeedComment(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}},async updateFeedPost(e,a){const s=await g(c).updateFeedPost(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}}}};class R extends P{async commentFeed(e,a){return F(this.configuration).commentFeed(e,a).then(s=>s(this.axios,this.basePath))}async createFeed(e,a){return F(this.configuration).createFeed(e,a).then(s=>s(this.axios,this.basePath))}async deleteFeed(e,a){return F(this.configuration).deleteFeed(e,a).then(s=>s(this.axios,this.basePath))}async getFeedById(e,a){return F(this.configuration).getFeedById(e,a).then(s=>s(this.axios,this.basePath))}async getFeedComments(e,a,s,t){return F(this.configuration).getFeedComments(e,a,s,t).then(r=>r(this.axios,this.basePath))}async getFeeds(e,a,s,t){return F(this.configuration).getFeeds(e,a,s,t).then(r=>r(this.axios,this.basePath))}async getFeedsByUserId(e,a,s,t){return F(this.configuration).getFeedsByUserId(e,a,s,t).then(r=>r(this.axios,this.basePath))}async getFollowingFeed(e,a,s){return F(this.configuration).getFollowingFeed(e,a,s).then(t=>t(this.axios,this.basePath))}async getLatestFeeds(e,a,s){return F(this.configuration).getLatestFeeds(e,a,s).then(t=>t(this.axios,this.basePath))}async likeFeed(e,a){return F(this.configuration).likeFeed(e,a).then(s=>s(this.axios,this.basePath))}async likeFeedComment(e,a){return F(this.configuration).likeFeedComment(e,a).then(s=>s(this.axios,this.basePath))}async unlikeFeed(e,a){return F(this.configuration).unlikeFeed(e,a).then(s=>s(this.axios,this.basePath))}async unlikeFeedComment(e,a){return F(this.configuration).unlikeFeedComment(e,a).then(s=>s(this.axios,this.basePath))}async updateFeedPost(e,a){return F(this.configuration).updateFeedPost(e,a).then(s=>s(this.axios,this.basePath))}}const S=function(c){return{getSetting:async(e,a={})=>{if(e==null)throw new p("key","Required parameter key was null or undefined when calling getSetting.");const s="/settings",t=new URL(s,"https://example.com");let r;c&&(r=c.baseOptions);const n={method:"GET",...r,...a},i={},u={};e!==void 0&&(u.key=e);const h=new URLSearchParams(t.search);for(const l in u)h.set(l,u[l]);for(const l in a.params)h.set(l,a.params[l]);t.search=new URLSearchParams(h).toString();let m=r&&r.headers?r.headers:{};return n.headers={...i,...m,...a.headers},{url:t.pathname+t.search+t.hash,options:n}}}},q=function(c){return{async getSetting(e,a){const s=await S(c).getSetting(e,a);return(t=w,r=y)=>{const n={...s.options,url:r+s.url};return t.request(n)}}}};class U extends P{async getSetting(e,a){return q(this.configuration).getSetting(e,a).then(s=>s(this.axios,this.basePath))}}function x(c,e){return{getSetting:async s=>{const{data:t}=await new U(c).getSetting(s);return t.data.value}}}function k(c,e){return{postFeed:async o=>{try{const{data:d}=await new R(c).createFeed({text:o.text,visibility:o.visibility,who_can_reply:o.whoCanReply},e);return[d.success,d.data,null]}catch(d){return[null,null,d]}},shareArtworkToFeed:async o=>{try{const{data:d}=await new R(c).createFeed({text:o.text,visibility:o.visibility,who_can_reply:o.whoCanReply,work_id:o.workId},e);return[d.success,d.data,null]}catch(d){return[null,null,d]}},feedDetail:async o=>{try{const{data:d}=await new R(c).getFeedById(o.id,e);return[d.data,null]}catch(d){return[null,V().consumeReadableStreamError(d)]}},getChronologicalFeeds:async o=>{try{const{data:d}=await new R(c).getFeeds(o.pagination.perPage,o.pagination.page,o.explicitMode,e);return[d.data,null]}catch(d){return[null,d]}},getFeedByUserId:async o=>{try{const{data:d}=await new R(c).getFeedsByUserId(o.userId,o.pagination.page,o.pagination.perPage,e);return[d.data,null]}catch(d){return[null,d]}},like:async o=>{try{const{data:d}=await new R(c).likeFeed(o.feedId,e);return[d.success,null]}catch(d){return[null,d]}},unlike:async o=>{try{const{data:d}=await new R(c).unlikeFeed(o.feedId,e);return[d.success,null]}catch(d){return[null,d]}},fetchComments:async o=>{try{const{data:d,error:f}=await new R(c).getFeedComments(o.feedId,o.pagination.page,o.pagination.perPage,e);return[d.data,f]}catch(d){return[null,d]}},comment:async o=>{try{const{data:d}=await new R(c).commentFeed({feed_id:o.feedId,comment:o.comment},e);return[d.success,d.data,null]}catch(d){return[null,null,d]}},remove:async o=>{try{const{data:d}=await new R(c).deleteFeed(o,e);return[d.success,null]}catch(d){return[!1,d]}}}}export{k as a,x as u};
