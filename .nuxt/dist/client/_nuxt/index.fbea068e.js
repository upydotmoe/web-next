import{o as r,m as c,i as se,aa as ie,j as ae,ai as le,H as re,k as ne,T as ce,a as de,a9 as ue,l as pe,D as _e,r as v,c as H,e as s,w as n,ac as he,b as x,v as f,p as t,V as me,U as ve,u as A,K as k,t as l,q as _,G as w,W as ke,s as d,F as y,J as M,L as we,M as xe,x as fe}from"./entry.0330daa5.js";import{u as ge}from"./useArtwork.3ef797ef.js";import{a as ye}from"./useFeed.e06a7783.js";import{u as be}from"./useI18n.4634fe72.js";import{S as Me,M as Ce,a as $e,u as Ie,b as Se,c as Le,d as Ae}from"./ModalView.e8f58535.js";import{L as Fe,J as Te}from"./Layout.95a54192.js";import{F as Re,I as F}from"./FeedModalView.ad430ea4.js";import{_ as j}from"./_plugin-vue_export-helper.a1a6add7.js";import"./LoadingEmptyErrorMessage.265d2132.js";import"./Spinner.bde24df9.js";import"./user-counters-api.f82a6d2e.js";const Ve={};function Ee($,g){return r(),c("div")}const He=j(Ve,[["render",Ee]]);const C=$=>(we("data-v-95cd3729"),$=$(),xe(),$),Be={class:"mx-auto w-full"},Ne={class:"grid grid-cols-1 gap-1 mx-auto md:gap-2 xl:w-10/12"},De={class:"flex flex-row rounded-md theme-color"},Oe={class:"w-full"},Pe={key:0,class:"p-2 md:p-4 user-info"},Ue=["src"],ze={class:"name"},Ge=C(()=>t("br",null,null,-1)),je=C(()=>t("span",{class:"mx-1"},"\xB7",-1)),qe={key:1,class:"px-2 mt-2 md:px-4"},Je={class:"text-xs font-semibold"},Ke=["id","innerHTML"],We=["id","onClick"],Qe=["onClick"],Xe={key:2,class:"px-2 md:px-4"},Ye=["innerHTML","id"],Ze=["id","onClick"],eo={key:1,class:"my-2 w-full rounded-md theme-color-secondary"},oo={key:0,class:"p-2 md:p-4 user-info"},to=["src"],so={class:"name"},io=C(()=>t("br",null,null,-1)),ao=C(()=>t("span",{class:"mx-1"},"\xB7",-1)),lo={class:"px-2 mt-2 md:px-4"},ro={class:"text-xs font-semibold"},no=["id","innerHTML"],co=["id","onClick"],uo=["onClick"],po={key:0,class:"p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color"},_o={class:"mx-auto mt-2 primary-button"},ho={key:0,class:"p-2 mx-auto w-full text-center rounded-md opacity-90 theme-color"},mo={class:"mx-auto mt-2 primary-button"},vo={class:"float-right mx-4 mt-2 interactions"},ko={key:0,class:"reactions"},wo=["onClick"],xo=["onClick"],fo=["onClick"],go={class:"option dropdown"},yo={type:"button","aria-haspopup":"true","aria-expanded":"true","aria-controls":"option-dropdown-items"},bo={class:"option-dropdown dropdown-menu"},Mo={id:"option-dropdown-items",class:"w-52 toggler","aria-labelledby":"option-dropdown-buttons",role:"menu"},Co={class:"menu-wrapper"},$o=C(()=>t("div",{class:"custom-divider"},null,-1)),Io=["onClick"],So={class:"mx-auto text-center"},Lo={class:"mx-auto text-center"},Ao={class:"mx-auto text-center"},Fo=C(()=>t("br",null,null,-1)),To={id:"chronological-modal",class:"modal work-view"},Ro={id:"chronological-feed-modal",class:"z-30 modal work-view"},Vo={__name:"index",props:{changeMode:{type:Function,default:()=>{}}},setup($){const g=se(),{generateArtworkThumb:q}=ie(),{oApiConfiguration:B,fetchOptions:N}=ae(),D=ge(B,N()),T=ye(B,N());le({title:be().tl("meta.title.feed.feed")});const J=re(),K=ne(),W=ce();de(),ue(()=>{g.loggedIn||K.push({path:"/explore"})}),pe(()=>{}),_e(()=>W.query,()=>{ee(),w().closeModal("feed-collection-selection-modal"),w().closeModal("collection-selection-modal"),w().closeModal("album-selection-modal"),w().closeModal("report-modal")});const I=v({explicitMode:void 0,pagination:{page:0,perPage:10}}),R=v([]),Q=async({loaded:o})=>{const[a,i]=await T.getChronologicalFeeds({explicitMode:I.value.explicitMode,pagination:{page:I.value.pagination.page,perPage:I.value.pagination.perPage}});I.value.pagination.page+=1;for(let u=0;u<a.feeds.length;u++){const e=a.feeds[u];if(e.liked&&(e.type==="artwork"?m.value.push("a-"+e.id):m.value.push("f-"+e.id)),e.images=[],e.apply_explicit_filter=!1,e.type==="artwork"||e.type==="feed"&&e.artwork_share_info!=null){e.type==="artwork"&&e.saved&&b.value.push(e.id);for(let h=0;h<e.artwork_assets.length;h++)if(h<=3){const p=await q(e.artwork_assets[h].bucket,e.artwork_assets[h].filename,"feed");e.images.push(p)}e.artwork_share_info!=null&&(!g.loggedIn&&e.artwork_share_info.is_explicit||e.artwork_share_info.is_explicit&&!g.user.user_settings.show_explicit)&&(e.apply_explicit_filter=!0)}R.value.push(e)}o(a.feeds.length,I.value.pagination.perPage)},O=v(null),L=(o,a,i)=>{a?R.value[i].apply_explicit_filter=!1:(O.value.view(o),w().openModal("chronological-modal"))},P=v(null),X=o=>{P.value.view(o),w().openModal("chronological-feed-modal")},V=(o,a,i,u)=>{Se().readMore(o,a,i,u)},U=v(!1);let Y;const Z=o=>{const a=v(J.public.appUrl+o),{copy:i}=Le({source:a});i(),Ae().splash(Y,U,"copy-alert")},b=v([]),m=v([]),z=async(o,a)=>{const i=parseInt(o.split("-")[1]);let u=!1;if(a==="artwork"){const[e,h]=await D.like({workId:i});u=e}else if(a==="feed"){const[e,h]=await T.like({feedId:i});u=e}if(u){m.value.push(o);const e=document.getElementById(`feed-like-button-${a}-${i}`);e.classList.add("animate-bounce"),setInterval(()=>{e.classList.remove("animate-bounce")},2500)}},G=async(o,a)=>{const i=parseInt(o.split("-")[1]);let u=!1;if(a==="artwork"){const[e,h]=await D.unlike({workId:i});u=e}else if(a==="feed"){const[e,h]=await T.unlike({feedId:i});u=e}if(u){const e=m.value.indexOf(o);m.value.splice(e,1)}},ee=()=>{w().closeModal("chronological-modal"),w().closeModal("chronological-feed-modal")},E=v(null),S=v(0),oe=o=>{S.value=o,w().openModal("feed-collection-selection-modal"),E.value.fetchCollection(),E.value.fetchCurrentSaved()},te=o=>{if(o){const a=b.value.indexOf(S.value);b.value.splice(a,1)}else b.value.push(S.value);Ie().animate("save-to-collection-button-"+S.value)};return(o,a)=>{const i=fe,u=ke;return r(),H(he,null,[s(Fe,{"with-footer":!0,"hide-side":o.isMobile()},{"right-side":n(()=>[s(He)]),default:n(()=>[x(s(Me,{id:"copy-alert",text:o.$t("linkCopied"),icon:"i-bi-check-all"},null,8,["text"]),[[f,U.value]]),t("div",Be,[t("div",Ne,[(r(!0),c(ve,null,me(R.value,(e,h)=>(r(),c("div",{key:e.id+e.type,class:"rounded-md lg:mx-6"},[t("div",De,[t("div",Oe,[e.users?(r(),c("div",Pe,[s(i,{to:"/profile/"+e.users.username},{default:n(()=>[t("img",{class:"avatar",src:o.avatarCoverUrl(e.users.avatar_bucket,e.users.avatar_filename),onError:a[0]||(a[0]=(...p)=>o.imageLoadError&&o.imageLoadError(...p))},null,40,Ue)]),_:2},1032,["to"]),t("div",ze,[s(i,{to:"/profile/"+e.users.username,class:"fullname hover:href"},{default:n(()=>[_(l(e.users.name),1)]),_:2},1032,["to"]),Ge,s(i,{to:"/profile/"+e.users.username,class:"hover:underline text-xxs"},{default:n(()=>[_(" @"+l(e.users.username),1)]),_:2},1032,["to"]),je,s(i,{to:(e.type==="artwork"?"/a/":"/feed/")+e.id,class:"hover:underline text-xxs"},{default:n(()=>[_(l(o.formatDate(e.scheduled_post?e.scheduled_post:e.created_at,!0)),1)]),_:2},1032,["to"])])])):d("",!0),e.type==="artwork"?(r(),c("div",qe,[t("span",Je,l(e.title),1),x(t("p",null,[t("span",{id:"feed-description-"+e.id,innerHTML:e.description.length>300?`${e.description.slice(0,300)}...`:e.description},null,8,Ke),e.description.length>300?(r(),c("a",{key:0,id:"feed-read-more-"+e.id,class:"href",onClick:y(p=>V(e.description,e.id,"feed-read-more-","feed-description-"),["prevent"])},l(o.$t("readMore")),9,We)):d("",!0)],512),[[f,e.description]])])):d("",!0),t("div",null,[t("div",null,[e.type==="artwork"&&!o.isMobile()?(r(),c("div",{key:0,class:"cursor-pointer",onClick:y(p=>L(e.id),["prevent"])},[s(F,{class:"p-2 md:p-4",work:e},null,8,["work"])],8,Qe)):d("",!0),e.type==="artwork"&&o.isMobile()?(r(),H(i,{key:1,to:"/a/"+e.id,class:"cursor-pointer"},{default:n(()=>[s(F,{class:"p-2",work:e},null,8,["work"])]),_:2},1032,["to"])):d("",!0)])]),e.type==="feed"?(r(),c("div",Xe,[x(t("p",{innerHTML:e.text.split("<br>").length>3&&e.text.length>300?`${e.text.slice(0,300)}...`:e.text,id:"feed-text-"+e.id,class:M(["mt-2",{"mb-2":!e.artwork_share_info}])},null,10,Ye),[[f,e.text]]),e.text.split("<br>").length>3&&e.text.length>300?(r(),c("a",{key:0,id:"feed-read-more-"+e.id,class:"href",onClick:y(p=>V(e.text,e.id,"feed-read-more-","feed-text-"),["prevent"])},l(o.$t("readMore")),9,Ze)):d("",!0),e.artwork_share_info?(r(),c("div",eo,[e.artwork_share_info.user?(r(),c("div",oo,[s(i,{to:"/profile/"+e.artwork_share_info.user.username},{default:n(()=>[t("img",{class:"avatar",src:o.avatarCoverUrl(e.artwork_share_info.user.avatar_bucket,e.artwork_share_info.user.avatar_filename),onError:a[1]||(a[1]=(...p)=>o.imageLoadError&&o.imageLoadError(...p))},null,40,to)]),_:2},1032,["to"]),t("div",so,[s(i,{to:"/profile/"+e.artwork_share_info.user.username,class:"fullname hover:href"},{default:n(()=>[_(l(e.artwork_share_info.user.name),1)]),_:2},1032,["to"]),io,s(i,{to:"/profile/"+e.artwork_share_info.user.username,class:"hover:underline text-xxs"},{default:n(()=>[_(" @"+l(e.artwork_share_info.user.username),1)]),_:2},1032,["to"]),ao,s(i,{to:"/a/"+e.artwork_share_info.id,class:"hover:underline text-xxs"},{default:n(()=>[_(l(o.formatDate(e.artwork_share_info.scheduled_post?e.artwork_share_info.scheduled_post:e.artwork_share_info.created_at,!0)),1)]),_:2},1032,["to"])])])):d("",!0),t("div",lo,[t("span",ro,l(e.artwork_share_info.title),1),x(t("p",null,[t("span",{id:"feed-description-"+e.artwork_share_info.id,innerHTML:e.artwork_share_info.description.length>300?`${e.artwork_share_info.description.slice(0,300)}...`:e.artwork_share_info.description},null,8,no),e.artwork_share_info.description.length>300?(r(),c("a",{key:0,id:"feed-read-more-"+e.artwork_share_info.id,class:"href",onClick:y(p=>V(e.artwork_share_info.description,e.artwork_share_info.id,"feed-read-more-","feed-description-"),["prevent"])},l(o.$t("readMore")),9,co)):d("",!0)],512),[[f,e.artwork_share_info.description]])]),t("div",null,[o.isMobile()?d("",!0):(r(),c("div",{key:0,class:M(["p-2",{"cursor-pointer":!e.apply_explicit_filter}]),onClick:y(p=>L(e.artwork_share_info.id,e.apply_explicit_filter,h),["prevent"])},[t("div",{class:M(["overflow-hidden relative p-2 rounded-md",{"md:mx-2":e.apply_explicit_filter}])},[s(F,{class:M([{"blur-3xl unclickable":e.apply_explicit_filter},e.apply_explicit_filter?"brightness-50":"brightness-100"]),work:e},null,8,["class","work"]),e.apply_explicit_filter?(r(),c("div",po,[t("div",null,l(A(g).loggedIn?o.$t("explicitContentAlert"):o.$t("explicitContentAlertForGuest")),1),t("button",_o,l(o.$t("explicitShowMeThisContent")),1)])):d("",!0)],2)],10,uo)),o.isMobile()?(r(),H(i,{key:1,to:e.apply_explicit_filter?null:"/a/"+e.artwork_share_info.id,onClick:y(p=>L(e.artwork_share_info.id,e.apply_explicit_filter,h),["prevent"]),class:"cursor-pointer"},{default:n(()=>[t("div",{class:M(["overflow-hidden relative p-2 rounded-md",{"m-2":e.apply_explicit_filter}])},[s(F,{class:M([{"blur-3xl unclickable":e.apply_explicit_filter},e.apply_explicit_filter?"brightness-50":"brightness-100"]),work:e},null,8,["class","work"]),e.apply_explicit_filter?(r(),c("div",ho,[t("div",null,l(A(g).loggedIn?o.$t("explicitContentAlert"):o.$t("explicitContentAlertForGuest")),1),t("button",mo,l(o.$t("explicitShowMeThisContent")),1)])):d("",!0)],2)]),_:2},1032,["to","onClick"])):d("",!0)])])):d("",!0)])):d("",!0),t("div",vo,[A(g).loggedIn?(r(),c("div",ko,[t("span",{onClick:p=>e.type==="artwork"?m.value.includes("a-"+e.id)?G("a-"+e.id,e.type):z("a-"+e.id,e.type):m.value.includes("f-"+e.id)?G("f-"+e.id,e.type):z("f-"+e.id,e.type)},[x(s(k,{id:"feed-like-button-"+e.type+"-"+e.id,name:"i-ion-heart",class:"mr-1 text-red-500 hover:text-red-500"},null,8,["id"]),[[f,e.type==="artwork"?m.value.includes("a-"+e.id):m.value.includes("f-"+e.id)]]),x(s(k,{name:"i-ri-heart-3-line",class:"mr-1 icon-color hover:text-red-500"},null,512),[[f,e.type==="artwork"?!m.value.includes("a-"+e.id):!m.value.includes("f-"+e.id)]]),_(" "+l(o.thousand(e._count.likes)),1)],8,wo),t("span",{onClick:y(p=>e.type==="artwork"?L(e.id):X(e.id),["prevent"])},[s(k,{name:"i-mdi-comment-multiple-outline",class:"mr-1 icon-color hover:text-blue-500"}),_(" "+l(o.thousand(e._count.comments)),1)],8,xo),e.type==="artwork"?(r(),c("span",{key:0,onClick:p=>oe(e.id)},[x(s(k,{id:"save-to-collection-button-"+e.id,name:"i-ion-bookmark",class:"text-blue-500 hover:text-blue-500"},null,8,["id"]),[[f,b.value.includes(e.id)]]),x(s(k,{name:"i-majesticons-bookmark-line",class:"icon-color hover:text-blue-500"},null,512),[[f,!b.value.includes(e.id)]])],8,fo)):d("",!0),t("div",go,[t("button",yo,[t("span",null,[s(k,{name:"i-uit-ellipsis-v",class:"align-middle icon icon-color"})])]),t("div",bo,[t("div",Mo,[t("div",Co,[s(i,{to:e.type==="artwork"?"/a/"+e.id:"/feed/"+e.id,class:"flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"},{default:n(()=>[s(k,{name:"i-fluent-arrow-enter-20-filled",class:"mr-2 text-base"}),_(" "+l(o.$t("open")),1)]),_:2},1032,["to"]),s(i,{to:e.type==="artwork"?"/a/"+e.id:"/feed/"+e.id,target:"_blank",class:"flex z-20 py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"},{default:n(()=>[s(k,{name:"i-ci-external-link",class:"mr-2 text-base"}),_(" "+l(o.$t("openInNewTab")),1)]),_:2},1032,["to"]),$o,t("a",{class:"flex py-2 px-3 w-full leading-4 rounded-md transition-all duration-150 cursor-pointer hover:button-color parent-icon hover:text-white",onClick:p=>Z(e.type==="artwork"?"/a/"+e.id:"/feed/"+e.id)},[s(k,{name:"i-icon-park-outline-copy",class:"mr-2 text-base"}),_(" "+l(o.$t("copySharableLink")),1)],8,Io)])])])])])):d("",!0)])])])]))),128)),s(u,null,{default:n(()=>[s(A(Te),{class:"mt-6",load:Q},{loading:n(()=>[t("div",So,[s(k,{name:"i-line-md-loading-twotone-loop",class:"text-3xl"})])]),"no-results":n(()=>[t("div",Lo,l(o.$t("feeds.nothingToShow")),1)]),"no-more":n(()=>[t("div",Ao,[_(l(o.$t("youHaveReachedTheEnd"))+" ",1),Fo,_(" "+l(o.$t("feeds.followMorePeople")),1)])]),_:1})]),_:1}),t("div",To,[s(Ce,{ref_key:"chronologicalModalViewRef",ref:O,section:"chronological"},null,512)]),t("div",Ro,[s(Re,{ref_key:"chronologicalFeedModalViewRef",ref:P,section:"chronological-feed"},null,512)]),s($e,{id:"feed-collection-selection-modal","modal-id":"feed-collection-selection-modal",ref_key:"collectionSelectionModalRef",ref:E,"work-id":S.value,class:"modal",onSave:te},null,8,["work-id"])])])]),_:1},8,["hide-side"])],1024)}}},qo=j(Vo,[["__scopeId","data-v-95cd3729"]]);export{qo as default};