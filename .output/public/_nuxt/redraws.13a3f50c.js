import{j as E,O as L,m as $,r as g,c as A,w,o as n,q as i,G as M,e as l,L as B,s as C,t as d,u as a,p as _,x as m,b as R,v as I,y as N}from"./entry.ed1bfc63.js";import{u as T}from"./ProBadge.dc1cf83d.js";import{L as V}from"./Layout.c894869a.js";import{W as D}from"./WorkList.c9cb3145.js";import{_ as P}from"./LoadingEmptyErrorMessage.caee9811.js";import{_ as W}from"./_plugin-vue_export-helper.a1a6add7.js";import"./Spinner.bfc0b0e5.js";const j={class:"flex flex-row justify-start w-full md:w-auto"},H={key:0,class:"p-2 mb-6 w-full rounded-md theme-color"},O={key:0},S=["src"],q={class:"flex flex-col"},z={class:"mb-2 text-lg font-bold"},F=["innerHTML"],G={class:"section-title"},J={id:"lists"},K={__name:"redraws",setup(Q){const{oApiConfiguration:v,fetchOptions:k}=E(),f=T(v,k()),h=L(),{id:p}=h.params;$(()=>{b(),y()});const o=g({options:{loading:!0},data:{}}),y=async()=>{o.value.options.loading=!0;const[e,s]=await f.getWorkById(p);s||(o.value.data=e),o.value.options.loading=!1},t=g({options:{loading:!0,pagination:{page:0,perPage:24},isEmpty:!1},data:[],pagination:{}}),b=async()=>{t.value.options.pagination.page=0,await c()},x=async()=>{t.value.options.pagination.page+=1,await c()},c=async()=>{t.value.options.loading=!0;const[e,s,u]=await f.getRedraws({workId:p,pagination:{page:t.value.options.pagination.page,perPage:t.value.options.pagination.perPage}});u||(e.forEach(r=>{t.value.data.push(r)}),t.value.pagination=s,t.value.options.isEmpty=!1,s.record_total||(t.value.options.isEmpty=!0)),t.value.options.loading=!1};return(e,s)=>{const u=N;return n(),A(V,{"with-footer":!0,"hide-side":!0,"no-right-side":!0},{default:w(()=>[i("div",j,[i("a",{onClick:s[0]||(s[0]=M(r=>e.$router.back(),["prevent"])),class:"mb-4 light-button"},[l(B,{name:"i-typcn-arrow-back"}),C(" "+d(e.$t("back")),1)])]),a(o).options.loading?m("",!0):(n(),_("div",H,[l(u,{to:"/a/"+a(p),class:"flex flex-row gap-2"},{default:w(()=>[a(o).data.artwork_assets?(n(),_("div",O,[i("img",{preload:"",loading:"lazy",class:"w-40 rounded-md",src:e.artworkThumb(a(o).data.artwork_assets[0].bucket,a(o).data.artwork_assets[0].filename,"thumbnail",!1),onError:s[1]||(s[1]=(...r)=>e.imageLoadError&&e.imageLoadError(...r))},null,40,S)])):m("",!0),i("div",q,[i("span",z,d(a(o).data.title),1),i("p",{innerHTML:a(o).data.description.length>200?a(o).data.description.slice(0,200)+"..":a(o).description},null,8,F)])]),_:1},8,["to"])])),i("div",null,[i("div",G,d(e.$t("artworks.redraws")),1),i("div",J,[R(l(D,{"section-class":"work-grid",works:a(t).data,view:null,"hide-redraw-icon":!0},null,8,["works"]),[[I,!a(t).options.isEmpty]]),l(P,{class:"mb-2",loading:a(t).options.loading,empty:a(t).options.isEmpty,error:!1,fetch:c},null,8,["loading","empty"]),a(t).pagination.next_previous&&a(t).pagination.next_previous.next_page?(n(),_("button",{key:0,onClick:s[2]||(s[2]=r=>x()),class:"w-full primary-button"},d(e.$t("loadMore")),1)):m("",!0)])])]),_:1})}}},et=W(K,[["__scopeId","data-v-63021ca7"]]);export{et as default};
