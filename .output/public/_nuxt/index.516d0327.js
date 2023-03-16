import{l as C,k as E,bX as O,m as V,p as N,r as n,E as M,c as F,w as H,o as c,b as e,u as l,s as p,f,U as _,t as o,x as h,y as A,V as j,W}from"./entry.9b47bf02.js";import{u as z}from"./useSetting.e24e5866.js";import{L as D}from"./Layout.849d2842.js";import{_ as G}from"./_plugin-vue_export-helper.c27b6911.js";import"./ProBadge.8f38c304.js";const $=""+globalThis.__publicAssetsURL("pro/upload-multiple-images.png"),J=""+globalThis.__publicAssetsURL("pro/private-collection.png"),Y=""+globalThis.__publicAssetsURL("pro/unlimited-collections.png"),X=""+globalThis.__publicAssetsURL("pro/unlimited-collection-items.png"),y=""+globalThis.__publicAssetsURL("pro/private-album.png"),q=""+globalThis.__publicAssetsURL("pro/follow-privately.png"),K=""+globalThis.__publicAssetsURL("pro/hide-followings.png"),Q=""+globalThis.__publicAssetsURL("pro/hide-followers.png"),Z=""+globalThis.__publicAssetsURL("pro/list-all-my-liked-arts.png");const v=u=>(j("data-v-c2792319"),u=u(),W(),u),ee={class:"flex flex-col gap-16 px-2"},te={class:"flex flex-col p-10 w-full text-xl text-center rounded-md theme-color"},oe={key:0,class:"text-xl font-bold"},se={class:"flex flex-row gap-2 justify-center text-fuchsia-500"},le={class:"mt-2 text-sm font-normal"},ae={class:"flex flex-row gap-2 justify-center mt-8 text-sm italic font-normal"},ie={key:1},re={class:"mb-6 font-bold"},ne=v(()=>e("a",{href:"#pay",class:"p-3 mx-auto w-2/5 text-base font-bold text-white rounded-md button-color hover:shadow-lg"}," GET PRO VERSION ",-1)),ce={class:"flex flex-row justify-center mb-4 text-lg italic text-center"},ue=v(()=>e("span",{class:"mt-1"},"What features will you get?",-1)),de=v(()=>e("div",{class:"features-grid"},[e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:$}),e("div",null,[e("h1",null,"More Image in One Post"),o(" Break the limit and upload bigger image and more images in one post. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:J}),e("div",null,[e("h1",null,"Private Collection"),o(' Hide your "secret" ( ͡º ͜ʖ ͡º) collections from public so no one can see the artworks you saved inside but yourself. ')])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:Y}),e("div",null,[e("h1",null,"Unlimited Collection"),o(" Break the limit and create as many collections as you want. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:X}),e("div",null,[e("h1",null,"Unlimited Collection Items"),o(" Break the limit and add as many artworks you want to your collections. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:y}),e("div",null,[e("h1",null,"Private Album"),o(" Create a private album and add your work to it. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:y}),e("div",null,[e("h1",null,"Unlimited Albums"),o(" Break the limit and create as many albums as you want. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:y}),e("div",null,[e("h1",null,"Unlimited Album Items"),o(" Break the limit and add as many artworks as you want to your albums. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:q}),e("div",null,[e("h1",null,"Follow Someone Privately"),o(" Follow people privately and hide them from the following list, so no one knows you're following them. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:K}),e("div",null,[e("h1",null,"Hide Who You Follow"),o(" Hide who you follow so your friends, your family or anyone else doesn't know whoever you follow. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:Q}),e("div",null,[e("h1",null,"Hide Who Following You"),o(" Hide your followers from the public so no one knows who follows you. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:Z}),e("div",null,[e("h1",null,"List All My Liked Artworks"),o(" Break the limit and see more of the art you loved in the past. ")])])],-1)),pe={key:0,id:"pay",class:"p-10 w-full text-center rounded-md theme-color"},me={class:"mb-4 text-lg font-bold"},fe={key:0,id:"smart-button-container",class:"mx-auto w-4/6"},_e={style:{"text-align":"center"}},he={__name:"index",setup(u){const x=C(),{oApiConfiguration:g,fetchOptions:w}=E(),b=O(g,w()),k=z(g,w()),R=V();N(async()=>{x.loggedIn||route.push({path:"/explore",force:!0,replace:!0}),await U(),await S()});const d=n(!1),U=async()=>{const[t,s]=await k.getSetting("is_payment_active");s?d.value=!1:d.value=t==1},a=n(!1),m=n(""),S=async()=>{const[t,s]=await b.checkSubscriptionStatus();s?a.value=!1:t.is_pro?(a.value=!0,m.value=t.until):a.value=!1};M(async()=>{const t=document.createElement("script");{const[s,r]=await k.getSetting("paypal_client_id");r?d.value=!1:t.src=s}t.addEventListener("load",T),document.body.appendChild(t)});const i=n("2.50"),L=n("paypalRef"),T=()=>{window.paypal.Buttons({style:{shape:"rect",color:"blue",layout:"vertical",label:"paypal"},createOrder:function(t,s){return s.order.create({purchase_units:[{description:"Upy 1 Month (Sandbox)",amount:{currency_code:"USD",value:i.value}}]})},onApprove:async function(t,s){return await s.order.capture().then(async function(r){if(r.purchase_units[0].payee.merchant_id==="NUTUV969GELDJ"&&r.purchase_units[0].amount.value==i.value){const[P,B,I]=await b.registerProVersion({paymentType:"paypal",amount:i.value,orderData:JSON.stringify(r)});P?(a.value=!0,m.value=B.until,window.scrollTo(0,0),isMobile()&&R.push({path:"/pro",replace:!0,force:!0})):console.error("something went wrong!",I)}})},onError:function(t){console.log("paypal error:",t)}}).render(document.getElementById("paypalRef"))};return(t,s)=>(c(),F(D,{"with-footer":!0},{default:H(()=>[e("div",ee,[e("div",te,[l(a)?(c(),p("div",oe,[e("p",se,[f(_,{name:"i-fluent-star-emphasis-24-regular","text-size":"text-3xl",class:"text-fuchsia-500"}),o(" PRO version active ")]),e("p",le," Expires on/by "+h(t.formatDate(l(m),!1,!1)),1),e("p",ae,[o(" Thank you for your support, much love "),f(_,{name:"i-noto-heart-hands","text-size":"text-2xl",class:"text-red-500"})])])):(c(),p("div",ie,[e("p",re," Unlock all features for only $"+h(l(i))+" a month with PRO version ",1),ne]))]),e("div",null,[e("div",ce,[f(_,{class:"mr-2",name:"i-twemoji-thinking-face","text-size":"text-4xl"}),ue]),de,!l(a)&&l(d)?(c(),p("div",pe,[e("div",me," Get PRO version for only $"+h(l(i))+"/month ",1),l(x).loggedIn?(c(),p("div",fe,[e("div",_e,[e("div",{id:"paypalRef",ref_key:"paypalRef",ref:L},null,512)])])):A("",!0)])):A("",!0)])])]),_:1}))}},be=G(he,[["__scopeId","data-v-c2792319"]]);export{be as default};
