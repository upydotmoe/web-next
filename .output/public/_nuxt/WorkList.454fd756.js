import{f as F,d as B}from"./ProBadge.8f38c304.js";import{l as $,N as I,m as W,r as h,o as i,s as r,X as T,Y as S,K as o,u as t,P as k,b as _,x as m,y as l,f as g,U as f,c as u,w as j,z as N}from"./entry.9b47bf02.js";import{_ as P}from"./_plugin-vue_export-helper.c27b6911.js";const R=["href","onClick"],A={class:"overflow-hidden relative text-center rounded-md"},O={class:"mini-icon"},V={key:0,class:"regular"},q={key:1,class:"z-10 regular !bg-blue-500"},G={key:2,class:"original-character"},H={key:3,class:"redraw"},U={key:4,class:"gore"},D={key:0,class:"absolute top-1/2 left-1/2 z-0 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"},K={class:"overflow-hidden relative text-center rounded-md"},Q={class:"mini-icon"},X={key:0,class:"regular"},Y={key:1,class:"z-10 regular !bg-blue-500"},J={key:2,class:"original-character"},Z={key:3,class:"redraw"},w={key:4,class:"gore"},ee={key:0,class:"absolute top-1/2 left-1/2 z-0 text-base font-semibold text-white transform -translate-x-1/2 -translate-y-1/2 md:text-lg"},se=["onClick"],te={__name:"WorkList",props:{works:{type:Array,default:()=>[]},view:{type:Function,default:()=>{}},sectionClass:{type:String,default:""},isHref:{type:Boolean,default:!1},isPickerMode:{type:Boolean,default:!1},manageMode:{type:Boolean,default:!1},isMiniList:{type:Boolean,default:!1},currentWorkId:{type:Number,default:0},hideRedrawIcon:{type:Boolean,default:!1},directOpen:{type:Boolean,default:!1}},emits:["feedManageList","pickerModeChangeSelected"],setup(n,{emit:x}){const b=n,a=$();I(()=>b.currentWorkId,s=>{y.value=s}),W();const p=h(!1),y=h(b.currentWorkId);F("(min-width: 1024px)");const c=h([]),v=s=>{if(c.value.includes(s)){const C=c.value.indexOf(s);c.value.splice(C,1)}else c.value.push(s);x("feedManageList",c.value)};I(()=>b.manageMode,s=>{s===!1&&(c.value=[])});const E=h(0),M=s=>{E.value=s,x("pickerModeChangeSelected",s)};return(s,C)=>{const d=B,z=N;return i(),r("section",{class:o(n.sectionClass)},[(i(!0),r(T,null,S(n.works,e=>(i(),r("span",{key:e.id,class:o(["work-thumbnail theme-color-bg rounded-lg",e._count.artwork_assets>1&&t(y)!=e.id?"work-multiple":"",{"border-4 border-yellow-400":t(c).includes(e.id)||t(y)==e.id||t(E)==e.id}])},[!n.isHref&&!n.isMiniList?(i(),r("a",{key:0,href:"/a/"+e.id,class:"w-full h-full theme-color-bg",onClick:k(L=>n.manageMode?v(e.id):n.isPickerMode?M(e.id):n.view(e.id),["prevent"])},[_("div",A,[_("div",O,[!e.is_before_after&&e._count.artwork_assets>1&&!s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)?(i(),r("p",V,m(e._count.artwork_assets),1)):l("",!0),e.is_before_after?(i(),r("p",q,[g(f,{name:"i-tabler-square-half",class:"text-white"})])):l("",!0),e.is_original_character?(i(),r("p",G,[g(f,{name:"i-clarity-cursor-hand-click-line",class:"text-white"})])):l("",!0),e.redraw_of&&!n.hideRedrawIcon?(i(),r("p",H,[g(f,{name:"i-fluent-draw-image-20-regular",class:"text-white"})])):l("",!0),e.is_gore?(i(),r("p",U," G ")):l("",!0)]),s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)?(i(),r("span",D,m(e.is_gore?s.$t("goreContent"):s.$t("explicitContent")),1)):l("",!0),_("div",{class:o([{"animate-wigglefast":n.manageMode},{"before-after":e.is_before_after}])},[e.is_before_after?l("",!0):(i(),u(d,{key:0,preload:"",loading:"lazy",src:(!t(a).loggedIn||t(a).loggedIn&&t(a).user.user_settings&&!t(a).user.user_settings.show_explicit)&&e.is_explicit||(!t(a).loggedIn||t(a).loggedIn&&t(a).user.user_settings&&!t(a).user.user_settings.show_gore)&&e.is_gore?"https://via.placeholder.com/150":s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename,"thumbnail",t(p)),class:o(["w-full h-full unselectable",{"object-cover":!t(p)},t(p)?"object-contain object-center h-44":"object-cover",{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])),e.is_before_after?(i(),u(d,{key:1,preload:"",loading:"lazy",src:s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename.split("_")[0]+"_1."+e.artwork_assets[0].filename.split(".")[1],"thumbnail",!1),class:o([{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])):l("",!0),e.is_before_after?(i(),u(d,{key:2,preload:"",loading:"lazy",src:s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename.split("_")[0]+"_2."+e.artwork_assets[0].filename.split(".")[1],"thumbnail",!1),class:o([{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])):l("",!0)],2)])],8,R)):(i(),u(z,{key:1,onClick:L=>n.manageMode?v(e.id):n.isPickerMode?M(e.id):n.view(e.id)},{default:j(()=>[_("div",K,[_("div",Q,[!e.is_before_after&&e._count.artwork_assets>1&&!s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)?(i(),r("p",X,m(e._count.artwork_assets),1)):l("",!0),e.is_before_after?(i(),r("p",Y,[g(f,{name:"i-tabler-square-half",class:"text-white"})])):l("",!0),e.is_original_character?(i(),r("p",J,[g(f,{name:"i-clarity-cursor-hand-click-line",class:"text-white"})])):l("",!0),e.redraw_of&&!n.hideRedrawIcon?(i(),r("p",Z,[g(f,{name:"i-fluent-draw-image-20-regular",class:"text-white"})])):l("",!0),e.is_gore?(i(),r("p",w," G ")):l("",!0)]),s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)?(i(),r("span",ee,m(e.is_gore?s.$t("goreContent"):s.$t("explicitContent")),1)):l("",!0),_("div",{class:o([{"animate-wigglefast":n.manageMode},{"before-after":e.is_before_after}]),onClick:k(L=>null,["prevent"])},[e.is_before_after?l("",!0):(i(),u(d,{key:0,preload:"",loading:"lazy",src:(!t(a).loggedIn||t(a).loggedIn&&t(a).user.user_settings&&!t(a).user.user_settings.show_explicit)&&e.is_explicit||(!t(a).loggedIn||t(a).loggedIn&&t(a).user.user_settings&&!t(a).user.user_settings.show_gore)&&e.is_gore?"https://via.placeholder.com/150":s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename,"thumbnail",t(p)),class:o(["object-cover w-full h-full unselectable",{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),alt:"before image",onError:s.imageLoadError},null,8,["src","class","onError"])),e.is_before_after?(i(),u(d,{key:1,preload:"",loading:"lazy",src:s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename.split("_")[0]+"_1."+e.artwork_assets[0].filename.split(".")[1],"thumbnail",!1),class:o([{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])):l("",!0),e.is_before_after?(i(),u(d,{key:2,preload:"",loading:"lazy",src:s.artworkThumb(e.artwork_assets[0].bucket,e.artwork_assets[0].filename.split("_")[0]+"_2."+e.artwork_assets[0].filename.split(".")[1],"thumbnail",!1),class:o([{"blur-3xl brightness-50 unclickable":s.applyExplicitFilter(t(a),e.is_explicit,e.is_gore)}]),onError:s.imageLoadError},null,8,["src","class","onError"])):l("",!0)],10,se)])]),_:2},1032,["onClick"]))],2))),128))],2)}}},re=P(te,[["__scopeId","data-v-b03860d2"]]);export{re as W};
