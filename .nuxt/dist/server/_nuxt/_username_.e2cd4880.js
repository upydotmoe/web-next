import{d as p,l as u}from"../server.mjs";import{onBeforeMount as c,ref as f,openBlock as l,createBlock as d,createCommentVNode as _}from"vue";import"vue-router";import{P as B}from"./Profile.b5d9458a.js";import{u as g}from"./useUser.862db740.js";import"#internal/nitro";import"./ModalView.41775872.js";import"./Icon.5632132b.js";import"./ErrorMessages.97722363.js";import"./Spinner.fd341f0e.js";import"./user-counters-api.73622598.js";import"./useFeed.a900e841.js";import"./Layout.2e6c6b83.js";import"./FeedModalView.aaf474eb.js";const R={__name:"[username]",setup(h){const{oApiConfiguration:t,fetchOptions:s}=p(),i=g(t,s()),m=u();c(()=>{n()});const{username:a}=m.params,e=f(0),n=async()=>{const[o,r]=await i.getInfoByUsername(a);r||(e.value=o.id)};return(o,r)=>e.value?(l(),d(B,{key:0,id:e.value},null,8,["id"])):_("",!0)}};export{R as default};
//# sourceMappingURL=_username_.e2cd4880.js.map
