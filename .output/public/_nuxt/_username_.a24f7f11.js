import{k as c,a as f,p as l,r as d,h as _,s as k,u as r,c as B,y as h,o as s}from"./entry.72e29a02.js";import{P as y}from"./Profile.64e49f5f.js";import{u as g}from"./useUser.49765324.js";import"./ProBadge.2656324d.js";import"./_plugin-vue_export-helper.c27b6911.js";import"./ModalView.941b9a74.js";import"./useReport.2eeb79b9.js";import"./index.7225a9bd.js";import"./MiniArtworkPreview.a55e273f.js";import"./WorkList.65c6b973.js";import"./LoadingEmptyErrorMessage.5882bbb2.js";import"./user-counters-api.4e7c75d1.js";import"./useSetting.5740e4e7.js";import"./useFeed.f58402cb.js";import"./Layout.a8963777.js";import"./FeedModalView.4f4dbe0d.js";import"./UserList.adc8a973.js";const j={__name:"[username]",setup(A){const{oApiConfiguration:a,fetchOptions:i}=c(),m=g(a,i()),n=f();l(()=>{u()});const{username:p}=n.params,t=d(0),u=async()=>{const[e,o]=await m.getInfoByUsername(p);o||(_({title:`(${e.username}) ${e.name}`}),t.value=e.id)};return(e,o)=>(s(),k("div",null,[r(t)?(s(),B(y,{key:0,id:r(t)},null,8,["id"])):h("",!0)]))}};export{j as default};
