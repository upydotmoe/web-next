import{a as _,j as p,l as u,aP as l,r as e,o,c as f,w as m,p as a,m as h,t as v,s as w}from"./entry.0330daa5.js";import{L as y}from"./Layout.95a54192.js";import{_ as k}from"./_plugin-vue_export-helper.a1a6add7.js";import"./useArtwork.3ef797ef.js";const x={class:"w-1/3 mx-auto rounded p-2 pt-4"},P={class:""},R={key:0,class:"text-base mb-2"},g={__name:"RecoverPassword",setup(A){const{$router:t}=_(),{iv:r,content:c}=t.currentRoute.value.params.path,{oApiConfiguration:n}=p();u(()=>{i()});const i=async()=>{try{const{data:s}=await new l(n).checkResetPasswordTokenValidity(r,c);s.valid||t.push("/")}catch{t.push("/")}};e(""),e(""),e(!1),e("");const d=e(!1);return(s,B)=>(o(),f(y,{"with-footer":!1,"hide-side":!0},{default:m(()=>[a("div",x,[a("div",P,[d.value?w("",!0):(o(),h("div",R,v(s.$t("accountRecovery.resetPassword")),1))])])]),_:1}))}},F=k(g,[["__scopeId","data-v-f7a80008"]]);export{F as default};
