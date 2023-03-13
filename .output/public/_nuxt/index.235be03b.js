import{l as j,k as U,E as q,r as u,S as Y,o as h,s as M,b as i,x as w,f as a,w as F,t as L,U as R,u as t,K as b,y as N,e as V,v as A,z as G,X as D,Q as v,h as J,a as Z,N as ee,c as T}from"./entry.05f698ef.js";import{u as oe}from"./useI18n.779ba6b7.js";import{L as te}from"./Layout.896833a6.js";import{u as ae}from"./ProBadge.0148f2b1.js";import{W as se}from"./WorkList.5f1716c3.js";import{_ as le}from"./LoadingEmptyErrorMessage.983e35c1.js";import{_ as ne}from"./_plugin-vue_export-helper.c27b6911.js";import{M as I}from"./ModalView.10bf4b3d.js";import{u as ie}from"./useUser.65e8f8bc.js";import"./useReport.b296a84d.js";import"./index.af539870.js";import"./MiniArtworkPreview.2cbb70b4.js";import"./user-counters-api.9c94d46c.js";import"./useSetting.c4a424f7.js";import"./useFeed.d5b8d816.js";const re={id:"lists"},ce={class:"navigations"},ue={class:"title hidden-md-flex"},de={class:"buttons"},pe={key:0,class:"filter-buttons"},fe={class:"hidden-md-flex"},me={__name:"List",props:{title:{type:String,default:""},section:{type:String,default:""},paginationProp:{type:Object,default(){return{perPage:{type:Number,default:10},maxLoadMore:{type:Number,default:5}}}},discoverRoute:{type:String,default:"/"},customEmptyMessage:{type:String,default:""}},emits:["view"],setup(c,{emit:n}){const s=c,d=j(),{oApiConfiguration:l,fetchOptions:y}=U(),k=ae(l,y());q(async()=>{await P()});const _=u([]),P=async()=>{const e=await W();if(e){const r=e.works,o=e.pagination;_.value=r,o.record_total<=m.perPage&&$(),o.record_total===0&&K()}else z()},f=u(!0),p=u(void 0),m=Y({perPage:s.paginationProp.perPage,page:u(0)}),W=async()=>{m.page===0&&(f.value=!0);try{let e,r;if(s.section==="recent"){const[o,g]=await k.getLatest({pagination:{page:m.page,perPage:m.perPage},explicitMode:p.value});o?e=o:r=g}else if(s.section==="following"){const[o,g]=await k.getFollowing({pagination:{page:m.page,perPage:m.perPage},explicitMode:p.value});o?e=o:r=g}else if(s.section==="popular"){const[o,g]=await k.getMostPopular({pagination:{page:m.page,perPage:m.perPage},explicitMode:p.value,range:"daily",rangeMode:"views"});o?e=o:r=g}return m.page+=1,Q(),e}catch{z()}},x=u({delay:!1,maxLoad:s.paginationProp.maxLoadMore,showDiscoveryButton:!1}),H=async()=>{x.value.delay=!0;const e=await W(),r=e.works,o=e.pagination;r.forEach(g=>{_.value.push(g)}),x.value.delay=!1,o.next_previous.next_page||$(),o.next_previous.next_page&&o.current_page===x.value.maxLoad&&($(),x.value.showDiscoveryButton=!0)},B=u(!0),$=()=>{B.value=!1},E=u(!1),K=()=>{E.value=!0,$()},C=u(!1),z=()=>{f.value=!1,C.value=!0,$()},Q=()=>{f.value=!1,E.value=!1,C.value=!1},S=e=>{p.value=e,m.page=0,B.value=!0,x.value.showDiscoveryButton=!1,P()},X=e=>{n("view",e)};return(e,r)=>{const o=G;return h(),M("div",null,[i("div",re,[i("div",ce,[i("div",ue,w(c.title),1),a(o,{to:c.discoverRoute,class:"flex flex-row justify-between title md:hidden"},{default:F(()=>[L(w(c.title)+" ",1),a(R,{name:"i-fluent-arrow-enter-20-filled",class:"text-xl text-colored"})]),_:1},8,["to"]),i("div",de,[t(d).loggedIn&&t(d).user.user_settings&&t(d).user.user_settings.show_explicit?(h(),M("div",pe,[i("p",{class:b(["rounded-l-md button-item",[t(p)===void 0?"button":"theme-color"]]),onClick:r[0]||(r[0]=g=>S(void 0))},w(e.$t("default")),3),i("p",{class:b(["button-item",[t(p)==="safe"?"button":"theme-color"]]),onClick:r[1]||(r[1]=g=>S("safe"))},w(e.$t("safe")),3),i("p",{class:b(["rounded-r-md button-item",[t(p)==="explicit"?"button":"theme-color"]]),onClick:r[2]||(r[2]=g=>S("explicit"))},[a(R,{name:"i-material-symbols-explicit-outline",class:b({"text-white":t(p)==="explicit"})},null,8,["class"]),L(" "+w(e.$t("explicit")),1)],2)])):N("",!0),i("div",fe,[a(o,{class:"discover-button",to:c.discoverRoute},{default:F(()=>[L(w(e.$t("seeMore")),1)]),_:1},8,["to"])])])]),a(le,{loading:t(f),empty:t(E),"empty-message":c.customEmptyMessage!==""?c.customEmptyMessage:e.$t("artworks.noArtworkYet"),error:t(C),fetch:P},null,8,["loading","empty","empty-message","error"]),V(i("div",null,[V(a(se,{"section-class":"work-grid-10",works:t(_),view:X},null,8,["works"]),[[A,!t(E)]]),V(i("div",{class:b(["w-full primary-button",t(x).delay?"animate-pulse":""]),onClick:H},w(e.$t("loadMore")),3),[[A,t(B)]]),V(i("div",null,[a(o,{to:"/artworks/"+c.section,class:"w-full primary-button"},{default:F(()=>[a(R,{name:"i-fluent-arrow-enter-20-filled",class:"mr-1 text-white hover:text-white"}),L(" "+w(e.$t("seeMore")),1)]),_:1},8,["to"])],512),[[A,t(x).showDiscoveryButton]])],512),[[A,!t(f)]])])])}}},O=ne(me,[["__scopeId","data-v-c01b0370"]]),ge={id:"recent-modal",class:"modal work-view"},we={__name:"Recent",setup(c){const n={perPage:30,maxLoadMore:2},s=u(null),d=l=>{s.value.view(l),v().openModal("recent-modal")};return(l,y)=>(h(),M(D,null,[a(O,{section:"recent",title:l.$t("artworks.latestArtworks"),"pagination-prop":{perPage:n.perPage,maxLoadMore:n.maxLoadMore},"discover-route":"/artworks/recent",onView:d},null,8,["title","pagination-prop"]),i("div",ge,[a(I,{ref_key:"recentModalViewRef",ref:s,section:"recent"},null,512)])],64))}},ve={id:"following-modal",class:"modal work-view"},_e={__name:"Following",setup(c){const n={perPage:10,maxLoadMore:4},s=u(null),d=l=>{s.value.view(l),v().openModal("following-modal")};return(l,y)=>(h(),M(D,null,[a(O,{section:"following",title:l.$t("followings.followings"),"pagination-prop":{perPage:n.perPage,maxLoadMore:n.maxLoadMore},"discover-route":"/artworks/following","custom-empty-message":l.$t("explores.noFollowing"),onView:d},null,8,["title","pagination-prop","custom-empty-message"]),i("div",ve,[a(I,{ref_key:"followingModalViewRef",ref:s,section:"following"},null,512)])],64))}},he={id:"popular-modal",class:"modal work-view"},xe={__name:"Popular",setup(c){const n={perPage:10,maxLoadMore:4},s=u(null),d=l=>{s.value.view(l),v().openModal("popular-modal")};return(l,y)=>(h(),M(D,null,[a(O,{section:"popular",title:l.$t("artworks.dailyPopular"),"pagination-prop":{perPage:n.perPage,maxLoadMore:n.maxLoadMore},"discover-route":"/artworks/popular",onView:d},null,8,["title","pagination-prop"]),i("div",he,[a(I,{ref_key:"popularModalViewRef",ref:s,section:"popular"},null,512)])],64))}},ye={class:"flex flex-col gap-12 px-2 mt-2 w-full"},Me={key:0,class:"flex flex-row gap-2 p-4 text-black bg-yellow-300 rounded-md"},Ie={__name:"index",setup(c){const n=j(),{oApiConfiguration:s,fetchOptions:d}=U(),l=ie(s,d()),{t:y}=oe();J({title:y("explore")}),q(()=>{n.loggedIn&&P()});const k=Z();ee(()=>k.query,f=>{setTimeout(()=>{v().closeModal("recent-modal"),v().closeModal("popular-modal"),v().closeModal("following-modal"),v().closeModal("collection-selection-modal"),v().closeModal("album-selection-modal"),v().closeModal("report-modal")},50)});const _=u(!1),P=async()=>{_.value=!1;const[f,p]=await l.countFollowings(n.user.id);p?_.value=!1:_.value=f>0};return(f,p)=>(h(),T(te,{"with-footer":!0,"hide-side":!0,"no-right-side":!0,fullscreen:!0},{default:F(()=>[i("div",ye,[t(n).loggedIn?N("",!0):(h(),M("div",Me,[a(R,{name:"i-mdi-information-variant","text-size":"text-lg","icon-color":"text-black"}),L(" "+w(f.$t("loginFullFeature")),1)])),a(we),t(n).loggedIn&&t(_)?(h(),T(_e,{key:1})):N("",!0),a(xe)])]),_:1}))}};export{Ie as default};
