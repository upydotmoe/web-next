import{c as pe,d as ce,l as ve,i as O}from"../server.mjs";import{_ as me,u as ge,a as S}from"./Icon.4480cdda.js";import{watch as F,onMounted as fe,ref as a,reactive as we,openBlock as R,createBlock as ye,withCtx as be,createElementVNode as o,toDisplayString as n,normalizeClass as s,withDirectives as u,createVNode as c,vShow as d,createTextVNode as B,unref as I,createElementBlock as U,createCommentVNode as X,toRaw as ke,pushScopeId as he,popScopeId as $e}from"vue";import"vue-router";import{L as Ce}from"./Layout.82674cce.js";import{W as Me,M as _e}from"./ModalView.b218d979.js";import{_ as Pe}from"./ErrorMessages.9543f57f.js";import{T as Oe}from"./TagFilterSelection.7879bba0.js";import"#internal/nitro";import"./Spinner.2a5d5b7b.js";import"./user-counters-api.d7c5fc90.js";import"./useFeed.1b0a564c.js";const Y=h=>(he("data-v-d2dcd0a0"),h=h(),$e(),h),Se={id:"lists"},xe={class:"navigations"},Le={class:"title"},Ee={class:"buttons"},Ne={class:"filter-buttons"},Ve={class:"filter-buttons"},Ae={class:"filter-buttons"},Fe={key:0,class:"filter-buttons"},Re={class:"navigations"},Be=Y(()=>o("div",{class:"hidden md:flex"},null,-1)),Ie={class:"buttons"},Te={class:"filter-buttons"},qe={class:"filter-buttons"},We={class:"inline-block w-full group md:w-40"},ze={class:"flex-1 pr-1"},De=Y(()=>o("span",null,[o("svg",{class:"w-4 h-4 transition duration-150 ease-in-out transform fill-current group-hover:-rotate-180",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20"},[o("path",{d:"M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"})])],-1)),Ke={id:"popular-order-options",class:"absolute z-10 mt-1 w-full text-center rounded-md transition duration-150 ease-in-out transform origin-top scale-0 md:w-40 theme-color group-hover:scale-100"},je={class:"mt-4"},Ge={key:0,class:"art-list-view-paging-control"},He={id:"browse-modal",class:"modal work-view"},Qe={__name:"index",setup(h){const x=pe(),{oApiConfiguration:Z,fetchOptions:J}=ce(),L=ge(Z,J()),$=ve(),{tags:E}=$.query;F(()=>$.query,()=>{ee()}),F(()=>$.query.tags,e=>{e&&(k.value=e,W(e)),i()}),fe(()=>{E&&W(),i()});const ee=()=>{O().closeModal("browse-modal")},T=a(!1),te=()=>{T.value=!T.value},oe=()=>{document.getElementById("popular-order-options").classList.add("scale-0")},f=a("recent"),q=async e=>{f.value=e,await i()},w=a(void 0),N=async e=>{w.value=e,r.page=0,await i()},y=a("daily"),C=async e=>{y.value=e,r.page=0,await i()},v=a(!1),le=async()=>{v.value=!v.value,r.page=0,await i()},W=async e=>{const t=e!=null?e:E;console.log(t);const[l,de]=await L.getTagKeys(t);if(!de){const A=[];l.tags.forEach(Q=>{A.push({key:Q.id,value:Q.tag})}),M.value=A,await D(A,t)}},z=a(null),ne=()=>{z.value.init(ke(M.value)),O().openModal("tag-filter-selection-modal")},k=a(""),M=a(),V=a(0),D=async(e,t)=>{M.value=e,k.value=t,V.value=t!==""?t.split(",").length:0,r.page=0,O().closeModal("tag-filter-selection-modal"),await i()};F(async()=>M.value,e=>{i()});const K=a([]),m=a({pagination:{enablePrev:!0,enableNext:!0}}),i=async()=>{const e=await ae(),t=e.works,l=e.pagination;!t.length&&l.record_total===0?se():(K.value=t,l.next_previous.next_page===null?m.value.pagination.enableNext=!1:m.value.pagination.enableNext=!0,l.next_previous.prev_page===null?m.value.pagination.enablePrev=!1:m.value.pagination.enablePrev=!0)},p=a(!0),r=we({perPage:18,page:a(0)}),ae=async()=>{!$.query.tags&&!E&&(k.value=""),r.page===0&&(p.value=!0,b.value=!1);let[e,t]=[];if(f.value==="recent"?[e,t]=await L.getLatest({pagination:{perPage:r.perPage,page:r.page},explicitMode:w.value,tags:k.value,followingOnly:v.value}):[e,t]=await L.getMostPopular({pagination:{perPage:r.perPage,page:r.page},range:y.value,rangeMode:g.value,explicitMode:w.value,tags:k.value,followingOnly:v.value}),t)ie();else return re(),e},j=async e=>{e==="prev"?r.page-=1:r.page+=1,await i()},b=a(!1),se=()=>{b.value=!0},_=a(!1),ie=()=>{p.value=!1,_.value=!0},re=()=>{p.value=!1,b.value=!1,_.value=!1},G=a(null),ue=(e,t=!1)=>{G.value.view(e,t),O().openModal("browse-modal")},g=a("none"),H=a(""),P=async(e,t)=>{g.value=e,H.value=t,oe(),await i()};return(e,t)=>(R(),ye(Ce,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:be(()=>[o("div",Se,[o("div",xe,[o("div",Le,n(e.$t("browse")),1),o("div",Ee,[o("div",Ne,[o("button",{class:s(["px-3 rounded-md button-item",V.value?"button":"theme-color"]),onClick:ne},n(V.value)+" "+n(e.$t("tagsApplied")),3)]),u(o("div",Ve,[o("button",{class:s(["px-3 rounded-md button-item",v.value?"button":"theme-color"]),onClick:t[0]||(t[0]=l=>le())},[u(c(S,{name:"i-fluent-people-checkmark-24-regular",class:"text-white"},null,512),[[d,v.value]]),u(c(S,{name:"i-fluent-people-checkmark-24-regular"},null,512),[[d,!v.value]]),B(" "+n(e.$t("following")),1)],2)],512),[[d,I(x).loggedIn]]),o("div",Ae,[o("p",{class:s(["rounded-l-md button-item",[f.value==="recent"?"button":"theme-color"]]),onClick:t[1]||(t[1]=l=>q("recent"))},n(e.$t("artworks.recent")),3),o("p",{class:s(["rounded-r-md button-item",[f.value==="popularity"?"button":"theme-color"]]),onClick:t[2]||(t[2]=l=>q("popularity"))},n(e.$t("artworks.mostPopular")),3)]),I(x).loggedIn&&I(x).user.user_settings.show_explicit?(R(),U("div",Fe,[o("p",{class:s(["rounded-l-md button-item",[w.value===void 0?"button":"theme-color"]]),onClick:t[3]||(t[3]=l=>N(void 0))},n(e.$t("default")),3),o("p",{class:s(["button-item",[w.value==="safe"?"button":"theme-color"]]),onClick:t[4]||(t[4]=l=>N("safe"))},n(e.$t("safe")),3),o("p",{class:s(["rounded-r-md button-item",[w.value==="explicit"?"button":"theme-color"]]),onClick:t[5]||(t[5]=l=>N("explicit"))},n(e.$t("explicit")),3)])):X("",!0)])]),o("div",Re,[Be,o("div",Ie,[u(o("div",Te,[o("p",{class:s(["rounded-l-md button-item",[y.value==="daily"?"button":"theme-color"]]),onClick:t[6]||(t[6]=l=>C("daily"))},n(e.$t("daily")),3),o("p",{class:s(["button-item",[y.value==="weekly"?"button":"theme-color"]]),onClick:t[7]||(t[7]=l=>C("weekly"))},n(e.$t("weekly")),3),o("p",{class:s(["button-item",[y.value==="monthly"?"button":"theme-color"]]),onClick:t[8]||(t[8]=l=>C("monthly"))},n(e.$t("monthly")),3),o("p",{class:s(["rounded-r-md button-item",[y.value==="all"?"button":"theme-color"]]),onClick:t[9]||(t[9]=l=>C("all"))},n(e.$t("allTime")),3)],512),[[d,f.value==="popularity"]]),u(o("div",qe,[o("div",We,[o("button",{class:"flex items-center py-2 w-full rounded-md outline-none md:w-40 theme-color hover:button",onClick:t[10]||(t[10]=l=>te())},[o("span",ze,n(g.value==="none"?e.$t("default"):H.value),1),De]),o("ul",Ke,[o("li",{class:s(["py-2 rounded-t-md cursor-pointer hover:button",{button:g.value==="none"}]),onClick:t[11]||(t[11]=l=>P("none",e.$t("default")))},n(e.$t("default")),3),o("li",{class:s(["py-2 cursor-pointer hover:button",{button:g.value==="views"}]),onClick:t[12]||(t[12]=l=>P("views",e.$t("mostViewed")))},n(e.$t("mostViewed")),3),o("li",{class:s(["py-2 cursor-pointer hover:button",{button:g.value==="likes"}]),onClick:t[13]||(t[13]=l=>P("likes",e.$t("mostLiked")))},n(e.$t("mostLiked")),3),o("li",{class:s(["py-2 rounded-b-md cursor-pointer hover:button",{button:g.value==="comments"}]),onClick:t[14]||(t[14]=l=>P("comments",e.$t("mostCommented")))},n(e.$t("mostCommented")),3)])])],512),[[d,f.value==="popularity"]])])]),c(Pe,{loading:p.value,empty:b.value,error:_.value,fetch:i},null,8,["loading","empty","error"]),u(o("div",je,[u(c(Me,{"section-class":"work-grid",works:K.value,view:ue},null,8,["works"]),[[d,!b.value]])],512),[[d,!p.value]]),!p.value&&!b.value&&!_.value?(R(),U("div",Ge,[u(o("button",{class:s(["primary-button",{"mr-2":m.value.pagination.enableNext}]),onClick:t[15]||(t[15]=l=>j("prev"))},[c(S,{name:"i-ion-chevron-back-outline"}),B(" "+n(e.$t("pagination.previous")),1)],2),[[d,m.value.pagination.enablePrev]]),u(o("button",{class:"primary-button",onClick:t[16]||(t[16]=l=>j("next"))},[B(n(e.$t("pagination.next"))+" ",1),c(S,{name:"i-ion-chevron-forward-outline",class:"ml-2",style:{"margin-right":"0 !important"}})],512),[[d,m.value.pagination.enableNext]])])):X("",!0),o("div",He,[u(c(_e,{ref_key:"popularModalViewRef",ref:G,section:"browse"},null,512),[[d,!p.value]])]),u(c(Oe,{id:"tag-filter-selection-modal",ref_key:"tagFilterSelectionModalRef",ref:z,class:"modal",onApply:D},null,512),[[d,!p.value]])])]),_:1}))}},it=me(Qe,[["__scopeId","data-v-d2dcd0a0"]]);export{it as default};
//# sourceMappingURL=index.a500162d.js.map