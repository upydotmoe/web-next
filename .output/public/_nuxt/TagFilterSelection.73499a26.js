import{_}from"./ProBadge.de1f3ff6.js";import{I as k,r as i,a1 as w,o as d,p as C,q as a,t as r,e as b,w as $,c as T,u as s,T as V,av as c}from"./entry.ae51314b.js";const B={class:"w-full modal-layer xl:w-3/12 lg:w-2/5"},U={class:"mb-2 text-sm"},x={class:"input-block"},R={class:"flex float-right flex-row gap-2 mt-4"},j={__name:"TagFilterSelection",emits:["apply"],setup(S,{expose:m,emit:v}){const g=k().public.apiUrl,u=i(1),l=i([]),p=e=>{l.value=e,u.value++},n=i([]),h=()=>{n.value=l.value,l.value=[];const e=[];c(n.value).forEach(t=>{e.push(t.value)}),v("apply",c(n.value),e.join(","))};return m({init:p}),(e,t)=>{const y=w("tags-input"),f=_;return d(),C("div",null,[a("div",{class:"hidden",onClick:t[0]||(t[0]=o=>p())}),a("div",B,[a("div",null,[a("h1",U,r(e.$t("pickUpToTags")),1),a("div",x,[b(f,null,{default:$(()=>[(d(),T(y,{modelValue:s(l),"onUpdate:modelValue":t[1]||(t[1]=o=>V(l)?l.value=o:null),key:s(u),placeholder:e.$t("tagsInputPlaceholder"),typeahead:!0,limit:10,"hide-input-on-limit":!0,"typeahead-style":"dropdown","typeahead-activation-threshold":3,"typeahead-show-on-focus":!0,"typeahead-hide-discard":!0,"typeahead-url":s(g)+"/artworks/tags/search?keyword=:search","add-tags-on-comma":!0,"initial-value":s(l)},null,8,["modelValue","placeholder","typeahead-url","initial-value"]))]),_:1})]),a("div",R,[a("button",{class:"cancel-button",onClick:t[2]||(t[2]=o=>e.closeModal("tag-filter-selection-modal"))},r(e.$t("cancel")),1),a("button",{class:"primary-button",onClick:t[3]||(t[3]=o=>h())},r(e.$t("apply")),1)])])])])}}};export{j as _};
