import{k as _,l as h,m as v,E as B,r as b,N as k,c as m,w as y,o as c,b as l,K as w,u as n,x as p,s as A,Y as x,X as C,b2 as T,t as E,z as M}from"./entry.05f698ef.js";import{A as S}from"./ProBadge.0148f2b1.js";import{L as z}from"./Layout.896833a6.js";import"./_plugin-vue_export-helper.c27b6911.js";function L(g,d){return{getAllTags:async u=>{var t,i;try{const{data:e}=await new S(g).getAllTags(typeof u.orderBy<"u"?u.orderBy:void 0,d);return[(t=e.data)==null?void 0:t.count,(i=e.data)==null?void 0:i.tags,null]}catch(e){return[null,null,_().consumeReadableStreamError(e)]}}}}const N={class:"flex flex-row gap-2 justify-center mb-4 w-full"},R={__name:"index",setup(g){h();const{oApiConfiguration:d,fetchOptions:f}=_(),u=L(d,f());v(),B(()=>{i()});const t=b({total:0,data:[],options:{data:{orderBy:void 0},isError:!1}}),i=async()=>{const[r,o,a]=await u.getAllTags({orderBy:t.value.options.data.orderBy});a?t.value.options.isError=!0:(t.value.total=r,t.value.data=o)};k(()=>t.value.options.data.orderBy,()=>{e()});const e=()=>{t.value.options.data.orderBy=="count"?t.value.data=t.value.data.sort((o,a)=>a._count.artwork_has_tags-o._count.artwork_has_tags):t.value.data=t.value.data.sort((o,a)=>o.tag>a.tag?1:a.tag>o.tag?-1:0)};return(r,o)=>{const a=M;return c(),m(z,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:y(()=>[l("div",N,[l("button",{class:w(n(t).options.data.orderBy==null?"primary-button":"light-button"),onClick:o[0]||(o[0]=s=>n(t).options.data.orderBy=void 0)}," A-Z ",2),l("button",{class:w(n(t).options.data.orderBy=="count"?"primary-button":"light-button"),onClick:o[1]||(o[1]=s=>n(t).options.data.orderBy="count")},p(r.$t("tags.artworkCount")),3)]),l("div",{class:"grid grid-flow-col gap-3 mx-2",style:T(["grid-template-rows: repeat("+Math.round(n(t).total/(r.isMobile()?r.isMobileDevice()?1:2:4))+", minmax(0, 1fr))"])},[(c(!0),A(C,null,x(n(t).data,s=>(c(),m(a,{key:s.id,to:"/artworks/browse?tags="+s.tag.replaceAll(" ","+"),class:"flex flex-row justify-between p-2 w-full rounded-md cursor-pointer button-light hover:theme-colored hover:font-bold"},{default:y(()=>[E(p(s.tag)+" ",1),l("b",null,p(s._count.artwork_has_tags),1)]),_:2},1032,["to"]))),128))],4)]),_:1})}}};export{R as default};
