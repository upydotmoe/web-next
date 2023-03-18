import{M as B,a as E,m as T,k as q,E as x,r as a,c as A,w as C,o as i,b as o,u as t,s as m,x as d,y as w,e as f,v as D,P as I,Z as R,O as P}from"./entry.72e29a02.js";import{L,u as U}from"./Layout.a8963777.js";import{u as O}from"./useUser.49765324.js";import{_ as F}from"./_plugin-vue_export-helper.c27b6911.js";import"./ProBadge.2656324d.js";import"./user-counters-api.4e7c75d1.js";const Z={class:"p-2 pt-4 mx-auto w-1/3 rounded"},j={class:""},z={key:0,class:"mb-2 text-base"},G={key:1,class:"p-2 mb-2 w-full text-white bg-red-500 rounded-md"},H={key:2,class:"p-2 mb-2 w-full text-white bg-green-500 rounded-md"},J=["name"],K=["placeholder"],Q=["name"],W=["placeholder"],X={type:"submit",class:"float-right mt-2 primary-button"},Y={__name:"RecoverPassword",setup(ee){const{t:k}=B(),g=E(),v=T(),{iv:h,content:_}=g.params,{oApiConfiguration:$,fetchOptions:N}=q(),y=O($,N());x(()=>{S()});const S=async()=>{const[e,s]=await y.checkResetPasswordTokenValidity({iv:h,content:_});s?v.push({path:"/"}):e.valid||v.push({path:"/"})},u="password-reset-form",r=a(""),l=a(""),p=a(!1),b=a(""),n=a(!1),V=async()=>{U().validate(u,k),n.value=!1,p.value=!1;const[e,s]=await y.resetPassword({iv:h,content:_,newPassword:r.value});s?M(s):n.value=!0},M=e=>{p.value=!0,b.value=e};return(e,s)=>(i(),A(L,{"with-footer":!1,"hide-side":!0,"no-right-side":!0},{default:C(()=>[o("div",Z,[o("div",j,[t(n)?w("",!0):(i(),m("div",z,d(e.$t("accountRecovery.resetPassword")),1)),t(p)?(i(),m("div",G,d(t(b)),1)):w("",!0),t(n)?(i(),m("div",H,d(e.$t("accountRecovery.accountRecovered")),1)):w("",!0),f(o("form",{id:u,onSubmit:s[2]||(s[2]=I(c=>V(u),["prevent"]))},[o("n-validate",{for:"password",name:e.$t("accountRecovery.form.newPassword")},[f(o("input",{"onUpdate:modelValue":s[0]||(s[0]=c=>R(r)?r.value=c:null),type:"password",rules:"required|min:6|containSymbol|containNumber",class:"form-input",placeholder:e.$t("accountRecovery.form.newPassword")},null,8,K),[[P,t(r)]])],8,J),o("n-validate",{for:"retype-password",name:e.$t("accountRecovery.form.retypeNewPassword")},[f(o("input",{"onUpdate:modelValue":s[1]||(s[1]=c=>R(l)?l.value=c:null),type:"password",rules:"required|min:6|containSymbol|containNumber|equalTo:password",class:"form-input",placeholder:e.$t("accountRecovery.form.retypeNewPassword")},null,8,W),[[P,t(l)]])],8,Q),o("button",X,d(e.$t("reset")),1)],544),[[D,!e.showRecoveryLinkSentDialog]])])])]),_:1}))}},ce=F(Y,[["__scopeId","data-v-8f1c5751"]]);export{ce as default};