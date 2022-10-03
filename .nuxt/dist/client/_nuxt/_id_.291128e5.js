import{h as L,a as M,i as R,H as K,k as j,r as p,a5 as Y,o as d,l as f,m as t,p as g,t as a,b as k,w as U,s as u,v as _,J as F,E as T,u as D,q as E,c as O,F as G,x as Q,K as P,L as q,j as X,a7 as Z,T as tt,U as et}from"./entry.ec82c8a4.js";import{u as z,_ as st}from"./Icon.12c4779f.js";import{L as ot}from"./Layout.a04c6b50.js";import{S as W}from"./Spinner.7be79ae2.js";import{_ as H}from"./_plugin-vue_export-helper.a1a6add7.js";const N=i=>(P("data-v-93aff21e"),i=i(),q(),i),at={class:"mb-4 text-base font-bold"},it={class:"text-xs italic font-bold href"},lt={class:"alert-success"},nt={class:"italic"},rt={class:"flex flex-row p-2 mb-6 text-white rounded-md button-color"},ct=["onSubmit"],ut={class:"input-block"},dt=["placeholder"],pt={class:"input-block"},ht=["placeholder"],_t={class:"input-block"},ft={class:"input-block"},vt={class:"mb-3"},mt=["for"],wt=N(()=>t("span",{class:"block w-10 h-6 bg-gray-300 rounded-full shadow-inner"},null,-1)),gt={key:0,class:"block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline"},kt=N(()=>t("input",{id:"unchecked",type:"checkbox",class:"absolute w-0 h-0 opacity-0"},null,-1)),bt=[kt],yt={key:1,class:"block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color"},xt=N(()=>t("input",{id:"checked",type:"checkbox",class:"absolute w-0 h-0 opacity-0"},null,-1)),$t=[xt],Et={class:"ml-2"},It={class:"flex flex-row p-2 mt-2 text-white bg-red-400 rounded"},Ct={class:"flex flex-row"},St={__name:"UpdateForm",props:{id:{type:String,default:""}},setup(i){const m=i,I=L(),{$router:b}=M(),{oApiConfiguration:y,fetchOptions:C}=R(),x=z(y,C()),S=K().public.apiUrl;j(()=>{I.loggedIn||b.push("/"),V()});const l=p(!1),V=async()=>{const[s,o]=await x.getWorkById(m.id);o?l.value=!0:(e.value.title=s.title,e.value.description=s.description,s.artwork_has_tags.forEach(w=>{r.value.push({key:w.artwork_tags.id,value:w.artwork_tags.tag})}),e.value.isExplicit=!!s.is_explicit)},e=p({title:"",description:"",tags:"",isExplicit:!1}),r=p([]),n=p(!1),h=p(!1),A=p(!1),J=async()=>{const s=[];r.value.forEach(o=>{s.push(o.value)}),n.value=!0,h.value=!1;try{const o=[];r.value.forEach(c=>{o.push(c.value)});const[w,B]=await x.updateInfo({id:m.id,title:e.value.title,description:e.value.description,isExplicit:e.value.isExplicit,tags:o.toString()});B?A.value=!0:(h.value=!0,setTimeout(()=>{b.push(`/a/${m.id}`)},1e3))}catch{A.value=!0}n.value=!1};return(s,o)=>{const w=Q,B=Y("tags-input");return d(),f("div",null,[t("div",at,[g(a(s.$t("artworks.update.form.title"))+" ",1),t("span",it,[k(w,{to:"/a/"+i.id},{default:U(()=>[g(" (ID: "+a(i.id)+") ",1)]),_:1},8,["to"])])]),u(t("div",{class:"alert-danger"},a(s.$t("artworks.update.form.fetchFailure")),513),[[_,l.value]]),u(t("div",lt,[g(a(s.$t("artworks.update.form.updated"))+" ",1),t("span",nt,a(s.$t("artworks.update.form.successRedirect")),1)],512),[[_,h.value]]),u(t("div",rt,[k(W,{class:"mr-1"}),g(" "+a(s.$t("saving")),1)],512),[[_,n.value]]),u(t("div",{class:"alert-danger"},a(s.$t("artworks.add.form.uploadFailure")),513),[[_,A.value]]),u(t("form",{enctype:"multipart/form-data",onSubmit:G(J,["prevent"])},[t("div",ut,[u(t("input",{"onUpdate:modelValue":o[0]||(o[0]=c=>e.value.title=c),type:"text",class:F(["form-input input",{"pointer-events-none cursor-not-allowed":n.value||h.value}]),placeholder:s.$t("title")},null,10,dt),[[T,e.value.title]])]),t("div",pt,[u(t("textarea",{"onUpdate:modelValue":o[1]||(o[1]=c=>e.value.description=c),class:F(["form-input input",{"pointer-events-none cursor-not-allowed":n.value||h.value}]),rows:"8",cols:"0",placeholder:s.$t("description"),"data-gramm":"false"},null,10,ht),[[T,e.value.description]])]),t("div",_t,[k(B,{modelValue:r.value,"onUpdate:modelValue":o[2]||(o[2]=c=>r.value=c),placeholder:s.$t("tagsInputPlaceholder"),typeahead:!0,"typeahead-style":"dropdown","typeahead-activation-threshold":2,"typeahead-show-on-focus":!0,"typeahead-hide-discard":!0,"typeahead-url":D(S)+"/artworks/tags/search?keyword=:search","add-tags-on-comma":!0},null,8,["modelValue","placeholder","typeahead-url"])]),t("div",ft,[t("div",vt,[t("label",{for:e.value.isExplicit?"unchecked":"checked",class:"inline-flex items-center mt-2"},[t("span",{class:"relative cursor-pointer",onClick:o[3]||(o[3]=c=>e.value.isExplicit=!e.value.isExplicit)},[wt,e.value.isExplicit?E("",!0):(d(),f("span",gt,bt)),e.value.isExplicit?(d(),f("span",yt,$t)):E("",!0)]),t("span",Et,a(s.$t("explicitContent")),1)],8,mt),u(t("div",It,[k(st,{name:"alert-outline",class:"mr-1 text-white"}),t("span",null,a(s.$t("artworks.add.form.prohibitChildExplicitContent")),1)],512),[[_,e.value.isExplicit]])])]),t("button",{class:F(["float-right primary-button",{"pointer-events-none cursor-not-allowed":n.value||h.value}])},[t("div",Ct,[n.value?(d(),O(W,{key:0,class:"mr-1"})):E("",!0),g(" "+a(n.value?s.$t("saving"):s.$t("save")),1)])],2)],40,ct),[[_,!l.value]])])}}},Vt=H(St,[["__scopeId","data-v-93aff21e"]]);const v=i=>(P("data-v-28b6857b"),i=i(),q(),i),At=v(()=>t("h1",{class:"font-bold text-base mb-3"},"Current Info",-1)),Bt={class:"mt-2"},Ft=v(()=>t("label",{class:"text-color-secondary font-medium italic"},"Title",-1)),Ut={class:"mt-2"},Dt=v(()=>t("label",{class:"text-color-secondary font-medium italic"},"Description",-1)),Nt={class:"text-justify"},Tt={class:"mt-2"},Wt=v(()=>t("label",{class:"text-color-secondary font-medium italic"},"Explicit",-1)),Lt={key:0,class:"mt-2"},Mt=v(()=>t("label",{class:"text-color-secondary font-medium italic"},"Tags",-1)),Rt={class:"tags"},jt={class:"mt-2"},Ot=v(()=>t("label",{class:"text-color-secondary font-medium italic"},"Publish Date",-1)),Pt={__name:"[id]",setup(i){const m=L(),{oApiConfiguration:I,fetchOptions:b}=R(),y=z(I,b()),{$router:C}=M(),x=X(),{id:$}=C.currentRoute.value.params;Z(async()=>{await S()}),j(()=>{V()});const S=async()=>{const[e,r]=await y.getWorkById($);(e.user_id!==m.user.id||r)&&x.push({path:"/"})},l=p({}),V=async()=>{try{const[e,r]=await y.getWorkById($);r||(l.value=e)}catch{}};return(e,r)=>(d(),O(ot,{"with-footer":!0,"h-screen":!0},{"right-side":U(()=>[At,t("div",Bt,[Ft,t("p",null,a(l.value.title),1)]),t("div",Ut,[Dt,t("p",Nt,a(l.value.description),1)]),t("div",Tt,[Wt,t("p",null,a(l.value.is_explicit?"Yes":"No"),1)]),l.value.artwork_has_tags&&l.value.artwork_has_tags.length?(d(),f("div",Lt,[Mt,t("div",Rt,[(d(!0),f(tt,null,et(l.value.artwork_has_tags,n=>(d(),f("span",{key:n.artwork_tags.id,class:"tag"},a(n.artwork_tags.tag),1))),128))])])):E("",!0),t("div",jt,[Ot,t("p",null,a(e.formatDate(l.value.scheduled_post)),1)])]),default:U(()=>[k(D(Vt),{id:D($)},null,8,["id"])]),_:1}))}},Yt=H(Pt,[["__scopeId","data-v-28b6857b"]]);export{Yt as default};
