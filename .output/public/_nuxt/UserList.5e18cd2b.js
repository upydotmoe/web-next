import{k as S,j as T,D as F,a as B,r as D,o as r,p as n,P as y,Q as k,e as d,w as U,q as l,K as i,t as _,u as t,b as g,G as C,L as b,v as p,x as E,aw as I,bS as V,y as q}from"./entry.ed1bfc63.js";import{u as G}from"./useUser.374c898b.js";import{_ as K}from"./_plugin-vue_export-helper.a1a6add7.js";const O=["src"],P={class:"flex flex-col justify-between p-3 w-full text-white"},Q={class:"flex flex-col"},W={class:"font-bold"},H={class:"text-xxs"},J={class:"flex flex-row w-full"},R={key:0,class:"flex flex-row"},X=["onClick"],Y=["onMouseover","onClick"],Z={class:"work-grid"},A={key:0,class:"absolute top-1/2 left-1/2 z-10 text-xl font-semibold text-white transform -translate-x-1/2 -translate-y-1/2"},ee=["href"],oe=["src"],se={__name:"UserList",props:{users:{type:Array,default:()=>{}},columnType:{type:Number,default:4}},setup(u){const L=u,f=S(),{oApiConfiguration:j,fetchOptions:z}=T(),h=G(j,z()),v=F(()=>L.users);B();const c=D(0),$=async(o,a)=>{const[m,e]=await h.follow(a);e||(v.value[o].is_following=!0)},M=async(o,a)=>{const[m,e]=await h.unfollow(a);e||(v.value[o].is_following=!1)};return(o,a)=>{const m=q;return r(),n("div",{class:i(["grid grid-cols-1 gap-4 mb-4 w-full md:grid-cols-2",u.columnType==3?"lg:grid-cols-3":"lg:grid-cols-4",{"lg:grid-cols-2":u.columnType==2},{"lg:grid-cols-1":u.columnType==1}])},[(r(!0),n(y,null,k(t(v),(e,w)=>(r(),n("div",{key:e.id,class:"flex flex-col w-full"},[d(m,{to:"/u/"+e.username,class:i(["",["flex object-cover flex-row rounded-md shadow-lg cursor-pointer theme-color-secondary hover:shadow-xl",{"rounded-br-none":e.artworks.length}]]),style:I(e.cover_bucket&&e.cover_filename?"background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("+o.avatarCoverUrl(e.cover_bucket,e.cover_filename)+");background-size:cover;":"background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("+t(V)+");background-size:cover;")},{default:U(()=>[l("div",{class:i(["flex flex-row w-full",e.artworks.length?"rounded-bl-none":"rounded-bl-md"])},[l("img",{preload:"",loading:"lazy",class:"avatar",src:o.avatarCoverUrl(e.avatar_bucket,e.avatar_filename),onError:a[0]||(a[0]=(...s)=>o.imageLoadError&&o.imageLoadError(...s))},null,40,O),l("div",P,[l("div",Q,[l("span",W,_(e.name),1),l("span",H,"@"+_(e.username),1)]),l("div",J,[t(f).loggedIn&&e.id!==t(f).user.id?(r(),n("div",R,[g(l("div",{class:"flex flex-row",onClick:C(s=>$(w,e.id),["prevent"])},[d(b,{name:"i-ri-user-add-fill",class:"text-gray-300 hover:text-white"})],8,X),[[p,!e.is_following]]),g(l("div",{class:"flex flex-row",onMouseover:s=>c.value=e.id,onMouseout:a[1]||(a[1]=s=>c.value=0),onClick:C(s=>M(w,e.id),["prevent"])},[g(d(b,{name:"i-ri-user-follow-fill",class:"text-green-400"},null,512),[[p,t(c)!==e.id]]),g(d(b,{name:"i-ri-user-unfollow-fill",class:"text-red-400 hover:text-red-400"},null,512),[[p,t(c)&&t(c)===e.id]])],40,Y),[[p,e.is_following]])])):E("",!0)])])],2)]),_:2},1032,["to","class","style"]),l("div",Z,[(r(!0),n(y,null,k(e.artworks,(s,x)=>(r(),n("div",{key:s.id,class:i(["work-thumbnail theme-color-bg",s._count.artwork_assets>1&&o.currentWorkId!=s.id?"work-multiple":""])},[d(m,{to:"/a/"+s.id,target:"_blank",class:"w-full h-full theme-color-bg"},{default:U(()=>[l("div",{class:i(["overflow-hidden relative text-center",{"rounded-bl-md":x==0},{"rounded-br-md":x==2}])},[o.applyExplicitFilter(t(f),s.is_explicit,s.is_gore)?(r(),n("span",A,_(o.$t("explicitContent")),1)):E("",!0),l("a",{href:"/a/"+s.id,class:i([{"animate-wigglefast":o.manageMode}])},[l("img",{preload:"",loading:"lazy",class:i(["w-full h-full unselectable",{"object-cover":!o.isUncropped},o.isUncropped?"object-contain object-center h-44":"object-cover",{"blur-3xl brightness-50 unclickable":o.applyExplicitFilter(t(f),s.is_explicit,s.is_gore)}]),src:o.artworkThumb(s.artwork_assets[0].bucket,s.artwork_assets[0].filename,"thumbnail",!1),onError:a[2]||(a[2]=(...N)=>o.imageLoadError&&o.imageLoadError(...N))},null,42,oe)],10,ee)],2)]),_:2},1032,["to"])],2))),128))])]))),128))],2)}}},re=K(se,[["__scopeId","data-v-2de65431"]]);export{re as U};
