import{k as m,L as p,M as h,D as g,E as v,r as _,c as A,w as y,o as k,b as o,x as a,u as w,t as x}from"./entry.013e3180.js";import{L as V}from"./Layout.8a0d535a.js";import"./ProBadge.621315e3.js";import"./_plugin-vue_export-helper.c27b6911.js";const $={class:"mx-auto text-center"},B={class:"mb-4"},C={class:"font-medium cursor-pointer link-color hover:underline"},L={href:"/"},R={__name:"AccountVerification",setup(M){const{oApiConfiguration:i,fetchOptions:c}=m(),u=p(i,c()),{t:r}=h(),{$router:l}=g();v(()=>{d()});const t=_(""),d=async()=>{const{iv:e,content:s}=l.currentRoute.value.params,[f,n]=await u.verifyEmailAddress({iv:e,content:s});n?n.message==="Request failed with status code 409"?t.value=r("registration.form.registered.accountAlreadyVerified"):t.value=r("errors.somethingWentWrong"):t.value=r("registration.form.registered.accountSuccessfullyVerified")};return(e,s)=>(k(),A(V,{"with-footer":!1},{default:y(()=>[o("div",$,[o("div",B,a(w(t)),1),o("span",C,[o("a",L,a(e.$t("goToHome")),1)]),x(" or "),o("span",{class:"font-medium cursor-pointer link-color hover:underline",onClick:s[0]||(s[0]=f=>e.openModal("auth-modal"))},a(e.$t("logins.login")),1)])]),_:1}))}};export{R as default};