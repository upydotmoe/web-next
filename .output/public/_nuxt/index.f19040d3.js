import{L as G,k as j,j as T,m as q,r as c,J as Q,a1 as b,o as h,p as W,q as l,t as g,e as p,w as V,s as B,K as k,x as H,b as L,v as P,H as v,y as X,c as E,f as Y,O as Z,E as $,u as N}from"./entry.ed1bfc63.js";import{u as ee}from"./useI18n.33ad3225.js";import{L as oe}from"./Layout.c894869a.js";import{u as te}from"./ProBadge.dc1cf83d.js";import{W as ae}from"./WorkList.c9cb3145.js";import{M as ne}from"./ModalView.76afae2b.js";import{_ as ie}from"./LoadingEmptyErrorMessage.caee9811.js";import{_ as se}from"./_plugin-vue_export-helper.a1a6add7.js";import{u as re}from"./useUser.374c898b.js";import"./useReport.8d0e33e2.js";import"./Spinner.bfc0b0e5.js";import"./user-counters-api.0d36adb4.js";import"./useSetting.56e2c71f.js";import"./useFeed.bd601146.js";const le={components:{Icon:G,WorkList:ae,ModalView:ne,LoadingEmptyErrorMessage:ie},props:{title:{type:String,default:""},section:{type:String,default:""},paginationProp:{type:Object,default(){return{perPage:{type:Number,default:6},maxLoadMore:{type:Number,default:5}}}},discoverRoute:{type:String,default:"/"}},setup(t){const o=j(),{oApiConfiguration:a,fetchOptions:e}=T(),M=te(a,e());q(async()=>{await f()});const x=c([]),f=async()=>{const n=await _();if(n){const u=n.works,s=n.pagination;x.value=u,s.record_total<=i.perPage&&y(),s.record_total===0&&J()}else O()},r=c(!0),m=c(void 0),i=Q({perPage:t.paginationProp.perPage,page:c(0)}),_=async()=>{i.page===0&&(r.value=!0);try{let n,u;if(t.section==="recent"){const[s,w]=await M.getLatest({pagination:{page:i.page,perPage:i.perPage},explicitMode:m.value});s?n=s:u=w}else if(t.section==="following"){const[s,w]=await M.getFollowing({pagination:{page:i.page,perPage:i.perPage},explicitMode:m.value});s?n=s:u=w}else if(t.section==="popular"){const[s,w]=await M.getMostPopular({pagination:{page:i.page,perPage:i.perPage},explicitMode:m.value,range:"daily",rangeMode:"views"});s?n=s:u=w}return i.page+=1,K(),n}catch{O()}},d=c({delay:!1,maxLoad:t.paginationProp.maxLoadMore,showDiscoveryButton:!1}),z=async()=>{d.value.delay=!0;const n=await _(),u=n.works,s=n.pagination;u.forEach(w=>{x.value.push(w)}),d.value.delay=!1,s.next_previous.next_page||y(),s.next_previous.next_page&&s.current_page===d.value.maxLoad&&(y(),d.value.showDiscoveryButton=!0)},C=c(!0),y=()=>{C.value=!1},A=c(!1),J=()=>{A.value=!0,y()},R=c(!1),O=()=>{r.value=!1,R.value=!0,y()},K=()=>{r.value=!1,A.value=!1,R.value=!1},U=n=>{m.value=n,i.page=0,C.value=!0,d.value.showDiscoveryButton=!1,f()},S=c(null),D=c(null),I=c(null);return{auth:o,loading:r,explicitMode:m,changeExplicitMode:U,fetchTop:f,pagination:i,works:x,loadMoreOptions:d,showLoadMoreButton:C,loadMore:z,isEmpty:A,isError:R,recentModalViewRef:S,followingModalViewRef:D,popularModalViewRef:I,view:(n,u=!1)=>{t.section==="recent"&&S.value.view(n,u),t.section==="following"&&D.value.view(n,u),t.section==="popular"&&I.value.view(n,u),v().openModal(`${t.section}-modal`)}}}},ce={id:"lists"},de={class:"navigations"},ue={class:"title hidden-md-flex"},pe={class:"buttons"},fe={key:0,class:"filter-buttons"},me={class:"hidden-md-flex"},ge=["id"];function _e(t,o,a,e,M,x){const f=b("Icon"),r=X,m=b("LoadingEmptyErrorMessage"),i=b("WorkList"),_=b("ModalView");return h(),W("div",null,[l("div",ce,[l("div",de,[l("div",ue,g(a.title),1),p(r,{to:a.discoverRoute,class:"flex flex-row justify-between title md:hidden"},{default:V(()=>[B(g(a.title)+" ",1),p(f,{name:"i-fluent-arrow-enter-20-filled",class:"text-xl text-colored"})]),_:1},8,["to"]),l("div",pe,[e.auth.loggedIn&&e.auth.user.user_settings&&e.auth.user.user_settings.show_explicit?(h(),W("div",fe,[l("p",{class:k(["rounded-l-md button-item",[e.explicitMode===void 0?"button":"theme-color"]]),onClick:o[0]||(o[0]=d=>e.changeExplicitMode(void 0))},g(t.$t("default")),3),l("p",{class:k(["button-item",[e.explicitMode==="safe"?"button":"theme-color"]]),onClick:o[1]||(o[1]=d=>e.changeExplicitMode("safe"))},g(t.$t("safe")),3),l("p",{class:k(["rounded-r-md button-item",[e.explicitMode==="explicit"?"button":"theme-color"]]),onClick:o[2]||(o[2]=d=>e.changeExplicitMode("explicit"))},[p(f,{name:"i-material-symbols-explicit-outline",class:k({"text-white":e.explicitMode==="explicit"})},null,8,["class"]),B(" "+g(t.$t("explicit")),1)],2)])):H("",!0),l("div",me,[p(r,{class:"discover-button",to:a.discoverRoute},{default:V(()=>[B(g(t.$t("seeMore")),1)]),_:1},8,["to"])])])]),p(m,{loading:e.loading,empty:e.isEmpty,"empty-message":"No artwork yet, be the first one to upload your artwork here.",error:e.isError,fetch:e.fetchTop},null,8,["loading","empty","empty-message","error","fetch"]),L(l("div",null,[L(p(i,{"section-class":"work-grid",works:e.works,view:e.view},null,8,["works","view"]),[[P,!e.isEmpty]]),L(l("div",{class:k(["primary-button",e.loadMoreOptions.delay?"animate-pulse":""]),onClick:o[3]||(o[3]=(...d)=>e.loadMore&&e.loadMore(...d))},g(t.$t("loadMore")),3),[[P,e.showLoadMoreButton]]),L(l("div",null,[p(r,{to:"/artworks/"+a.section,class:"flex-row justify-center primary-button md:mt-4"},{default:V(()=>[p(f,{name:"i-fluent-arrow-enter-20-filled",class:"mr-1 text-white hover:text-white"}),B(" "+g(t.$t("seeMore")),1)]),_:1},8,["to"])],512),[[P,e.loadMoreOptions.showDiscoveryButton]])],512),[[P,!e.loading]]),l("div",{id:a.section+"-modal",class:"modal work-view"},[L(p(_,{ref:a.section+"ModalViewRef",section:a.section},null,8,["section"]),[[P,!e.loading]])],8,ge)])])}const F=se(le,[["render",_e],["__scopeId","data-v-47289eeb"]]),we={__name:"Recent",setup(t){const o={perPage:20,maxLoadMore:4};return(a,e)=>(h(),E(F,{section:"recent",title:a.$t("artworks.latestArtworks"),"pagination-prop":{perPage:o.perPage,maxLoadMore:o.maxLoadMore},"discover-route":"/artworks/recent"},null,8,["title","pagination-prop"]))}},ve={__name:"Following",setup(t){const o={perPage:10,maxLoadMore:4};return(a,e)=>(h(),E(F,{section:"following",title:a.$t("followings.followings"),"pagination-prop":{perPage:o.perPage,maxLoadMore:o.maxLoadMore},"discover-route":"/artworks/following","custom-empty-message":a.$t("explores.noFollowing")},null,8,["title","pagination-prop","custom-empty-message"]))}},he={__name:"Popular",setup(t){const o={perPage:10,maxLoadMore:4};return(a,e)=>(h(),E(F,{section:"popular",title:a.$t("artworks.dailyPopular"),"pagination-prop":{perPage:o.perPage,maxLoadMore:o.maxLoadMore},"discover-route":"/artworks/popular"},null,8,["title","pagination-prop"]))}},Me={class:"flex flex-col mt-2 w-full"},De={__name:"index",setup(t){const o=j(),{oApiConfiguration:a,fetchOptions:e}=T(),M=re(a,e()),{t:x}=ee();Y({title:x("explore")}),q(()=>{o.loggedIn&&m()});const f=Z();$(()=>f.query,i=>{setTimeout(()=>{v().closeModal("recent-modal"),v().closeModal("popular-modal"),v().closeModal("following-modal"),v().closeModal("collection-selection-modal"),v().closeModal("album-selection-modal"),v().closeModal("report-modal")},50)});const r=c(!1),m=async()=>{r.value=!1;const[i,_]=await M.countFollowings(o.user.id);_?r.value=!1:r.value=i>0};return(i,_)=>(h(),E(oe,{"with-footer":!0,"hide-side":!0,"no-right-side":!0,fullscreen:!0},{default:V(()=>[l("div",Me,[p(we,{class:"mb-10"}),N(o).loggedIn&&N(r)?(h(),E(ve,{key:0,class:"mb-10"})):H("",!0),p(he)])]),_:1}))}};export{De as default};