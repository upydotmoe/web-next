import{ref as t,openBlock as d,createBlock as v,withCtx as f,withDirectives as s,createVNode as u,vShow as i,unref as h}from"vue";import{u as w}from"../server.mjs";import{L as _}from"./Layout.2ddecdfc.js";import{M as g}from"./ModalView.fc4ee83d.js";import{_ as y}from"./LoadingEmptyErrorMessage.4c6a7625.js";import"#internal/nitro";import"vue-router";import"./Icon.87522030.js";import"./Spinner.1b9fad4a.js";import"./user-counters-api.b01a31ff.js";import"./useFeed.b8b7dd2b.js";const D={__name:"[id]",setup(M){const e=t(!0),l=()=>{e.value=!1},o=t(!1),n=()=>{o.value=!0},r=t(!1),p=()=>{r.value=!0},{$router:m}=w(),{id:c}=m.currentRoute.value.params;return(a,k)=>(d(),v(_,{"class-prop":"work-view","hide-side":!!(a.isMobile()||e.value||o.value||r.value),"no-right-side":!0,"with-footer":!0},{default:f(()=>[s(u(y,{loading:e.value,empty:r.value,emptyMessage:a.$t("artworks.notFound"),error:o.value},null,8,["loading","empty","emptyMessage","error"]),[[i,e.value||r.value||o.value]]),s(u(g,{id:h(c),onStopLoading:l,onShowEmpty:p,onShowError:n},null,8,["id"]),[[i,!e.value&&!r.value&&!o.value]])]),_:1},8,["hide-side"]))}};export{D as default};
//# sourceMappingURL=_id_.fef166f4.js.map