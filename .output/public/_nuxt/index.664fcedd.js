import{r as a,a as w,c as h,w as _,o as g,b as i,v as n,u as t,e as p,f as v}from"./entry.ae51314b.js";import{L as y}from"./Layout.288d44a5.js";import{M as x}from"./ModalView.7fc791b0.js";import{_ as M}from"./LoadingEmptyErrorMessage.b2b53b6c.js";import"./ProBadge.de1f3ff6.js";import"./_plugin-vue_export-helper.a1a6add7.js";import"./useReport.9e4f9eb9.js";import"./WorkList.3a9e5f28.js";import"./Spinner.96f551a8.js";import"./user-counters-api.7503204d.js";import"./useSetting.f194dec2.js";import"./useFeed.607ee023.js";const R={__name:"index",setup(S){const m=s=>{v({title:s.title})},o=a(!0),u=()=>{o.value=!1},e=a(!1),c=()=>{e.value=!0},r=a(!1),l=()=>{r.value=!0},{$router:d}=w(),{id:f}=d.currentRoute.value.params;return(s,k)=>(g(),h(y,{"class-prop":"work-view","with-footer":!0,"hide-side":!0,"no-right-side":!0,"center-class":"mx-0 xl:mx-12"},{default:_(()=>[i(p(M,{loading:t(o),empty:t(r),emptyMessage:s.$t("artworks.notFound"),error:t(e)},null,8,["loading","empty","emptyMessage","error"]),[[n,t(o)||t(r)||t(e)]]),i(p(x,{id:t(f),onSetMeta:m,onStopLoading:u,onShowEmpty:l,onShowError:c},null,8,["id"]),[[n,!t(o)&&!t(r)&&!t(e)]])]),_:1}))}};export{R as default};
