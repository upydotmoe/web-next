import{c as U,d as X,i as M}from"../server.mjs";import{_ as Y,u as Z,a as E}from"./Icon.66eb61eb.js";import{onBeforeMount as J,ref as a,watch as ee,reactive as te,openBlock as x,createBlock as oe,withCtx as ne,createElementVNode as o,toDisplayString as n,normalizeClass as s,unref as L,createElementBlock as R,createCommentVNode as F,createVNode as c,withDirectives as k,vShow as h,createTextVNode as I,toRaw as le,pushScopeId as ae,popScopeId as se}from"vue";import{L as ie}from"./Layout.294e92ff.js";import{W as re,M as ue}from"./ModalView.784f5ea3.js";import{_ as de}from"./LoadingEmptyErrorMessage.02098181.js";import{T as pe}from"./TagFilterSelection.1d203ace.js";import"#internal/nitro";import"vue-router";import"./Spinner.8f56f1de.js";import"./user-counters-api.260734d1.js";import"./useFeed.0a870d4a.js";const ve=g=>(ae("data-v-98fd352a"),g=g(),se(),g),ce={id:"lists"},me={class:"navigations"},fe={class:"title"},ge={class:"buttons"},we={class:"filter-buttons"},be={class:"filter-buttons"},ye={class:"filter-buttons"},ke={class:"inline-block w-full md:w-40 group"},he={class:"flex items-center py-2 px-3 w-full rounded-md outline-none md:w-40 theme-color hover:button focus:outline-none"},$e={class:"flex-1 pr-1"},_e=ve(()=>o("span",null,[o("svg",{class:"w-4 h-4 transition duration-150 ease-in-out transform fill-current group-hover:-rotate-180",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[o("path",{d:"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"})])],-1)),Ce={class:"absolute z-10 mt-1 w-full text-center rounded-md transition duration-150 ease-in-out transform origin-top scale-0 md:w-40 theme-color group-hover:scale-100"},Me={key:0,class:"filter-buttons"},xe={class:"mt-4"},Se={key:0,class:"art-list-view-paging-control"},Pe={id:"popular-modal",class:"modal work-view"},Te={__name:"index",setup(g){const S=U(),{oApiConfiguration:z,fetchOptions:W}=X(),D=Z(z,W());J(()=>{i()});const m=a(void 0),$=async t=>{m.value=t,u.page=0,await i()},p=a("daily"),w=async t=>{p.value=t,u.page=0,await i()},P=a(null),O=()=>{P.value.init(le(_.value)),M().openModal("tag-filter-selection-modal")},T=a(""),_=a(),C=a(0),j=async(t,e)=>{_.value=t,T.value=e,C.value=e!==""?e.split(",").length:0,u.page=0,M().closeModal("tag-filter-selection-modal"),await i()};ee(async()=>_.value,t=>{i()});const V=a([]),v=a({pagination:{enablePrev:!0,enableNext:!0}}),i=async()=>{const t=await q(),e=t.works,l=t.pagination;!e.length&&l.record_total===0?G():(V.value=e,l.next_previous.next_page===null?v.value.pagination.enableNext=!1:v.value.pagination.enableNext=!0,l.next_previous.prev_page===null?v.value.pagination.enablePrev=!1:v.value.pagination.enablePrev=!0)},r=a(!0),u=te({perPage:18,page:a(0)}),q=async()=>{u.page===0&&(r.value=!0);const[t,e]=await D.getMostPopular({pagination:{perPage:u.perPage,page:u.page},range:p.value,rangeMode:d.value,explicitMode:m.value,tags:T.value});if(e)H();else return K(),t},A=async t=>{t==="prev"?u.page-=1:u.page+=1,await i()},f=a(!1),G=()=>{f.value=!0},b=a(!1),H=()=>{r.value=!1,b.value=!0},K=()=>{r.value=!1,f.value=!1,b.value=!1},N=a(null),Q=(t,e=!1)=>{N.value.view(t,e),M().openModal("popular-modal")},d=a("none"),B=a(""),y=async(t,e)=>{d.value=t,B.value=e,await i()};return(t,e)=>(x(),oe(ie,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:ne(()=>[o("div",ce,[o("div",me,[o("div",fe,n(t.$t("artworks.popularArtworks")),1),o("div",ge,[o("div",we,[o("button",{class:s(["px-3 rounded-md button-item",C.value?"button":"theme-color"]),onClick:O},n(C.value)+" "+n(t.$t("tagsApplied")),3)]),o("div",be,[o("p",{class:s(["rounded-l-md button-item",[p.value==="daily"?"button":"theme-color"]]),onClick:e[0]||(e[0]=l=>w("daily"))},n(t.$t("daily")),3),o("p",{class:s(["button-item",[p.value==="weekly"?"button":"theme-color"]]),onClick:e[1]||(e[1]=l=>w("weekly"))},n(t.$t("weekly")),3),o("p",{class:s(["button-item",[p.value==="monthly"?"button":"theme-color"]]),onClick:e[2]||(e[2]=l=>w("monthly"))},n(t.$t("monthly")),3),o("p",{class:s(["rounded-r-md button-item",[p.value==="all"?"button":"theme-color"]]),onClick:e[3]||(e[3]=l=>w("all"))},n(t.$t("allTime")),3)]),o("div",ye,[o("div",ke,[o("button",he,[o("span",$e,n(d.value==="none"?t.$t("default"):B.value),1),_e]),o("ul",Ce,[o("li",{class:s(["py-2 px-3 rounded-t-md cursor-pointer hover:button",{button:d.value==="none"}]),onClick:e[4]||(e[4]=l=>y("none",t.$t("default")))},n(t.$t("default")),3),o("li",{class:s(["py-2 px-3 cursor-pointer hover:button",{button:d.value==="views"}]),onClick:e[5]||(e[5]=l=>y("views",t.$t("mostViewed")))},n(t.$t("mostViewed")),3),o("li",{class:s(["py-2 px-3 cursor-pointer hover:button",{button:d.value==="likes"}]),onClick:e[6]||(e[6]=l=>y("likes",t.$t("mostLiked")))},n(t.$t("mostLiked")),3),o("li",{class:s(["py-2 px-3 rounded-b-md cursor-pointer hover:button",{button:d.value==="comments"}]),onClick:e[7]||(e[7]=l=>y("comments",t.$t("mostCommented")))},n(t.$t("mostCommented")),3)])])]),L(S).loggedIn&&L(S).user.user_settings.show_explicit?(x(),R("div",Me,[o("p",{class:s(["rounded-l-md button-item",[m.value===void 0?"button":"theme-color"]]),onClick:e[8]||(e[8]=l=>$(void 0))},n(t.$t("default")),3),o("p",{class:s(["button-item",[m.value==="safe"?"button":"theme-color"]]),onClick:e[9]||(e[9]=l=>$("safe"))},n(t.$t("safe")),3),o("p",{class:s(["rounded-r-md button-item",[m.value==="explicit"?"button":"theme-color"]]),onClick:e[10]||(e[10]=l=>$("explicit"))},n(t.$t("explicit")),3)])):F("",!0)])]),c(de,{loading:r.value,empty:f.value,error:b.value,fetch:i},null,8,["loading","empty","error"]),k(o("div",xe,[k(c(re,{"section-class":"work-grid",works:V.value,view:Q},null,8,["works"]),[[h,!f.value]])],512),[[h,!r.value]]),!r.value&&!f.value&&!b.value?(x(),R("div",Se,[o("button",{class:s([v.value.pagination.enablePrev?"primary-button":"disabled-button"]),onClick:e[11]||(e[11]=l=>A("prev"))},[c(E,{name:"i-ion-chevron-back-outline"}),I(" "+n(t.$t("pagination.previous")),1)],2),o("button",{class:s([v.value.pagination.enableNext?"primary-button":"disabled-button"]),onClick:e[12]||(e[12]=l=>A("next"))},[I(n(t.$t("pagination.next"))+" ",1),c(E,{name:"i-ion-chevron-forward-outline",class:"md:ml-2",style:{"margin-right":"0 !important"}})],2)])):F("",!0),o("div",Pe,[k(c(ue,{ref_key:"popularModalViewRef",ref:N,section:"popular"},null,512),[[h,!r.value]])]),k(c(pe,{id:"tag-filter-selection-modal",ref_key:"tagFilterSelectionModalRef",ref:P,class:"modal",onApply:j},null,512),[[h,!r.value]])])]),_:1}))}},Oe=Y(Te,[["__scopeId","data-v-98fd352a"]]);export{Oe as default};
//# sourceMappingURL=index.876821eb.js.map
