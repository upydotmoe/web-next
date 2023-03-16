import{k as S,r as u,E as T,S as H,o as i,s as d,b as c,c as V,w as b,t as W,x as y,y as f,f as o,U as x,u as a,e as B,v as D,K as z,z as O}from"./entry.013e3180.js";import{u as U,d as j}from"./ProBadge.621315e3.js";import{W as F}from"./WorkList.918875b3.js";import{_ as I}from"./LoadingEmptyErrorMessage.ea9789d6.js";import{_ as K}from"./_plugin-vue_export-helper.c27b6911.js";const Y={class:"artist-works"},q={key:0,class:"heading"},G={class:"title"},J={key:1,class:"pagination-controller"},Q={__name:"ArtistWorks",props:{withTitle:{type:Boolean,default:!0},isPickerMode:{type:Boolean,default:!1},artworkDetail:{type:Object,default(){return{}}},keepArtistPageNumber:{type:Boolean,default:!1},view:{type:Function,default:()=>({})},isHref:{type:Boolean,default:!1},paginationPerPage:{type:Number,default:4}},emits:["pickerModeChangeSelected"],setup(e,{emit:k}){const m=e,v=m.artworkDetail,{oApiConfiguration:N,fetchOptions:C}=S(),$=U(N,C()),_=u(null);T(()=>{m.keepArtistPageNumber||(t.page=-1),h(v.users.id)});const n=u(!0),P=u([]),t=H({page:0,perPage:m.paginationPerPage,options:{nextPrevLoading:!1,disableArtistNextButton:!0,disableArtistPrevButton:!0}}),A=u(!0),h=async(r,l)=>{n.value=!0,t.options.nextPrevLoading=!0,r!==_.value&&(_.value=r,t.page=-1),l==="prev"?t.page-=1:t.page+=1;const[w,s,L]=await $.getUserArtworks({userId:r,pagination:{page:t.page,perPage:t.perPage}});L?(n.value=!1,M()):s.record_total===0?g.value=!0:(s.total_page===0&&(A.value=!1),s.next_previous.prev_page===null||s.next_previous.prev_page===void 0?t.options.disableArtistPrevButton=!0:t.options.disableArtistPrevButton=!1,s.next_previous.next_page===null||s.next_previous.next_page===void 0?t.options.disableArtistNextButton=!0:t.options.disableArtistNextButton=!1,P.value=w),t.options.nextPrevLoading=!1,n.value=!1},g=u(!1),p=u(!1),M=()=>{p.value=!0},E=r=>{k("pickerModeChangeSelected",r)};return(r,l)=>{const w=O;return i(),d("div",Y,[e.withTitle?(i(),d("div",q,[c("span",G,[e.artworkDetail.users?(i(),V(w,{key:0,to:"/u/"+e.artworkDetail.users.username,class:"text-color-bright"},{default:b(()=>[W(" @"+y(e.artworkDetail.users.username)+" <"+y(e.artworkDetail.users.name)+"> ",1)]),_:1},8,["to"])):f("",!0)]),o(w,{to:"/u/"+e.artworkDetail.users.username,target:"_blank",class:"flex flex-row cursor-pointer"},{default:b(()=>[o(x,{name:"i-ci-external-link"})]),_:1},8,["to"])])):f("",!0),o(I,{loading:a(n),error:a(p),empty:a(g),"empty-message":r.$t("artworks.youDontHaveArtworkYet"),class:"mt-2"},null,8,["loading","error","empty","empty-message"]),B(o(F,{class:z(["gap-2 mt-4 md:gap-4",[a(t).options.nextPrevLoading?"animate-pulse":"","grid-cols-"+e.paginationPerPage]]),"section-class":"works",works:a(P),view:e.view,"is-href":e.isHref,"is-mini-list":!0,"current-work-id":e.artworkDetail.id,"is-picker-mode":e.isPickerMode,onPickerModeChangeSelected:E},null,8,["class","works","view","is-href","current-work-id","is-picker-mode"]),[[D,!a(n)&&!a(g)&&!a(p)]]),e.artworkDetail.users&&a(A)&&!a(g)&&!a(p)?B((i(),d("div",J,[c("span",{onClick:l[0]||(l[0]=s=>a(t).options.disableArtistPrevButton?null:h(e.artworkDetail.users.id,"prev"))},[o(x,{name:"i-ion-chevron-back"})]),c("span",{onClick:l[1]||(l[1]=s=>a(t).options.disableArtistNextButton?null:h(e.artworkDetail.users.id,"next"))},[o(x,{name:"i-ion-chevron-forward"})])],512)),[[D,!a(n)]]):f("",!0)])}}},ne=K(Q,[["__scopeId","data-v-d8ccedd1"]]),R=["href"],X={key:0},Z={key:1,class:"w-full md:w-2/3"},ee={class:"title-tiny"},te=["innerHTML"],le={__name:"MiniArtworkPreview",props:{data:{type:Object,default:()=>{}},workId:{type:Number,default:0}},setup(e){return(k,m)=>{const v=j;return i(),d("a",{href:"/a/"+(e.workId??e.data.id),target:"_blank",class:"flex flex-col gap-2 w-full md:flex-row"},[e.data.artwork_assets?(i(),d("div",X,[o(v,{preload:"",loading:"lazy",class:"w-full rounded-md md:w-40",src:k.artworkThumb(e.data.artwork_assets[0].bucket,e.data.artwork_assets[0].filename,"thumbnail",!1),onError:k.imageLoadError},null,8,["src","onError"])])):f("",!0),e.data.title?(i(),d("div",Z,[c("h2",ee,y(e.data.title),1),c("p",{innerHTML:e.data.description.length>200?e.data.description.slice(0,200)+"..":e.data.description},null,8,te)])):f("",!0)],8,R)}}};export{ne as A,le as _};