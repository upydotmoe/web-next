import{d as u,k as c}from"../server.mjs";import{onBeforeMount as l,ref as f,openBlock as r,createElementBlock as d,createBlock as _,createCommentVNode as k}from"vue";import{P as B}from"./Profile.fc674d34.js";import{u as v}from"./useUser.15d84743.js";import"#internal/nitro";import"vue-router";import"./ModalView.fc4ee83d.js";import"./Icon.87522030.js";import"./LoadingEmptyErrorMessage.4c6a7625.js";import"./Spinner.1b9fad4a.js";import"./user-counters-api.b01a31ff.js";import"./useFeed.b8b7dd2b.js";import"./Layout.2ddecdfc.js";import"./FeedModalView.7fc0d1ba.js";const R={__name:"[username]",setup(g){const{oApiConfiguration:s,fetchOptions:i}=u(),m=v(s,i()),n=c();l(()=>{p()});const{username:a}=n.params,e=f(0),p=async()=>{const[o,t]=await m.getInfoByUsername(a);t||(e.value=o.id)};return(o,t)=>(r(),d("div",null,[e.value?(r(),_(B,{key:0,id:e.value},null,8,["id"])):k("",!0)]))}};export{R as default};
//# sourceMappingURL=_username_.25d132b7.js.map