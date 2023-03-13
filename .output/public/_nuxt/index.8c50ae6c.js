import{o as u,s as g,b as s,x as c,X as le,Y as ie,c as V,w as S,f as i,U as h,t as R,u as o,y as b,z as ne,P as ae,l as G,a4 as ve,k as re,h as ke,C as ye,m as de,a as be,p as ce,E as ue,N as Z,Q as x,r as d,K as j,e as L,v as K,Z as $e,V as Re,W as Me,J as xe}from"./entry.05f698ef.js";import{u as Se}from"./useUser.65e8f8bc.js";import{L as Ae}from"./Layout.896833a6.js";import{U as fe}from"./UserList.46ac20b3.js";import{_ as J}from"./_plugin-vue_export-helper.c27b6911.js";import{d as Fe,u as Te,J as Ie,a as Ue,b as Ce,c as Oe}from"./ProBadge.0148f2b1.js";import{u as We}from"./useFeed.d5b8d816.js";import{u as Le}from"./useI18n.779ba6b7.js";import{M as Ke,a as Ve,u as De,b as Pe}from"./ModalView.10bf4b3d.js";import{P as _}from"./index.af539870.js";import{A as Ee,I as Ne,a as Be,_ as ze,F as Ye}from"./FeedModalView.54b93ba3.js";import"./user-counters-api.9c94d46c.js";import"./useReport.b296a84d.js";import"./MiniArtworkPreview.2cbb70b4.js";import"./WorkList.5f1716c3.js";import"./LoadingEmptyErrorMessage.983e35c1.js";import"./useSetting.c4a424f7.js";const je=[{icon:"i-fluent-person-32-regular",title:"feeds.newUser.welcomingMenus.setupYourAccount",href:"/profile/setting"},{icon:"i-ion-add",title:"feeds.newUser.welcomingMenus.uploadYourArtwork",href:"/post"},{icon:"i-ph-user-plus",title:"feeds.newUser.welcomingMenus.followSomeone",href:"/search?t=users"},{icon:"i-ion-search",title:"feeds.newUser.welcomingMenus.exploreArtworks",href:"/artworks/browse"}];const He={id:"welcome",class:"middle__welcome"},Je={class:"middle__welcome__title"},qe={class:"middle__welcome__menus"},Qe={key:0,class:"middle__welcome__follow-suggestions"},Xe={class:"title"},Ze={__name:"WelcomeSection",props:{suggestedUsersToFollow:{type:Array,default:()=>[]}},setup(a){return(m,k)=>{const w=ne;return u(),g("section",He,[s("div",null,[s("h1",Je,c(m.$t("feeds.newUser.welcome")),1),s("div",qe,[(u(!0),g(le,null,ie(o(je),r=>(u(),V(w,{key:r.href,to:r.href},{default:S(()=>[i(h,{name:r.icon,"text-size":"text-2xl"},null,8,["name"]),R(" "+c(m.$t(r.title)),1)]),_:2},1032,["to"]))),128))])]),a.suggestedUsersToFollow&&a.suggestedUsersToFollow.length?(u(),g("div",Qe,[s("div",Xe,c(m.$t("feeds.newUser.suggestedUsers")),1),i(fe,{users:a.suggestedUsersToFollow,"column-type":2,class:"mt-4"},null,8,["users"])])):b("",!0)])}}},Ge=J(Ze,[["__scopeId","data-v-83515581"]]);const et={id:"artwork-feed",class:"feed"},tt={id:"redraw",class:"feed__redraw"},ot={key:0,class:"feed__redraw__mini-preview"},st=["href"],lt={class:"text-xs"},it={class:"feed__redraw__mini-preview__image"},nt={class:"preview-title"},at={class:"feed__image-list"},rt={__name:"ArtworkDetail",props:{feed:{type:Object,default:()=>{}},readMore:{type:Function,default:()=>({})}},emits:["view"],setup(a){return(m,k)=>{const w=Fe;return u(),g("section",et,[i(Ee,{feed:a.feed,onReadMore:a.readMore},null,8,["feed","onReadMore"]),s("section",tt,[a.feed.redraw_of&&a.feed.redrawed_artwork_info?(u(),g("div",ot,[s("a",{href:"/a/"+a.feed.redraw_of,target:"_blank"},[s("i",lt,c(m.$t("artworks.redrawed")),1),s("div",it,[i(w,{preload:"",loading:"lazy",src:m.artworkThumb(a.feed.redrawed_artwork_info.artwork_assets.bucket,a.feed.redrawed_artwork_info.artwork_assets.filename,"thumbnail",!1),onError:m.imageLoadError},null,8,["src","onError"]),s("span",nt,c(a.feed.redrawed_artwork_info.title),1)])],8,st)])):b("",!0),s("div",at,[a.feed.type===o(_).ARTWORK?(u(),g("div",{key:0,class:"cursor-pointer",onClick:k[0]||(k[0]=ae(r=>m.$emit("view",a.feed.id),["prevent"]))},[i(Ne,{class:"image-list",work:a.feed},null,8,["work"])])):b("",!0)])])])}}},dt=J(rt,[["__scopeId","data-v-220558e0"]]);const ee=a=>(Re("data-v-8431f87f"),a=a(),Me(),a),ct={id:"feeds",class:"feeds"},ut={key:0,class:"feeds__global-following-switch"},ft={id:"interaction-button-section",class:"interactions !px-4"},_t=ee(()=>s("div",null,null,-1)),pt={class:"interactions__items"},mt=["onClick"],ht=["onClick"],gt=["onClick"],wt={class:"ellipsis-menus dropdown"},vt={type:"button","aria-haspopup":"true","aria-expanded":"true","aria-controls":"ellipsis-menus"},kt={class:"ellipsis-menus__content dropdown-menu"},yt={id:"ellipsis-menus",class:"ellipsis-menus__content__wrapper","aria-labelledby":"headlessui-menu-button-1",role:"menu"},bt=ee(()=>s("div",{class:"custom-divider"},null,-1)),$t=["onClick"],Rt={class:"loading-empty-error-message"},Mt={class:"justify-center mt-2 text-tiny hidden-md-flex"},xt={class:"mx-auto text-center"},St={class:"mx-auto mt-4 text-center"},At=ee(()=>s("br",null,null,-1)),Ft={id:"chronological-modal",class:"modal work-view"},Tt={id:"chronological-feed-modal",class:"z-30 modal work-view"},It={__name:"FeedSection",props:{fetchMode:{type:String,default:"feed"},changeMode:{type:Function,default:()=>{}}},emits:["updateFeedLength","updateShowSuggestedUsers","noData"],setup(a,{expose:m,emit:k}){const w=a,r=G(),{generateArtworkThumb:T}=ve(),{oApiConfiguration:D,fetchOptions:P}=re(),M=Te(D,P()),E=We(D,P());ke({title:Le().tl("meta.title.feed.feed")});const N=ye(),C=de(),q=be();ce(()=>{r.loggedIn||C.push({path:"/explore"})}),ue(()=>{}),Z(()=>q.query,()=>{setTimeout(()=>{me(),x().closeModal("feed-collection-selection-modal"),x().closeModal("collection-selection-modal"),x().closeModal("album-selection-modal"),x().closeModal("report-modal")},10)});const A=d({explicitMode:void 0,pagination:{page:0,perPage:10}}),$=d(!1);Z(()=>$.value,()=>{H()});const F=d(!1),I=d([]),U=async({loaded:l})=>{const[n,p]=await E.getChronologicalFeeds({fetchMode:w.fetchMode,explicitMode:A.value.explicitMode,showAllTextPost:$.value,pagination:{page:A.value.pagination.page,perPage:A.value.pagination.perPage}});if(n.feeds.length||F.value&&k("noData"),A.value.pagination.page+=1,n.feeds.length)for(let e=0;e<n.feeds.length;e++){const t=n.feeds[e];if(t.liked&&(t.type===_.ARTWORK?y.value.push("a-"+t.id):y.value.push("f-"+t.id)),t.images=[],t.apply_explicit_filter=!1,t.apply_gore_filter=!1,t.type===_.ARTWORK||t.type==="feed"&&t.artwork_share_info!=null){t.type===_.ARTWORK&&t.saved&&W.value.push(t.id);for(let v=0;v<t.artwork_assets.length;v++)if(v<=3){const we=await T(t.artwork_assets[v].bucket,t.artwork_assets[v].filename,"feed");t.images.push(we)}t.artwork_share_info!=null&&(!r.loggedIn&&t.artwork_share_info.is_explicit||t.artwork_share_info.is_explicit&&!r.user.user_settings.show_explicit)&&(t.apply_explicit_filter=!0),t.artwork_share_info!=null&&(!r.loggedIn&&t.artwork_share_info.is_gore||t.artwork_share_info.is_gore&&!r.user.user_settings.show_gore)&&(t.apply_gore_filter=!0)}I.value.push(t),k("updateFeedLength",n.feeds.length)}l(n.feeds.length,A.value.pagination.perPage)},H=()=>{A.value.pagination.page=0,I.value=[],F.value=!0},O=d(null),B=(l,n,p)=>{n?(I.value[p].apply_explicit_filter=!1,I.value[p].apply_gore_filter=!1):(O.value.view(l),x().openModal("chronological-modal"))},f=d(null),z=l=>{f.value.viewFeed(l),x().openModal("chronological-feed-modal")},Q=(l,n,p,e)=>{De().readMore(l,n,p,e)},te=d(!1);let _e;const pe=l=>{const n=d(N.public.appUrl+l),{copy:p}=Ce({source:n});p(),Oe().splash(_e,te,"copy-alert")},W=d([]),y=d([]),oe=async(l,n)=>{const p=parseInt(l.split("-")[1]);let e=!1;if(n===_.ARTWORK){const[t,v]=await M.like({workId:p});e=t}else if(n==="feed"){const[t,v]=await E.like({feedId:p});e=t}if(e){y.value.push(l);const t=document.getElementById(`feed-like-button-${n}-${p}`);t.classList.add("animate-bounce"),setInterval(()=>{t.classList.remove("animate-bounce")},2500)}},se=async(l,n)=>{const p=parseInt(l.split("-")[1]);let e=!1;if(n===_.ARTWORK){const[t,v]=await M.unlike({workId:p});e=t}else if(n==="feed"){const[t,v]=await E.unlike({feedId:p});e=t}if(e){const t=y.value.indexOf(l);y.value.splice(t,1)}},me=()=>{x().closeModal("chronological-modal"),x().closeModal("chronological-feed-modal")},X=d(null),Y=d(0),he=l=>{Y.value=l,x().openModal("feed-collection-selection-modal"),X.value.fetchCollection(),X.value.fetchCurrentSaved()},ge=l=>{if(l){const n=W.value.indexOf(Y.value);W.value.splice(n,1)}else W.value.push(Y.value);Pe().animate("save-to-collection-button-"+Y.value)};return m({refetch:H}),(l,n)=>{const p=ne;return u(),g("section",ct,[a.fetchMode=="text"?(u(),g("nav",ut,[s("button",{class:j(o($)==!1?"primary-button":"light-button"),onClick:n[0]||(n[0]=e=>$.value=!1)},[i(h,{name:"i-fluent-people-checkmark-24-regular"}),R(" "+c(l.$t("followings.followingOnly")),1)],2),s("button",{class:j(o($)==!0?"primary-button":"light-button"),onClick:n[1]||(n[1]=e=>$.value=!0)},[i(h,{name:"i-heroicons-globe-asia-australia"}),R(" "+c(l.$t("followings.global")),1)],2)])):b("",!0),(u(!0),g(le,null,ie(o(I),(e,t)=>(u(),g("section",{id:"feed-list",key:e.id+e.type,class:"feeds__list"},[i(Be,{feed:e},null,8,["feed"]),e.type===o(_).ARTWORK?(u(),V(dt,{key:0,feed:e,"feed-idx":t,"read-more":Q,onView:B},null,8,["feed","feed-idx"])):b("",!0),e.type===o(_).FEED?(u(),V(ze,{key:1,feed:e,"feed-idx":t,"read-more":Q,"view-artwork":B,onReadMore:Q},null,8,["feed","feed-idx"])):b("",!0),s("section",ft,[_t,s("div",pt,[s("div",{class:"interactions__item",onClick:v=>e.type===o(_).ARTWORK?o(y).includes("a-"+e.id)?se("a-"+e.id,e.type):oe("a-"+e.id,e.type):o(y).includes("f-"+e.id)?se("f-"+e.id,e.type):oe("f-"+e.id,e.type)},[L(i(h,{id:"feed-like-button-"+e.type+"-"+e.id,name:"i-ion-heart",class:"text-red-500 hover:text-red-500"},null,8,["id"]),[[K,e.type===o(_).ARTWORK?o(y).includes("a-"+e.id):o(y).includes("f-"+e.id)]]),L(i(h,{name:"i-ri-heart-3-line",class:"icon-color hover:text-red-500"},null,512),[[K,e.type===o(_).ARTWORK?!o(y).includes("a-"+e.id):!o(y).includes("f-"+e.id)]]),R(" "+c(l.thousand(e._count.likes)),1)],8,mt),s("div",{class:"interactions__item",onClick:ae(v=>e.type===o(_).ARTWORK?B(e.id):z(e.id),["prevent"])},[i(h,{name:"i-mdi-comment-multiple-outline",class:"icon-color hover:text-blue-500"}),R(" "+c(l.thousand(e._count.comments)),1)],8,ht),e.type===o(_).ARTWORK?(u(),g("div",{key:0,class:"interactions__item",onClick:v=>he(e.id)},[L(i(h,{id:"save-to-collection-button-"+e.id,name:"i-ion-bookmark",class:"text-blue-500 hover:text-blue-500"},null,8,["id"]),[[K,o(W).includes(e.id)]]),L(i(h,{name:"i-majesticons-bookmark-line",class:"icon-color hover:text-blue-500"},null,512),[[K,!o(W).includes(e.id)]])],8,gt)):b("",!0),s("div",wt,[s("button",vt,[i(h,{name:"i-uit-ellipsis-v"})]),s("div",kt,[s("div",yt,[i(p,{to:e.type===o(_).ARTWORK?"/a/"+e.id:"/feed/"+e.id},{default:S(()=>[i(h,{name:"i-fluent-arrow-enter-20-filled"}),R(" "+c(l.$t("open")),1)]),_:2},1032,["to"]),i(p,{to:e.type===o(_).ARTWORK?"/a/"+e.id:"/feed/"+e.id,target:"_blank"},{default:S(()=>[i(h,{name:"i-ci-external-link"}),R(" "+c(l.$t("openInNewTab")),1)]),_:2},1032,["to"]),bt,s("div",null,[s("a",{onClick:v=>pe(e.type===o(_).ARTWORK?"/a/"+e.id:"/feed/"+e.id)},[i(h,{name:"i-icon-park-outline-copy"}),R(" "+c(l.$t("copySharableLink")),1)],8,$t)])])])])])])]))),128)),i(o(Ie),{"is-initial":o(F),"onUpdate:is-initial":n[2]||(n[2]=e=>$e(F)?F.value=e:null),load:U},{loading:S(()=>[s("div",Rt,[i(h,{name:"i-line-md-loading-twotone-loop","text-size":"text-3xl"}),s("div",Mt,c(l.$t("feedLoading")),1)])]),"no-results":S(()=>[s("div",xt,c(l.$t("feeds.nothingToShow")),1)]),"no-more":S(()=>[s("div",St,[R(c(l.$t("youHaveReachedTheEnd"))+" ",1),At,R(" "+c(l.$t("feeds.followMorePeople")),1)])]),_:1},8,["is-initial"]),s("div",Ft,[i(Ke,{ref_key:"chronologicalModalViewRef",ref:O,section:"chronological"},null,512)]),s("div",Tt,[i(Ye,{ref_key:"chronologicalFeedModalViewRef",ref:f,section:"chronological-feed","is-modal":!0},null,512)]),i(Ve,{id:"feed-collection-selection-modal",ref_key:"collectionSelectionModalRef",ref:X,"modal-id":"feed-collection-selection-modal","work-id":o(Y),class:"modal",onSave:ge},null,8,["work-id"]),L(i(Ue,{id:"copy-alert",text:l.$t("linkCopied"),icon:"i-bi-check-all"},null,8,["text"]),[[K,o(te)]])])}}},Ut=J(It,[["__scopeId","data-v-8431f87f"]]);const Ct={class:"feed__left-buttons"},Ot={class:"hidden ml-3 lg:block"},Wt={class:"hidden ml-3 lg:block"},Lt={class:"hidden ml-3 lg:block"},Kt={__name:"FeedLeftSide",props:{currentView:{type:String,default:"feed"}},emits:["refetch"],setup(a,{emit:m}){G();const k=w=>{m("refetch",w)};return(w,r)=>(u(),g("div",Ct,[s("button",{class:j(["left-button",a.currentView=="feed"?"theme-colored":"theme-color"]),onClick:r[0]||(r[0]=T=>k("feed"))},[i(h,{name:"i-akar-icons-home"}),s("span",Ot,c(w.$t("feeds.all")),1)],2),s("button",{class:j(["left-button",a.currentView=="text"?"theme-colored":"theme-color"]),onClick:r[1]||(r[1]=T=>k("text"))},[i(h,{name:"i-ion-text-sharp"}),s("span",Wt,c(w.$t("feeds.textOnly")),1)],2),s("button",{class:j(["left-button",a.currentView==o(_).ARTWORK?"theme-colored":"theme-color"]),onClick:r[2]||(r[2]=T=>k(o(_).ARTWORK))},[i(h,{name:"i-gg-image"}),s("span",Lt,c(w.$t("feeds.artworkOnly")),1)],2)]))}},Vt=J(Kt,[["__scopeId","data-v-cdbb7d0f"]]),Dt={id:"middle"},Pt={key:0},Et=s("div",null,null,-1),Nt={key:0},Bt={class:"title"},ao={__name:"index",setup(a){const m=G(),{oApiConfiguration:k,fetchOptions:w}=re(),r=Se(k,w()),T=de();ce(()=>{m.loggedIn||T.push("/explore")}),ue(async()=>{m.loggedIn?(await q(),await E()):T.push("/explore")});const D=xe(()=>M.value?N.value:!M.value),P=d(!0),M=d(!1),E=async()=>{M.value=!1;const[f,z]=await r.countFollowings(m.user.id);z?M.value=!1:M.value=f>0,P.value=!1},N=d(!1),C=d([]),q=async()=>{const[f,z]=await r.getSuggestedUsersToFollow();f.length&&(C.value=f)},A=f=>{N.value=f},$=d("feed"),F=d(null),I=f=>{$.value=f,F.value.refetch(),O.value=!1},U=d(0),H=f=>{U.value=f};Z(()=>U.value,()=>{U.value||(N.value=!0)});const O=d(!1),B=()=>{O.value=!0};return(f,z)=>(u(),V(Ae,{"with-footer":!0,"hide-side":o(D)&&f.isMobile()?!0:f.isMobileDevice(),"no-right-side":f.isMobile(),"is-no-data":o(O)},{"left-side":S(()=>[o(U)?(u(),V(Vt,{key:0,"current-view":o($),onRefetch:I},null,8,["current-view"])):b("",!0)]),"right-side":S(()=>[Et,o(U)&&o(C).length?(u(),g("div",Nt,[s("div",Bt,c(f.$t("feeds.suggestedUsers")),1),i(fe,{users:o(C),"column-type":1,class:"mt-4"},null,8,["users"])])):b("",!0)]),default:S(()=>[s("section",Dt,[o(P)?b("",!0):(u(),g("div",Pt,[o(D)?(u(),V(Ge,{key:0,"suggested-users-to-follow":o(C)},null,8,["suggested-users-to-follow"])):b("",!0),L(i(Ut,{ref_key:"feedRef",ref:F,"fetch-mode":o($),onUpdateFeedLength:H,onUpdateShowSuggestedUsers:A,onNoData:B},null,8,["fetch-mode"]),[[K,o(M)]])]))])]),_:1},8,["hide-side","no-right-side","is-no-data"]))}};export{ao as default};
