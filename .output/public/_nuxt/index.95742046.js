import{l as L,k as C,E as B,r as p,o as a,s as l,f as n,u as o,b as r,X as N,Y as I,c as b,w as v,x as c,y as T,K as h,U as M,e as V,v as j,z,t as D}from"./entry.f698ef67.js";import{L as P}from"./Layout.32c58cd2.js";import{d as S}from"./ProBadge.21eeb69b.js";import{u as K}from"./useArtTrade.6d42392c.js";import{_ as O}from"./LoadingEmptyErrorMessage.eaa8868b.js";import{_ as y}from"./_plugin-vue_export-helper.c27b6911.js";const U={class:"mt-4"},X={class:"grid grid-cols-1 gap-2 mb-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4"},Y={class:"overflow-hidden relative col-span-5 rounded-md"},q={key:0,class:"absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"},G={class:"overflow-hidden relative col-span-5 rounded-md"},H={key:0,class:"absolute top-1/2 left-1/2 z-10 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"},J={__name:"LatestTrades",setup(_){const i=L(),{oApiConfiguration:d,fetchOptions:x}=C(),m=K(d,x());B(()=>{E()});const w=p([]),t=p({loading:!0,isError:!1,isEmpty:!1,pagination:{page:0,perPage:16}}),E=async()=>{await k(!0)},k=async(s=!1)=>{t.value.loading=!0,t.value.isEmpty=!1,t.value.isError=!1,s&&(t.value.pagination.page=0);const[g,u,f]=await m.getLatestTrades({pagination:{page:t.value.pagination.page,perPage:t.value.pagination.perPage}});if(f)t.value.isError=!0;else{u.record_total||(t.value.isEmpty=!0);for(let e=0;e<g.length;e++)w.value.push(g[e]);$.value=u.next_previous.next_page!==null}t.value.loading=!1},F=p(!1),$=p(!0),A=()=>{t.value.pagination.page+=1,k()};return(s,g)=>{const u=S,f=z;return a(),l("div",U,[n(O,{loading:o(t).loading,empty:o(t).isEmpty,"empty-message":"No art trade yet, be the first one to host your art trade.",error:o(t).isError,fetch:E},null,8,["loading","empty","empty-message","error"]),r("div",X,[(a(!0),l(N,null,I(o(w),e=>(a(),b(f,{key:e.id,to:"/art-trade/view/"+e.id,class:"grid grid-cols-11 gap-2 p-2 rounded-md theme-color hover:shadow-lg trade-item"},{default:v(()=>[r("div",Y,[s.applyExplicitFilter(o(i),e.host.submission.is_explicit,e.host.submission.is_gore)?(a(),l("span",q,c(e.host.submission.is_gore?s.$t("goreContent"):s.$t("explicitContent")),1)):T("",!0),n(u,{preload:"",loading:"lazy",src:s.artworkThumb(e.host.submission.bucket,e.host.submission.filename,"thumbnail",!1),class:h(["object-cover unselectable rounded-md w-full h-full",{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(o(i),e.host.submission.is_explicit,e.host.submission.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])]),n(M,{name:"i-ant-design-swap-outlined",class:"my-auto mx-auto"}),r("div",G,[s.applyExplicitFilter(o(i),e.participant.submission.is_explicit,e.participant.submission.is_gore)?(a(),l("span",H,c(e.participant.submission.is_gore?s.$t("goreContent"):s.$t("explicitContent")),1)):T("",!0),n(u,{preload:"",loading:"lazy",src:s.artworkThumb(e.participant.submission.bucket,e.participant.submission.filename,"thumbnail",!1),class:h(["object-cover unselectable rounded-md w-full h-full",{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(o(i),e.participant.submission.is_explicit,e.participant.submission.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])])]),_:2},1032,["to"]))),128))]),V(r("div",{class:h(["w-full primary-button",o(F)?"animate-pulse":""]),onClick:A},c(s.$t("loadMore")),3),[[j,o($)]])])}}},Q=y(J,[["__scopeId","data-v-65b14925"]]),R={},W={class:"p-4 w-full text-center rounded-md theme-color-secondary"};function Z(_,i){return a(),l("div",W,c(_.$t("search.loginMessage")),1)}const ee=y(R,[["render",Z]]);const se={class:"px-2"},te={key:1},oe={class:"flex flex-row justify-between"},ae={class:"mt-2 title"},ie={__name:"index",setup(_){const i=L();return C(),(d,x)=>{const m=z;return a(),b(P,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:v(()=>[r("div",se,[o(i).loggedIn?(a(),l("div",te,[r("div",oe,[r("h2",ae,c(d.$t("artTrades.artTrade")),1),n(m,{to:"/art-trade/host",class:"flex flex-row primary-button"},{default:v(()=>[n(M,{name:"i-ion-add"}),D(" "+c(d.$t("artTrades.host")),1)]),_:1})]),n(Q)])):(a(),b(ee,{key:0}))])]),_:1})}}},pe=y(ie,[["__scopeId","data-v-65877df5"]]);export{pe as default};
