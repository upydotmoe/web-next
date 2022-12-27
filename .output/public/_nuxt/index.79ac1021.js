import{k as P,j as B,bU as C,Y as E,r as n,m as O,c as I,w as N,o as c,q as e,u as a,p,e as f,L as _,s as o,t as h,x as V,M as j,N as M}from"./entry.ed1bfc63.js";import{u as D}from"./useSetting.56e2c71f.js";import{L as F}from"./Layout.c894869a.js";import{_ as H}from"./_plugin-vue_export-helper.a1a6add7.js";import"./ProBadge.dc1cf83d.js";const G=""+globalThis.__publicAssetsURL("pro/upload-multiple-images.png"),q=""+globalThis.__publicAssetsURL("pro/private-collection.png"),z=""+globalThis.__publicAssetsURL("pro/unlimited-collections.png"),J=""+globalThis.__publicAssetsURL("pro/unlimited-collection-items.png"),y=""+globalThis.__publicAssetsURL("pro/private-album.png"),W=""+globalThis.__publicAssetsURL("pro/follow-privately.png"),Y=""+globalThis.__publicAssetsURL("pro/hide-followings.png"),$=""+globalThis.__publicAssetsURL("pro/hide-followers.png"),Z=""+globalThis.__publicAssetsURL("pro/list-all-my-liked-arts.png");const v=r=>(j("data-v-caa841fc"),r=r(),M(),r),Q={class:"flex flex-col gap-20"},X={class:"flex flex-col p-10 w-full text-xl text-center rounded-md theme-color"},K={key:0,class:"text-xl font-bold"},ee={class:"flex flex-row gap-2 justify-center text-yellow-400"},te={class:"mt-2 text-sm font-normal"},oe={class:"flex flex-row gap-2 justify-center mt-8 text-sm italic font-normal"},se={key:1},le={class:"mb-6 font-bold"},ae=v(()=>e("a",{href:"#pay",class:"p-3 mx-auto w-2/5 text-base font-bold text-white rounded-md button-color hover:shadow-lg"}," GET PRO VERSION ",-1)),ie={class:"flex flex-row justify-center text-lg italic text-center"},ne=v(()=>e("span",{class:"mt-1"},"What features will be unlocked?",-1)),re=v(()=>e("div",{class:"features-grid"},[e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:G}),e("div",null,[e("h1",null,"More Image in One Post"),o(" Break the limit and upload more images at once. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:q}),e("div",null,[e("h1",null,"Private Collection"),o(' Hide your "secret" ( \u0361\xBA \u035C\u0296 \u0361\xBA) collections from public so no one can see the artworks you saved inside but yourself. ')])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:z}),e("div",null,[e("h1",null,"Unlimited Collection"),o(" Break the limit and create as many collections as you want. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:J}),e("div",null,[e("h1",null,"Unlimited Collection Items"),o(" Break the limit and add as many artworks you want to your collections. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:y}),e("div",null,[e("h1",null,"Private Album"),o(" Create a private album and add your work to it. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:y}),e("div",null,[e("h1",null,"Unlimited Albums"),o(" Break the limit and create as many albums as you want. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:y}),e("div",null,[e("h1",null,"Unlimited Album Items"),o(" Break the limit and add as many artworks as you want to your albums. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:W}),e("div",null,[e("h1",null,"Follow Someone Privately"),o(" Follow people privately and hide them from the following list, so no one knows you're following them. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:Y}),e("div",null,[e("h1",null,"Hide Who You Follow"),o(" Hide who you follow so your friends, your family or anyone else doesn't know whoever you follow. ")])]),e("div",{class:"flex-col feature md:flex-row"},[e("img",{src:$}),e("div",null,[e("h1",null,"Hide Who Following You"),o(" Hide your followers from the public so no one knows who follows you. ")])]),e("div",{class:"flex-col feature md:flex-row-reverse"},[e("img",{src:Z}),e("div",null,[e("h1",null,"List All My Liked Artworks"),o(" Break the limit and see more of the art you loved in the past. ")])]),e("div",{class:"text-base italic font-bold text-center"}," and many more features to come.. ")],-1)),ce={key:0,id:"pay",class:"p-10 w-full text-center rounded-md theme-color"},ue={class:"mb-4 text-lg font-bold"},de={id:"smart-button-container",class:"mx-auto w-4/6"},me={style:{"te3h-36-align":"center"}},pe={__name:"index",setup(r){P();const{oApiConfiguration:w,fetchOptions:x}=B(),g=C(w,x()),b=D(w,x());E(async()=>{await k(),await A()});const u=n(!1),k=async()=>{const[t,s]=await b.getSetting("is_payment_active");s?u.value=!1:u.value=t==1},l=n(!1),d=n(""),A=async()=>{const[t,s]=await g.checkSubscriptionStatus();s?l.value=!1:t.is_pro?(l.value=!0,d.value=t.until):l.value=!1};O(()=>{const t=document.createElement("script");t.src="https://www.paypal.com/sdk/js?client-id=AbFZEy35RTD5A3oCINCJ0m6gfaofU2B95o8gOMRq7ry8C58Uw9hfVNEeVejkXLDjqHOt0ueQ_GoswZei&enable-funding=venmo&currency=USD",t.addEventListener("load",R),document.body.appendChild(t)});const i=n("2.99"),U=n("paypalRef"),R=()=>{window.paypal.Buttons({style:{shape:"rect",color:"blue",layout:"vertical",label:"paypal"},createOrder:function(t,s){return s.order.create({purchase_units:[{description:"Upy 1 Month (Sandbox)",amount:{currency_code:"USD",value:i.value}}]})},onApprove:async function(t,s){return await s.order.capture().then(async function(m){if(m.purchase_units[0].payee.merchant_id==="NUTUV969GELDJ"&&m.purchase_units[0].amount.value==i.value){const[S,L,T]=await g.registerProVersion({paymentType:"paypal",amount:i.value,orderData:JSON.stringify(m)});S?(l.value=!0,d.value=L.until,window.scrollTo(0,0)):console.error("something went wrong!",T)}})},onError:function(t){console.log("paypal error:",t)}}).render(document.getElementById("paypalRef"))};return(t,s)=>(c(),I(F,{"with-footer":!0},{default:N(()=>[e("div",Q,[e("div",X,[a(l)?(c(),p("div",K,[e("p",ee,[f(_,{name:"i-fluent-star-emphasis-24-regular","text-size":"text-3xl",class:"text-yellow-400"}),o(" PRO version active ")]),e("p",te,"Expires on/by "+h(t.formatDate(a(d),!1,!1)),1),e("p",oe,[o(" Thank you for your support, much love "),f(_,{name:"i-noto-heart-hands","text-size":"text-2xl",class:"text-red-500"})])])):(c(),p("div",se,[e("p",le," Unlock all features for only $"+h(a(i))+" a month with PRO version ",1),ae]))]),e("div",ie,[f(_,{class:"mr-2",name:"i-twemoji-thinking-face","text-size":"text-4xl"}),ne]),re,!a(l)&&a(u)?(c(),p("div",ce,[e("div",ue,"Get PRO version for only $"+h(a(i))+"/month",1),e("div",de,[e("div",me,[e("div",{id:"paypalRef",ref_key:"paypalRef",ref:U},null,512)])])])):V("",!0)])]),_:1}))}},we=H(pe,[["__scopeId","data-v-caa841fc"]]);export{we as default};