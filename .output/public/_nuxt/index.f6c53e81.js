import{j as _,k as v,l as b,Y as k,m as A,r as x,E as C,c as y,w as m,o as c,q as n,u as s,K as w,t as p,p as T,Q as E,P as M,aB as S,s as j,y as L}from"./entry.ae51314b.js";import{A as $}from"./ProBadge.de1f3ff6.js";import{L as z}from"./Layout.288d44a5.js";import"./_plugin-vue_export-helper.a1a6add7.js";function D(g,d){return{getAllTags:async l=>{var u,i;try{const{data:t}=await new $(g).getAllTags(typeof l.orderBy<"u"?l.orderBy:void 0,d);return[(u=t.data)==null?void 0:u.count,(i=t.data)==null?void 0:i.tags,null]}catch(t){return[null,null,_().consumeReadableStreamError(t)]}}}}const F={class:"flex flex-row gap-2 justify-center mb-4 w-full"},I={__name:"index",setup(g){const d=v(),{oApiConfiguration:f,fetchOptions:l}=_(),u=D(f,l()),i=b();k(()=>{d.loggedIn||i.push("/")}),A(()=>{h()});const t=x({total:0,data:[],options:{data:{orderBy:void 0},isError:!1}}),h=async()=>{const[a,o,e]=await u.getAllTags({orderBy:t.value.options.data.orderBy});e?t.value.options.isError=!0:(t.value.total=a,t.value.data=o)};C(()=>t.value.options.data.orderBy,()=>{B()});const B=()=>{t.value.options.data.orderBy=="count"?t.value.data=t.value.data.sort((o,e)=>e._count.artwork_has_tags-o._count.artwork_has_tags):t.value.data=t.value.data.sort((o,e)=>o.tag>e.tag?1:e.tag>o.tag?-1:0)};return(a,o)=>{const e=L;return c(),y(z,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:m(()=>[n("div",F,[n("button",{onClick:o[0]||(o[0]=r=>s(t).options.data.orderBy=void 0),class:w(s(t).options.data.orderBy==null?"primary-button":"light-button")}," A-Z ",2),n("button",{onClick:o[1]||(o[1]=r=>s(t).options.data.orderBy="count"),class:w(s(t).options.data.orderBy=="count"?"primary-button":"light-button")},p(a.$t("tags.artworkCount")),3)]),n("div",{class:"grid grid-flow-col gap-3",style:S(["grid-template-rows: repeat("+Math.round(s(t).total/(a.isMobile()?a.isMobileDevice()?1:2:4))+", minmax(0, 1fr))"])},[(c(!0),T(M,null,E(s(t).data,r=>(c(),y(e,{key:r.id,to:"/works/browse?tags="+r.tag.replaceAll(" ","+"),class:"flex flex-row justify-between p-2 w-full rounded-md cursor-pointer button-light hover:theme-colored hover:font-bold"},{default:m(()=>[j(p(r.tag)+" ",1),n("b",null,p(r._count.artwork_has_tags),1)]),_:2},1032,["to"]))),128))],4)]),_:1})}}};export{I as default};
