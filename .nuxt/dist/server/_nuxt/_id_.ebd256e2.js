import{u as n}from"../server.mjs";import{ref as o,openBlock as c,createBlock as d,withCtx as f,withDirectives as t,createVNode as a,vShow as s,unref as v}from"vue";import"vue-router";import{L as h}from"./Layout.d005bae5.js";import{F as w}from"./FeedModalView.c2dcd582.js";import{_}from"./LoadingEmptyErrorMessage.f946504b.js";import"#internal/nitro";import"./Icon.4343fb38.js";import"./useFeed.0767367d.js";import"./Spinner.9a28c320.js";import"./ModalView.4d7a244d.js";import"./user-counters-api.40fb2995.js";const C={__name:"[id]",setup(y){const{$router:u}=n(),{id:i}=u.currentRoute.value.params,e=o(!1),p=()=>{e.value=!0},r=o(!1),m=()=>{r.value=!0};return(l,g)=>(c(),d(h,{"class-prop":"work-view","hide-side":!(!r.value&&!e.value),"no-right-side":!(!r.value&&!e.value),"with-footer":!0},{default:f(()=>[t(a(_,{empty:r.value,emptyMessage:l.$t("feeds.notFound"),error:e.value},null,8,["empty","emptyMessage","error"]),[[s,r.value||e.value]]),t(a(w,{id:v(i),onShowEmpty:m,onShowError:p},null,8,["id"]),[[s,!r.value&&!e.value]])]),_:1},8,["hide-side","no-right-side"]))}};export{C as default};
//# sourceMappingURL=_id_.ebd256e2.js.map
