import{o as c,l as u,aa as to,h as so,a2 as ao,i as io,H as ro,a as lo,k as no,D as co,r as m,c as A,b as s,w as n,a4 as uo,s as v,v as w,m as t,T as po,S as _o,u as H,t as i,p as _,G as x,U as ho,q as p,F as C,J as L,K as mo,L as ko,x as vo}from"./entry.ad06e1ba.js";import{u as wo}from"./useI18n.37b7849f.js";import{u as fo,_ as k}from"./Icon.e0cdb306.js";import{u as go}from"./useFeed.8d32ccfa.js";import{S as xo,M as yo,a as bo,u as Mo,b as Co,c as Io,d as $o}from"./ModalView.c513d210.js";import{L as So,J as Fo}from"./Layout.6703c364.js";import{F as Ao,I as $}from"./FeedModalView.15cfaec6.js";import{_ as J}from"./_plugin-vue_export-helper.a1a6add7.js";import"./ErrorMessages.3c3f2d85.js";import"./Spinner.e2f247d9.js";import"./user-counters-api.0094ae2a.js";const Lo={};function Ro(y,I){return c(),u("div")}const Vo=J(Lo,[["render",Ro]]);const f=y=>(mo("data-v-88943b1e"),y=y(),ko(),y),Eo={class:"mx-auto w-full"},To={class:"grid grid-cols-1 gap-1 mx-auto md:gap-2 xl:w-11/12"},Bo={class:"flex flex-row rounded-md theme-color"},No={class:"w-full"},Do={key:0,class:"p-2 md:p-4 user-info"},Oo=["src"],Po={class:"name"},Uo=f(()=>t("br",null,null,-1)),zo=f(()=>t("span",{class:"mx-1"},"\xB7",-1)),Ho={key:1,class:"px-2 mt-2 md:px-4"},Jo={class:"text-xs font-semibold"},Ko=["id"],jo=["id","onClick"],qo=["onClick"],Go={key:2,class:"px-2 md:px-4"},Wo={key:0,class:"my-2 w-full rounded-md theme-color-secondary"},Qo={key:0,class:"p-2 md:p-4 user-info"},Xo=["src"],Yo={class:"name"},Zo=f(()=>t("br",null,null,-1)),oe=f(()=>t("span",{class:"mx-1"},"\xB7",-1)),ee={class:"px-2 mt-2 md:px-4"},te={class:"text-xs font-semibold"},se=["id"],ae=["id","onClick"],ie=["onClick"],re={class:"overflow-hidden relative p-2 rounded-md md:p-4"},le={key:0,class:"p-2 w-full mx-auto text-center rounded-md opacity-90 theme-color"},ne=f(()=>t("button",{class:"mx-auto mt-2 primary-button"},"Show me this content",-1)),ce={class:"float-right mx-4 mt-2 interactions"},de={key:0,class:"reactions"},ue=["onClick"],pe=["onClick"],_e=["onClick"],he={class:"option dropdown"},me={type:"button","aria-haspopup":"true","aria-expanded":"true","aria-controls":"option-dropdown-items"},ke={class:"option-dropdown dropdown-menu"},ve={id:"option-dropdown-items",class:"w-52 toggler","aria-labelledby":"option-dropdown-buttons",role:"menu"},we={class:"menu-wrapper"},fe=f(()=>t("div",{class:"custom-divider"},null,-1)),ge=["onClick"],xe={class:"mx-auto text-center"},ye={class:"mx-auto text-center"},be={class:"mx-auto text-center"},Me=f(()=>t("br",null,null,-1)),Ce={id:"chronological-modal",class:"modal work-view"},Ie={id:"chronological-feed-modal",class:"z-30 modal work-view"},$e={__name:"index",props:{changeMode:{type:Function,default:()=>{}}},setup(y){to({title:wo().tl("meta.title.feed")});const I=so(),{generateArtworkThumb:K}=ao(),{oApiConfiguration:R,fetchOptions:V}=io(),E=fo(R,V()),S=go(R,V()),j=ro(),{$router:q}=lo();no(()=>{}),co(()=>q.currentRoute.value.params.path,()=>{Y(),x().closeModal("feed-collection-selection-modal")});const b=m({explicitMode:void 0,pagination:{page:0,perPage:10}}),T=m([]),G=async({loaded:e})=>{const[r,a]=await S.getChronologicalFeeds({explicitMode:b.value.explicitMode,pagination:{page:b.value.pagination.page,perPage:b.value.pagination.perPage}});b.value.pagination.page+=1;for(let d=0;d<r.feeds.length;d++){const o=r.feeds[d];if(o.liked&&(o.type==="artwork"?h.value.push("a-"+o.id):h.value.push("f-"+o.id)),o.images=[],o.apply_explicit_filter=!1,o.type==="artwork"||o.type==="feed"&&o.artwork_share_info!=null){o.type==="artwork"&&o.saved&&g.value.push(o.id);for(let l=0;l<o.artwork_assets.length;l++)if(l<=3){const eo=await K(o.artwork_assets[l].bucket,o.artwork_assets[l].filename,"feed");o.images.push(eo)}o.artwork_share_info!=null&&(!I.loggedIn&&o.artwork_share_info.is_explicit||o.artwork_share_info.is_explicit&&!I.user.user_settings.show_explicit)&&(o.apply_explicit_filter=!0)}T.value.push(o)}e(r.feeds.length,b.value.pagination.perPage)},B=m(null),F=e=>{B.value.view(e),x().openModal("chronological-modal")},N=m(null),W=e=>{N.value.view(e),x().openModal("chronological-feed-modal")},D=(e,r,a,d)=>{Co().readMore(e,r,a,d)},O=m(!1);let Q;const X=e=>{const r=m(j.public.appUrl+e),{copy:a}=Io({source:r});a(),$o().splash(Q,O,"copy-alert")},g=m([]),h=m([]),P=async(e,r)=>{const a=parseInt(e.split("-")[1]);let d=!1;if(r==="artworks"){const[o,l]=await E.like({workId:a});d=o}else if(r==="feeds"){const[o,l]=await S.like({feedId:a});d=o}if(d){h.value.push(e);const o=document.getElementById(`feed-like-button-${r}-${a}`);o.classList.add("animate-bounce"),setInterval(()=>{o.classList.remove("animate-bounce")},2500)}},U=async(e,r)=>{const a=parseInt(e.split("-")[1]);let d=!1;if(r==="artworks"){const[o,l]=await E.unlike({workId:a});d=o}else if(r==="feeds"){const[o,l]=await S.unlike({feedId:a});d=o}if(d){const o=h.value.indexOf(e);h.value.splice(o,1)}},Y=()=>{x().closeModal("chronological-modal"),x().closeModal("chronological-feed-modal")},z=m(null),M=m(0),Z=e=>{M.value=e,x().openModal("feed-collection-selection-modal"),z.value.fetchCurrentSaved()},oo=e=>{if(e){const r=g.value.indexOf(M.value);g.value.splice(r,1)}else g.value.push(M.value);Mo().animate("save-to-collection-button-"+M.value)};return(e,r)=>{const a=vo,d=ho;return c(),A(uo,null,[s(So,{"with-footer":!0,"hide-side":e.isMobile()},{"right-side":n(()=>[s(Vo)]),default:n(()=>[v(s(xo,{id:"copy-alert",text:e.$t("linkCopied"),icon:"i-bi-check-all"},null,8,["text"]),[[w,O.value]]),t("div",Eo,[t("div",To,[(c(!0),u(_o,null,po(T.value,o=>(c(),u("div",{key:o.id+o.type,class:"rounded-md lg:mx-6"},[t("div",Bo,[t("div",No,[o.users?(c(),u("div",Do,[s(a,{to:"/profile/"+o.users.username},{default:n(()=>[t("img",{class:"avatar",src:e.avatarCoverUrl(o.users.avatar_bucket,o.users.avatar_filename),onError:r[0]||(r[0]=(...l)=>e.imageLoadError&&e.imageLoadError(...l))},null,40,Oo)]),_:2},1032,["to"]),t("div",Po,[s(a,{to:"/profile/"+o.users.username,class:"fullname hover:href"},{default:n(()=>[_(i(o.users.name),1)]),_:2},1032,["to"]),Uo,s(a,{to:"/profile/"+o.users.username,class:"hover:underline text-xxs"},{default:n(()=>[_(" @"+i(o.users.username),1)]),_:2},1032,["to"]),zo,s(a,{to:(o.type==="artwork"?"/a/":"/feed/")+o.id,class:"hover:underline text-xxs"},{default:n(()=>[_(i(e.formatDate(o.scheduled_post?o.scheduled_post:o.created_at,!0)),1)]),_:2},1032,["to"])])])):p("",!0),o.type==="artwork"?(c(),u("div",Ho,[t("span",Jo,i(o.title),1),v(t("p",null,[t("span",{id:"feed-description-"+o.id},i(o.description.length>300?`${o.description.slice(0,300)}...`:o.description),9,Ko),o.description.length>300?(c(),u("a",{key:0,id:"feed-read-more-"+o.id,class:"href",onClick:C(l=>D(o.description,o.id,"feed-read-more-","feed-description-"),["prevent"])},i(e.$t("readMore")),9,jo)):p("",!0)],512),[[w,o.description]])])):p("",!0),t("div",null,[t("div",null,[o.type==="artwork"&&!e.isMobile()?(c(),u("div",{key:0,class:"cursor-pointer",onClick:C(l=>F(o.id),["prevent"])},[s($,{class:"p-2 md:p-4",work:o},null,8,["work"])],8,qo)):p("",!0),o.type==="artwork"&&e.isMobile()?(c(),A(a,{key:1,to:"/a/"+o.id,class:"cursor-pointer"},{default:n(()=>[s($,{class:"p-2",work:o},null,8,["work"])]),_:2},1032,["to"])):p("",!0)])]),o.type==="feed"?(c(),u("div",Go,[v(t("p",{class:L(["mt-2",{"mb-2":!o.artwork_share_info}])},i(o.text),3),[[w,o.text]]),o.artwork_share_info?(c(),u("div",Wo,[o.artwork_share_info.user?(c(),u("div",Qo,[s(a,{to:"/profile/"+o.artwork_share_info.user.username},{default:n(()=>[t("img",{class:"avatar",src:e.avatarCoverUrl(o.artwork_share_info.user.avatar_bucket,o.artwork_share_info.user.avatar_filename),onError:r[1]||(r[1]=(...l)=>e.imageLoadError&&e.imageLoadError(...l))},null,40,Xo)]),_:2},1032,["to"]),t("div",Yo,[s(a,{to:"/profile/"+o.artwork_share_info.user.username,class:"fullname hover:href"},{default:n(()=>[_(i(o.artwork_share_info.user.name),1)]),_:2},1032,["to"]),Zo,s(a,{to:"/profile/"+o.artwork_share_info.user.username,class:"hover:underline text-xxs"},{default:n(()=>[_(" @"+i(o.artwork_share_info.user.username),1)]),_:2},1032,["to"]),oe,s(a,{to:"/a/"+o.artwork_share_info.id,class:"hover:underline text-xxs"},{default:n(()=>[_(i(e.formatDate(o.artwork_share_info.scheduled_post?o.artwork_share_info.scheduled_post:o.artwork_share_info.created_at,!0)),1)]),_:2},1032,["to"])])])):p("",!0),t("div",ee,[t("span",te,i(o.artwork_share_info.title),1),v(t("p",null,[t("span",{id:"feed-description-"+o.artwork_share_info.id},i(o.artwork_share_info.description.length>300?`${o.artwork_share_info.description.slice(0,300)}...`:o.artwork_share_info.description),9,se),o.artwork_share_info.description.length>300?(c(),u("a",{key:0,id:"feed-read-more-"+o.artwork_share_info.id,class:"href",onClick:C(l=>D(o.artwork_share_info.description,o.artwork_share_info.id,"feed-read-more-","feed-description-"),["prevent"])},i(e.$t("readMore")),9,ae)):p("",!0)],512),[[w,o.artwork_share_info.description]])]),t("div",null,[e.isMobile()?p("",!0):(c(),u("div",{key:0,class:"p-2 cursor-pointer",onClick:C(l=>F(o.artwork_share_info.id),["prevent"])},[t("div",re,[s($,{class:L([{"blur-3xl unclickable":o.apply_explicit_filter},o.apply_explicit_filter?"brightness-50":"brightness-100"]),work:o},null,8,["class","work"]),o.apply_explicit_filter?(c(),u("div",le,[t("div",null,i(e.$t("explicitContentAlert")),1),ne])):p("",!0)])],8,ie)),e.isMobile()?(c(),A(a,{key:1,to:"/a/"+o.artwork_share_info.id,class:"cursor-pointer"},{default:n(()=>[s($,{class:L(["p-2",{"blur-sm unclickable":o.apply_explicit_filter},o.apply_explicit_filter?"brightness-50":"brightness-100"]),work:o},null,8,["class","work"])]),_:2},1032,["to"])):p("",!0)])])):p("",!0)])):p("",!0),t("div",ce,[H(I).loggedIn?(c(),u("div",de,[t("span",{onClick:l=>o.type==="artwork"?h.value.includes("a-"+o.id)?U("a-"+o.id,o.type):P("a-"+o.id,o.type):h.value.includes("f-"+o.id)?U("f-"+o.id,o.type):P("f-"+o.id,o.type)},[v(s(k,{id:"feed-like-button-"+o.type+"-"+o.id,name:"i-ion-heart",class:"mr-1 text-red-500 hover:text-red-500"},null,8,["id"]),[[w,o.type==="artwork"?h.value.includes("a-"+o.id):h.value.includes("f-"+o.id)]]),v(s(k,{name:"i-ion-heart-outline",class:"mr-1 icon-color hover:text-red-500"},null,512),[[w,o.type==="artwork"?!h.value.includes("a-"+o.id):!h.value.includes("f-"+o.id)]]),_(" "+i(e.thousand(o._count.likes)),1)],8,ue),t("span",{onClick:C(l=>o.type==="artwork"?F(o.id):W(o.id),["prevent"])},[s(k,{name:"i-mdi-comment-multiple-outline",class:"mr-1 icon-color hover:text-blue-500"}),_(" "+i(e.thousand(o._count.comments)),1)],8,pe),o.type==="artwork"?(c(),u("span",{key:0,onClick:l=>Z(o.id)},[v(s(k,{id:"save-to-collection-button-"+o.id,name:"i-ion-bookmark",class:"text-blue-500 hover:text-blue-500"},null,8,["id"]),[[w,g.value.includes(o.id)]]),v(s(k,{name:"i-majesticons-bookmark-line",class:"icon-color hover:text-blue-500"},null,512),[[w,!g.value.includes(o.id)]])],8,_e)):p("",!0),t("div",he,[t("button",me,[t("span",null,[s(k,{name:"i-uit-ellipsis-v",class:"align-middle icon icon-color"})])]),t("div",ke,[t("div",ve,[t("div",we,[s(a,{to:o.type==="artwork"?"/a/"+o.id:"/feed/"+o.id,class:"flex py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"},{default:n(()=>[s(k,{name:"i-fluent-arrow-enter-20-filled",class:"mr-2 text-base"}),_(" "+i(e.$t("open")),1)]),_:2},1032,["to"]),s(a,{to:o.type==="artwork"?"/a/"+o.id:"/feed/"+o.id,target:"_blank",class:"flex z-20 py-2 px-3 w-full rounded-md transition-all duration-150 hover:button-color parent-icon hover:text-white"},{default:n(()=>[s(k,{name:"i-ci-external-link",class:"mr-2 text-base"}),_(" "+i(e.$t("openInNewTab")),1)]),_:2},1032,["to"]),fe,t("a",{class:"flex py-2 px-3 w-full leading-4 rounded-md transition-all duration-150 cursor-pointer hover:button-color parent-icon hover:text-white",onClick:l=>X(o.type==="artwork"?"/a/"+o.id:"/feed/"+o.id)},[s(k,{name:"i-icon-park-outline-copy",class:"mr-2 text-base"}),_(" "+i(e.$t("copySharableLink")),1)],8,ge)])])])])])):p("",!0)])])])]))),128)),s(d,null,{default:n(()=>[s(H(Fo),{class:"mt-6",load:G},{loading:n(()=>[t("div",xe,[s(k,{name:"i-line-md-loading-twotone-loop",class:"text-3xl"})])]),"no-results":n(()=>[t("div",ye,i(e.$t("feeds.nothingToShow")),1)]),"no-more":n(()=>[t("div",be,[_(i(e.$t("youHaveReachedTheEnd"))+" ",1),Me,_(" "+i(e.$t("feeds.followMorePeople")),1)])]),_:1})]),_:1}),t("div",Ce,[s(yo,{ref_key:"chronologicalModalViewRef",ref:B,section:"chronological"},null,512)]),t("div",Ie,[s(Ao,{ref_key:"chronologicalFeedModalViewRef",ref:N,section:"chronological-feed"},null,512)]),s(bo,{id:"feed-collection-selection-modal","modal-id":"feed-collection-selection-modal",ref_key:"collectionSelectionModalRef",ref:z,"work-id":M.value,class:"modal",onSave:oo},null,8,["work-id"])])])]),_:1},8,["hide-side"])],1024)}}},Oe=J($e,[["__scopeId","data-v-88943b1e"]]);export{Oe as default};