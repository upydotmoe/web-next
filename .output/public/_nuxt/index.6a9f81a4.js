import{l as oe,k as se,a as N,L as D,r as a,p as H,H as ne,o as S,q as V,b as t,t as l,e as h,v as w,u as e,I as n,f as c,Q as $,s as R,x as Z,O as me,S as ae,T as le,K as ve,m as fe,h as ee,c as te,w as he,M as we,W as ye,Y as ge}from"./entry.ea93fdf2.js";import{P as T}from"./index.af539870.js";import{L as be}from"./Layout.7db09108.js";import{u as _e}from"./ProBadge.e3dc9c3a.js";import{W as ke}from"./WorkList.4a26cf02.js";import{_ as re}from"./LoadingEmptyErrorMessage.118d4a88.js";import{M as $e}from"./ModalView.4408fcca.js";import{_ as Y}from"./_plugin-vue_export-helper.c27b6911.js";import{U as xe}from"./UserList.6090c68e.js";import{u as Ce}from"./useUser.bb4e922e.js";import{L as Me}from"./LoginMessage.fa865991.js";import"./useReport.d0d73bb6.js";import"./MiniArtworkPreview.a5a5c06c.js";import"./user-counters-api.8980a299.js";import"./useSetting.33e0bf81.js";import"./useFeed.53b119c5.js";const ie=g=>(ae("data-v-6f0e9e52"),g=g(),le(),g),qe={id:"options",class:"md:z-10 md:sticky md:top-0"},Re={class:"navigations"},Ae={class:"title"},Oe={class:"buttons"},Se={class:"filter-buttons"},Le={class:"filter-buttons"},Te={key:0,class:"filter-buttons"},Be={key:0,class:"navigations"},Ee=ie(()=>t("div",null,null,-1)),Ie={class:"buttons"},Pe={class:"filter-buttons"},Ue={class:"filter-buttons"},Ve={class:"inline-block w-full md:w-52 group"},We={class:"flex items-center py-2 px-3 w-full rounded-md border-2 border-transparent outline-none md:w-52 theme-color hover:button focus:outline-none"},Fe={class:"flex-1 pr-1"},Ke=ie(()=>t("span",null,[t("svg",{class:"w-4 h-4 transition duration-150 ease-in-out transform fill-current group-hover:-rotate-180",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[t("path",{d:"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"})])],-1)),je={class:"absolute z-10 mt-1 w-full text-center rounded-md transition duration-150 ease-in-out transform origin-top scale-0 md:w-52 theme-color group-hover:scale-100"},ze={class:"mt-4"},Ne={id:"popular-modal",class:"modal work-view"},De={__name:"Artworks",emits:["countArtworks"],setup(g,{emit:B}){const x=oe(),{oApiConfiguration:E,fetchOptions:b}=se(),v=_e(E,b()),p=N(),{q:A}=p.query;D(()=>p.query.q,(o,s)=>{o!==s&&(_.value=o,o&&o!==""&&q())});const _=a(A);H(()=>{q(),C()});const C=()=>{var o=document.createElement("div");o.classList.add("myObserver");var s=document.querySelector("#options");m(o,s);function m(K,X){X.parentNode.insertBefore(K,X)}var pe=new IntersectionObserver(function(K){K[0].intersectionRatio===0?document.querySelector("#options").classList.add("md:pt-4","md:pb-1","md:theme-color-secondary","md:rounded-b-md","md:px-6","md:mt-2","md:border-color-button-color","md:border-2","md:border-t-0"):K[0].intersectionRatio===1&&document.querySelector("#options").classList.remove("md:pt-4","md:pb-1","md:theme-color-secondary","md:rounded-b-md","md:px-6","md:mt-2","md:border-color-button-color","md:border-2","md:border-t-0")},{threshold:[0,1]});pe.observe(document.querySelector(".myObserver"))},f=a("recent"),k=async o=>{f.value=o,await q()},u=a(void 0),d=async o=>{u.value=o,await q()},r=a("views"),I=a(""),O=async(o,s)=>{r.value=o,I.value=s,await q()},M=a("daily"),L=async o=>{M.value=o,await q()},i=a(!1),y=async()=>{i.value=!i.value,await q()},P=a([]),q=async()=>{de();const{works:o,pagination:s}=await G();o.length&&s.record_total&&(P.value=o),B("countArtworks",s.record_total)},U=a(!0),W=a(!1),Q=ne(()=>!W.value&&!P.value.length),j=a(!0),F=a({perPage:24,page:0}),G=async()=>{const[o,s]=await v.getSearch({recentMode:f.value==="recent",range:M.value,rangeMode:r.value,explicitMode:u.value,keyword:_.value??"",followingOnly:i.value===!1?void 0:i.value,pagination:{perPage:F.value.perPage,page:F.value.page}});if(U.value=!1,o.pagination.next_previous.next_page||(j.value=!1),s)W.value=!0;else return F.value.page+=1,o},z=a({delay:!1}),ue=async()=>{z.value.delay=!0;const{works:o}=await G();o.forEach(s=>{P.value.push(s)}),z.value.delay=!1},de=()=>{P.value=[],j.value=!0,F.value.page=0,U.value=!0,W.value=!1},J=a(null),ce=(o,s=!1)=>{J.value.view(o,s),me().openModal("popular-modal")};return(o,s)=>(S(),V("div",null,[t("div",qe,[t("div",Re,[t("div",Ae,l(o.$t("artworks.artworks")),1),t("div",Oe,[h(t("div",Se,[t("button",{class:n(["px-3 rounded-md button-item",e(i)?"button":"theme-color"]),onClick:s[0]||(s[0]=m=>y())},[h(c($,{name:"i-fluent-people-checkmark-24-regular",class:"text-white"},null,512),[[w,e(i)]]),h(c($,{name:"i-fluent-people-checkmark-24-regular"},null,512),[[w,!e(i)]]),R(" "+l(o.$t("followingOnly")),1)],2)],512),[[w,e(x).loggedIn]]),t("div",Le,[t("p",{class:n(["rounded-l-md button-item",[e(f)==="recent"?"button":"theme-color"]]),onClick:s[1]||(s[1]=m=>k("recent"))},l(o.$t("artworks.newest")),3),t("p",{class:n(["rounded-r-md button-item",[e(f)==="popularity"?"button":"theme-color"]]),onClick:s[2]||(s[2]=m=>k("popularity"))},[c($,{name:"i-icon-park-outline-oval-love-two",class:n([{"text-white":e(f)==="popularity"}])},null,8,["class"]),R(" "+l(o.$t("artworks.mostPopular")),1)],2)]),e(x).loggedIn&&e(x).user.user_settings.show_explicit?(S(),V("div",Te,[t("p",{class:n(["rounded-l-md button-item",[e(u)===void 0?"button":"theme-color"]]),onClick:s[3]||(s[3]=m=>d(void 0))},l(o.$t("default")),3),t("p",{class:n(["button-item",[e(u)==="safe"?"button":"theme-color"]]),onClick:s[4]||(s[4]=m=>d("safe"))},l(o.$t("safe")),3),t("p",{class:n(["rounded-r-md button-item",[e(u)==="explicit"?"button":"theme-color"]]),onClick:s[5]||(s[5]=m=>d("explicit"))},[c($,{name:"i-material-symbols-explicit-outline",class:n({"text-white":e(u)==="explicit"})},null,8,["class"]),R(" "+l(o.$t("explicit")),1)],2)])):Z("",!0)])]),e(f)==="popularity"?(S(),V("div",Be,[Ee,t("div",Ie,[t("div",Pe,[t("p",{class:n(["rounded-l-md button-item",[e(M)==="daily"?"button":"theme-color"]]),onClick:s[6]||(s[6]=m=>L("daily"))},l(o.$t("daily")),3),t("p",{class:n(["button-item",[e(M)==="weekly"?"button":"theme-color"]]),onClick:s[7]||(s[7]=m=>L("weekly"))},l(o.$t("weekly")),3),t("p",{class:n(["button-item",[e(M)==="monthly"?"button":"theme-color"]]),onClick:s[8]||(s[8]=m=>L("monthly"))},l(o.$t("monthly")),3),t("p",{class:n(["rounded-r-md button-item",[e(M)==="all"?"button":"theme-color"]]),onClick:s[9]||(s[9]=m=>L("all"))},l(o.$t("allTime")),3)]),t("div",Ue,[t("div",Ve,[t("button",We,[t("span",Fe,l(e(r)==="views"?o.$t("mostViewed"):e(I)),1),Ke]),t("ul",je,[t("li",{class:n(["flex flex-row justify-between py-2 px-3 cursor-pointer hover:button icon-hover-parent",{button:e(r)==="views"}]),onClick:s[10]||(s[10]=m=>O("views",o.$t("mostViewed")))},[c($,{name:"i-mi-eye",class:n({"text-white":e(r)==="views"})},null,8,["class"]),R(" "+l(o.$t("mostViewed")),1)],2),t("li",{class:n(["flex flex-row justify-between py-2 px-3 cursor-pointer hover:button icon-hover-parent",{button:e(r)==="likes"}]),onClick:s[11]||(s[11]=m=>O("likes",o.$t("mostLiked")))},[c($,{name:"i-ri-heart-3-line",class:n({"text-white":e(r)==="likes"})},null,8,["class"]),R(" "+l(o.$t("mostLiked")),1)],2),t("li",{class:n(["flex flex-row justify-between py-2 px-3 rounded-b-md cursor-pointer hover:button icon-hover-parent",{button:e(r)==="comments"}]),onClick:s[12]||(s[12]=m=>O("comments",o.$t("mostCommented")))},[c($,{name:"i-mdi-comment-multiple-outline",class:n({"text-white":e(r)==="comments"})},null,8,["class"]),R(" "+l(o.$t("mostCommented")),1)],2)])])])])])):Z("",!0)]),c(re,{loading:e(U),empty:e(Q),error:e(W),fetch:q},null,8,["loading","empty","error"]),h(t("div",ze,[h(c(ke,{"section-class":"work-grid-6",works:e(P),view:ce},null,8,["works"]),[[w,!e(Q)]]),h(t("div",{class:n(["w-full primary-button",e(z).delay?"animate-pulse":""]),onClick:ue},l(o.$t("loadMore")),3),[[w,e(j)]])],512),[[w,!e(U)]]),t("div",Ne,[h(c($e,{ref_key:"popularModalViewRef",ref:J,section:"popular"},null,512),[[w,!e(U)]])])]))}},He=Y(De,[["__scopeId","data-v-6f0e9e52"]]);const Ye=g=>(ae("data-v-aeb34405"),g=g(),le(),g),Qe={class:"navigations"},Ge={class:"title"},Je=Ye(()=>t("div",{class:"buttons"},null,-1)),Xe={__name:"Users",emits:["countUsers"],setup(g,{emit:B}){const{oApiConfiguration:x,fetchOptions:E}=se(),b=Ce(x,E()),v=N(),{q:p}=v.query;D(()=>v.query.q,(i,y)=>{i!==y&&(A.value=i,C())});const A=a(p);H(()=>{setTimeout(()=>{C()},1e3)});const _=a([]),C=async()=>{L();const{users:i,pagination:y}=await I();i.length&&y.record_total&&(_.value=i),B("countUsers",y.record_total)},f=a(!0),k=a(!1),u=ne(()=>!k.value&&!_.value.length),d=a(!0),r=a({perPage:16,page:a(0)}),I=async()=>{const[i,y]=await b.searchUsers({keyword:A.value??"",pagination:{page:r.value.page,perPage:r.value.perPage}});if(f.value=!1,i.pagination.next_previous.next_page||(d.value=!1),y)k.value=!0;else return r.value.page+=1,i},O=a({delay:!1,showDiscoveryButton:!1}),M=async()=>{O.value.delay=!0,(await I()).users.forEach(y=>{_.value.push(y)}),O.value.delay=!1},L=()=>{_.value=[],d.value=!0,r.value.page=0,f.value=!0,k.value=!1};return(i,y)=>(S(),V("div",null,[t("div",Qe,[t("div",Ge,l(i.$t("users.users")),1),Je]),c(re,{loading:e(f),empty:e(u),error:e(k),fetch:C},null,8,["loading","empty","error"]),h(t("div",null,[h(c(xe,{users:e(_)},null,8,["users"]),[[w,!e(u)]]),h(t("div",{class:n(["w-full primary-button",e(O).delay?"animate-pulse":""]),onClick:M},l(i.$t("loadMore")),3),[[w,e(d)]])],512),[[w,!e(f)]])]))}},Ze=Y(Xe,[["__scopeId","data-v-aeb34405"]]);const et={class:"mx-2"},tt={key:1,id:"lists"},ot={class:"search"},st=["placeholder"],nt={class:"flex flex-row gap-2 mb-6 w-full"},at={__name:"index",setup(g){const B=oe(),{t:x}=ve(),E=fe(),b=N();ee({title:x("search.search")+(b.query.q?` "${b.query.q}"`:"")});const v=a("");H(()=>{v.value=b.query.q});const p=a(b.query.t??T.ARTWORK),A=a(0),_=u=>{A.value=u},C=a(0),f=u=>{C.value=u};D(()=>b.query,({q:u})=>{v.value=u,ee({title:x("search.search")+(v.value?` "${v.value}"`:b.query.q)})});const k=()=>{E.push({path:"/search",query:{q:v.value},replace:!0,force:!0})};return(u,d)=>(S(),te(be,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:he(()=>[t("div",et,[e(B).loggedIn?(S(),V("div",tt,[t("span",ot,[h(t("input",{"onUpdate:modelValue":d[0]||(d[0]=r=>ye(v)?v.value=r:null),type:"text",name:"search",placeholder:u.$t("search.search"),onKeyup:d[1]||(d[1]=ge(r=>k(),["enter"]))},null,40,st),[[we,e(v)]]),t("span",{class:"search-button",onClick:d[2]||(d[2]=r=>k())},[c($,{name:"i-ion-search"})])]),t("div",nt,[t("div",{class:n(["px-2 rounded-lg",e(p)===e(T).ARTWORK?"primary-button":"light-bordered-button"]),onClick:d[3]||(d[3]=r=>p.value=e(T).ARTWORK)},[c($,{name:"i-majesticons-image",class:n(["mr-2",{"text-white":e(p)===e(T).ARTWORK}])},null,8,["class"]),R(" "+l(u.$t("artworks.artworks"))+" ",1),t("span",{class:n(["px-1 ml-2 rounded",e(p)===e(T).ARTWORK?"theme-color":"bg-gray-600 text-white"])},l(e(A)),3)],2),t("div",{class:n(["px-2 rounded-lg",e(p)==="users"?"primary-button":"light-bordered-button"]),onClick:d[4]||(d[4]=r=>p.value="users")},[c($,{name:"i-fluent-person-32-regular",class:n(["mr-2",{"text-white":e(p)==="users"}])},null,8,["class"]),R(" "+l(u.$t("users.users"))+" ",1),t("span",{class:n(["px-1 ml-2 rounded",e(p)==="users"?"theme-color":"bg-gray-600 text-white"])},l(e(C)),3)],2)]),h(t("div",null,[c(He,{onCountArtworks:_})],512),[[w,e(p)===e(T).ARTWORK]]),h(t("div",null,[c(Ze,{onCountUsers:f})],512),[[w,e(p)==="users"]])])):(S(),te(Me,{key:0}))])]),_:1}))}},kt=Y(at,[["__scopeId","data-v-7e9b730d"]]);export{kt as default};
