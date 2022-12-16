import{bR as Se,k as pe,j as fe,C as ie,I as Ae,a as me,Y as ve,m as he,r as h,o as z,p as oe,q as e,t as u,b as c,v as m,u as t,K as b,e as y,s as Q,F as j,U as O,G as D,w as be,h as we,M as ye,N as $e,L as V,x as ae,H as ke,T as _e,f as Ie,D as Ne,E as Ue,c as le,y as Ve}from"./entry.ae51314b.js";import{u as re,L as Ee}from"./Layout.288d44a5.js";import{_ as De}from"./ProBadge.de1f3ff6.js";import{v as Pe}from"./vue3-editor.common.5407f97f.js";import{S as ne}from"./Spinner.96f551a8.js";import{u as ge}from"./useUser.9e6a9c73.js";import{_ as ue}from"./_plugin-vue_export-helper.a1a6add7.js";import"./user-counters-api.7503204d.js";var ce={exports:{}};(function(F,f){(function(A,v){v(f)})(Se,function(A){function v(s,n){return function(p){if(Array.isArray(p))return p}(s)||function(p,g){var k=p==null?null:typeof Symbol<"u"&&p[Symbol.iterator]||p["@@iterator"];if(k!=null){var x,w,U=[],T=!0,L=!1;try{for(k=k.call(p);!(T=(x=k.next()).done)&&(U.push(x.value),!g||U.length!==g);T=!0);}catch(q){L=!0,w=q}finally{try{T||k.return==null||k.return()}finally{if(L)throw w}}return U}}(s,n)||function(p,g){if(!!p){if(typeof p=="string")return S(p,g);var k=Object.prototype.toString.call(p).slice(8,-1);if(k==="Object"&&p.constructor&&(k=p.constructor.name),k==="Map"||k==="Set")return Array.from(p);if(k==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(k))return S(p,g)}}(s,n)||function(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}()}function S(s,n){(n==null||n>s.length)&&(n=s.length);for(var p=0,g=new Array(n);p<n;p++)g[p]=s[p];return g}function C(s,n){var p,g,k,x,w=null,U=typeof n=="number"?n:(p=v(String(n).split(/(ms|s)/i),2),g=p[0],k=p[1],x=k===void 0?"ms":k,Number(g)*{ms:1,s:1e3}[x]),T=function(){for(var L=this,q=arguments.length,P=new Array(q),M=0;M<q;M++)P[M]=arguments[M];var Y=function(){w=null,s.apply(L,P)};clearTimeout(w),(w=setTimeout(Y,U))||s.apply(this,P)};return T.cancel=function(){clearTimeout(w),w=null},T}function I(s){return s.map(function(n){return n.toLowerCase()})}function E(s,n){var p,g=s?s["debounce-events"]:[];return g&&g.length>0?Array.isArray(g)?I(g):I(g.split(",")):I((p=n,Array.isArray(p)?p:p==null?[]:[p]))}function o(s){return s===""}function N(s,n){return s==="Enter"&&(!n.lock||n.unlock)}function r(s,n,p){return o(s)&&p.fireonempty&&(n==="Enter"||n===" ")}function d(){var s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=s.lock,p=n!==void 0&&n,g=s.listenTo,k=g===void 0?"keyup":g,x=s.defaultTime,w=x===void 0?"300ms":x,U=s.fireOnEmpty,T=U!==void 0&&U,L=s.cancelOnEmpty,q=L!==void 0&&L,P=s.trim,M=P!==void 0&&P;return{bind:function(Y,W,J){var se=W.value,X=W.arg,Z=X===void 0?w:X,ee=W.modifiers,K=Object.assign({lock:p,trim:M,fireonempty:T,cancelonempty:q},ee),H=E(J.data.attrs,k),B=C(function($){se($.target.value,$)},Z);function te($){var R=K.trim?$.target.value.trim():$.target.value;o(R)&&K.cancelonempty?B.cancel():N($.key,K)||r(R,$.key,K)?(B.cancel(),se($.target.value,$)):B($)}H.forEach(function($){Y.addEventListener($,te)})}}}var l={install:function(s){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};s.directive("debounce",d(n))}};A.debounce=C,A.default=l,A.vue3Debounce=function(){var s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=s.lock,p=n!==void 0&&n,g=s.listenTo,k=g===void 0?"keyup":g,x=s.defaultTime,w=x===void 0?"300ms":x,U=s.fireOnEmpty,T=U!==void 0&&U,L=s.cancelOnEmpty,q=L!==void 0&&L,P=s.trim,M=P!==void 0&&P;return{created:function(Y,W,J){var se=W.value,X=W.arg,Z=X===void 0?w:X,ee=W.modifiers,K=Object.assign({lock:p,trim:M,fireonempty:T,cancelonempty:q},ee),H=E(J.props,k),B=C(function($){se($.target.value,$)},Z);function te($){var R=K.trim?$.target.value.trim():$.target.value;o(R)&&K.cancelonempty?B.cancel():N($.key,K)||r(R,$.key,K)?(B.cancel(),se($.target.value,$)):B($)}H.forEach(function($){Y.addEventListener($,te)})}}},Object.defineProperty(A,"__esModule",{value:!0})})})(ce,ce.exports);const de=F=>(ye("data-v-fde694fc"),F=F(),$e(),F),je={class:"flex flex-col w-full"},Fe={class:"mb-4 w-44"},Te={class:"font-semibold"},Le={class:"mt-2"},Me=["src"],Oe=["src"],Ke={class:"mt-2 w-full text-center text-failure"},Be=de(()=>e("br",null,null,-1)),Re=de(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),Ge={class:"mb-4"},ze={class:"font-semibold"},qe={class:"mt-2"},Ye=["src"],He=["src"],We={class:"flex flex-row justify-end w-full"},Je={class:"mt-2 w-full text-center text-failure"},Qe=de(()=>e("br",null,null,-1)),Xe=de(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),Ze={class:"input-block"},et={class:"font-semibold"},tt={class:"field"},st={class:"input-block"},ot={class:"font-semibold"},lt={class:"field"},nt={class:"input-block"},at={class:"font-semibold"},rt={class:"mb-4 field"},it={class:"flex flex-row p-1 w-full rounded-md cursor-pointer md:w-min theme-color"},ut={class:"input-block"},dt={class:"font-semibold"},ct={class:"mb-4 field"},pt={class:"input-block"},ft={class:"font-semibold"},mt={class:"field"},vt={class:"flex flex-row justify-between w-full"},gt={class:"flex flex-row text-success"},bt=de(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),ht={class:"input-block"},wt=["name"],_t={class:"font-semibold"},yt={class:"field"},$t={__name:"Information",setup(F){const f=pe(),{oApiConfiguration:A,fetchOptions:v}=fe(),S=ge(A,v()),{t:C}=ie(),I=Ae(),{$router:E}=me();ve(()=>{f.loggedIn||E.push("/")}),he(()=>{r()});const o=h({name:"",username:"",penName:"",bio:"",gender:"m",location:""}),N=h({username:"",penName:""}),r=async()=>{if(f.loggedIn){const[a,i]=await S.getInfo(f.user.id);i||(o.value.name=a.name,o.value.username=a.username,N.value.username=a.username,o.value.penName=a.pen_name,N.value.penName=a.pen_name,o.value.bio=a.bio,o.value.gender=a.gender,o.value.location=a.location)}},d=h({basic:{loading:!1,success:!1,buttonDisabled:!1,checkingValidity:!1},username:{loading:!1,success:!1,buttonDisabled:!0,checkingValidity:!1}}),l=h(!1),s=async()=>{o.value.penName===""&&(l.value=!1,d.value.basic.buttonDisabled=!0,d.value.basic.checkingValidity=!1),o.value.penName.length>=4&&o.value.penName.length<=12?(d.value.basic.buttonDisabled=!0,d.value.basic.checkingValidity=!0,await ce.exports.debounce(async a=>{if(o.value.penName===N.value.penName)l.value=!1,d.value.basic.buttonDisabled=!1,d.value.basic.checkingValidity=!1;else{const[i,G]=await S.checkPenNameAvailability(o.value.penName);!i&&G&&f.user.pen_name!==o.value.penName?(l.value=!0,d.value.basic.buttonDisabled=!0,d.value.basic.checkingValidity=!1):(l.value=!1,d.value.basic.buttonDisabled=!1,d.value.basic.checkingValidity=!1)}},700)()):l.value=!1},n="basic-information-form",p=async()=>{if(re().validate(basicInformationformId,C),!l.value){d.value.basic.loading=!0;const[a,i]=await S.updateInfo({userId:f.user.id,name:o.value.name,gender:o.value.gender,bio:o.value.bio,location:o.value.location,penName:o.value.penName});!a&&i?d.value.basic.loading=!1:d.value.basic.success=!0,d.value.basic.loading=!1}},g=h(!1),k=async()=>{o.value.username===""&&(g.value=!1,d.value.username.buttonDisabled=!0,d.value.username.checkingValidity=!1),o.value.username.length>=4&&o.value.username.length<=12?(d.value.username.buttonDisabled=!0,d.value.username.checkingValidity=!0,await ce.exports.debounce(async a=>{if(o.value.username===N.value.username)g.value=!1,d.value.username.buttonDisabled=!1,d.value.username.checkingValidity=!1;else{const[i,G]=await S.checkUsernameAvailability(o.value.username);!i&&G?(g.value=!0,d.value.username.buttonDisabled=!0,d.value.username.checkingValidity=!1):(g.value=!1,d.value.username.buttonDisabled=!1,d.value.username.checkingValidity=!1)}},500)()):g.value=!1},x="change-username-form",w=async()=>{if(re().validate(changeUsernameformId,C),!g.value){d.value.username.loading=!0;const[a,i]=await S.changeUsername(o.value.username);!a&&i?d.value.username.loading=!1:d.value.username.success=!0,d.value.username.loading=!1}},U=()=>{document.getElementById("inputAvatarFile").click()},T=h(""),L=h(""),q=a=>{const i=a.target.files[0];L.value=URL.createObjectURL(i),T.value=i},P=h(!1),M=h(!1),Y=h(!1),W=h(null),J=h(""),se=async()=>{if(T.value){M.value=!1,P.value=!0,Y.value=!1,J.value="";const a=T.value,i=new FormData;i.append("avatar",a);try{const G=await we.post(I.public.apiUrl+"/user/update/avatar",i,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${f.a4ht0jen}`}});M.value=!0}catch(G){const _=G.response;_.data.error==="File too large"?Y.value=!0:J.value=_.data.message}P.value=!1}},X=()=>{document.getElementById("inputCoverFile").click()},Z=h(""),ee=h(""),K=a=>{const i=a.target.files[0];ee.value=URL.createObjectURL(i),Z.value=i},H=h(!1),B=h(!1),te=h(!1),$=h(null),R=h(""),Ce=async()=>{if(Z.value){B.value=!1,H.value=!0,te.value=!1,R.value="";const a=Z.value,i=new FormData;i.append("cover",a);try{const G=await we.post(I.public.apiUrl+"/user/update/cover",i,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${f.a4ht0jen}`}});B.value=!0}catch(G){const _=G.response;_.data.error==="File too large"?te.value=!0:R.value=_.data.message}H.value=!1}};return(a,i)=>{const G=De;return z(),oe("div",je,[e("div",Fe,[e("label",Te,u(a.$t("profile.forms.update.avatar")),1),e("div",Le,[c(e("img",{src:a.avatarCoverUrl(t(f).user.avatar_bucket,t(f).user.avatar_filename),class:"avatar",onError:i[0]||(i[0]=(..._)=>a.imageLoadError&&a.imageLoadError(..._))},null,40,Me),[[m,!t(L)]]),c(e("img",{src:t(L),class:b(["avatar",t(Y)||t(J)?"border-2 border-red-400":"border-none"])},null,10,Oe),[[m,t(L)]]),e("input",{id:"inputAvatarFile",ref_key:"selectedNewAvatarRef",ref:W,type:"file",accept:"image/png, image/gif, image/jpeg",class:"hidden",onChange:q},null,544),e("button",{id:"selectNewAvatarButton",class:"mt-2 w-full primary-button",onClick:i[1]||(i[1]=_=>U())},u(a.$t("profile.forms.update.chooseNewAvatar")),1),e("button",{class:b(["flex flex-row mt-2 w-full",[t(T)?"primary-button cursor-pointer":"disabled-button cursor-not-allowed",t(P)?"disabled-button cursor-not-allowed":"primary-button cursor-pointer"]]),onClick:i[2]||(i[2]=_=>U&&!t(P)?se():null)},[c(y(ne,{class:"mr-2"},null,512),[[m,t(P)]]),Q(" "+u(t(P)?a.$t("updating"):a.$t("update")),1)],2),c(e("div",Ke,[Q(u(a.$t("profile.forms.update.fileTooLarge"))+" ",1),Be,Q(" "+u(a.$t("profile.forms.update.avatarMaxAllowedFileSize")),1)],512),[[m,t(Y)]]),c(e("div",{class:"mt-2 w-full text-center text-failure"},u(t(J)),513),[[m,t(J)!=""]]),c(e("div",{class:"mt-2 w-full text-center text-success"},u(a.$t("updated")),513),[[m,t(M)]])])]),Re,e("div",Ge,[e("label",ze,u(a.$t("profile.forms.update.cover")),1),e("div",qe,[c(e("img",{src:a.avatarCoverUrl(t(f).user.cover_bucket,t(f).user.cover_filename),class:"object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable",onError:i[3]||(i[3]=(..._)=>a.defaultCoverImage&&a.defaultCoverImage(..._))},null,40,Ye),[[m,!t(ee)]]),c(e("img",{src:t(ee),class:b(["object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable",t(te)||t(R)?"border-2 border-red-400":"border-none"])},null,10,He),[[m,t(ee)]]),e("input",{id:"inputCoverFile",ref_key:"selectedNewCoverRef",ref:$,type:"file",accept:"image/png, image/gif, image/jpeg",class:"hidden",onChange:K},null,544),e("button",{id:"selectNewCoverButton",class:"mt-2 w-full primary-button",onClick:i[4]||(i[4]=_=>X())},u(a.$t("profile.forms.update.chooseNewCover")),1),e("div",We,[e("button",{class:b(["flex flex-row mt-2 w-full md:w-auto",[t(Z)?"primary-button cursor-pointer":"disabled-button cursor-not-allowed",t(H)?"disabled-button cursor-not-allowed":"primary-button cursor-pointer"]]),onClick:i[5]||(i[5]=_=>X&&!t(H)?Ce():null)},[c(y(ne,{class:"mr-2"},null,512),[[m,t(H)]]),Q(" "+u(t(H)?a.$t("updating"):a.$t("update")),1)],2)]),c(e("div",Je,[Q(u(a.$t("profile.forms.update.fileTooLarge"))+" ",1),Qe,Q(" "+u(a.$t("profile.forms.update.coverMaxAllowedFileSize")),1)],512),[[m,t(te)]]),c(e("div",{class:"mt-2 w-full text-center text-failure"},u(t(R)),513),[[m,t(R)!=""]]),c(e("div",{class:"mt-2 w-full text-center text-success"},u(a.$t("updated")),513),[[m,t(B)]])])]),Xe,e("form",{id:n,class:"mb-4",onSubmit:i[14]||(i[14]=D(_=>p(),["prevent"]))},[e("div",Ze,[e("n-validate",null,[e("label",et,u(a.$t("profile.forms.update.name")),1),e("div",tt,[c(e("input",{"onUpdate:modelValue":i[6]||(i[6]=_=>t(o).name=_),type:"text",class:b(["form-input input",[{"pointer-events-none cursor-not-allowed":t(d).basic.loading}]])},null,2),[[j,t(o).name]])])])]),e("div",st,[e("n-validate",null,[e("label",ot,u(a.$t("profile.forms.update.penName")),1),e("div",lt,[c(e("input",{"onUpdate:modelValue":i[7]||(i[7]=_=>t(o).penName=_),type:"text",maxlength:"12",class:b(["form-input input",{"pointer-events-none cursor-not-allowed":t(d).username.loading}]),onInput:i[8]||(i[8]=_=>s()),onKeydown:i[9]||(i[9]=O(D(()=>{},["prevent"]),["space"]))},null,34),[[j,t(o).penName]]),c(e("div",{class:"input-error"},u(a.$t("profile.forms.update.penNameTaken")),513),[[m,t(l)]])])])]),e("div",nt,[e("label",at,u(a.$t("profile.forms.update.gender")),1),e("div",rt,[e("div",it,[e("div",{class:b(["flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon",{"button-color text-white":t(o).gender==="m"}]),onClick:i[10]||(i[10]=_=>t(o).gender="m")},u(a.$t("male")),3),e("div",{class:b(["flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon",{"button-color text-white":t(o).gender==="f"}]),onClick:i[11]||(i[11]=_=>t(o).gender="f")},u(a.$t("female")),3)])])]),e("div",ut,[e("n-validate",null,[e("label",dt,u(a.$t("profile.forms.update.bio")),1),e("div",ct,[y(G,null,{default:be(()=>[y(t(Pe.exports.VueEditor),{modelValue:t(o).bio,"onUpdate:modelValue":i[12]||(i[12]=_=>t(o).bio=_),editorToolbar:[[{size:["normal","large"]}],["bold","italic","underline","strike"],["link"],[{color:[]},{background:[]}],["clean"]]},null,8,["modelValue"])]),_:1})])])]),e("div",pt,[e("n-validate",null,[e("label",ft,u(a.$t("profile.forms.update.location")),1),e("div",mt,[c(e("input",{"onUpdate:modelValue":i[13]||(i[13]=_=>t(o).location=_),type:"text",class:b(["form-input input",{"pointer-events-none cursor-not-allowed":t(d).basic.loading}])},null,2),[[j,t(o).location]])])])]),e("div",vt,[e("div",null,[c(e("span",gt,[c(y(ne,{class:"mr-2"},null,512),[[m,t(d).basic.loading]]),Q(" "+u(t(d).basic.loading?a.$t("updating"):a.$t("updated")),1)],512),[[m,t(d).basic.loading||t(d).basic.success]])]),e("button",{type:"submit",class:b(["flex flex-row w-full md:w-auto",t(d).basic.buttonDisabled?"disabled-button":"primary-button"])},[c(y(ne,{class:"mr-2"},null,512),[[m,t(d).basic.loading]]),Q(" "+u(t(d).basic.loading?a.$t("updating"):a.$t("update")),1)],2)])],32),bt,e("form",{id:x,onSubmit:i[18]||(i[18]=D(_=>w(),["prevent"]))},[e("div",ht,[e("n-validate",{for:"=username",name:a.$t("profile.forms.update.username")},[e("label",_t,u(a.$t("profile.forms.update.username")),1),e("div",yt,[c(e("input",{"onUpdate:modelValue":i[15]||(i[15]=_=>t(o).username=_),type:"text",maxlength:"12",class:b(["form-input input",{"pointer-events-none cursor-not-allowed":t(d).username.loading}]),rules:"required|min:5",onInput:i[16]||(i[16]=_=>k()),onKeydown:i[17]||(i[17]=O(D(()=>{},["prevent"]),["space"]))},null,34),[[j,t(o).username]])])],8,wt)]),e("div",{class:b(["flex flex-row justify-between w-full",{"cursor-not-allowed":t(g)}])},[e("div",null,[c(e("span",{class:"text-success"},u(t(d).username.loading?a.$t("profile.forms.update.changingYourUsername"):a.$t("profile.forms.update.usernameChanged")),513),[[m,t(d).username.loading||t(d).username.success]])]),e("button",{type:"submit",class:b(["w-full md:w-auto",t(d).username.buttonDisabled?"disabled-button":"primary-button"])},[c(y(ne,{class:"mr-2"},null,512),[[m,t(d).username.loading||t(d).username.checkingValidity]]),c(e("span",null,u(t(d).username.loading?a.$t("profile.forms.update.changingYourUsername"):a.$t("profile.forms.update.changeUsername")),513),[[m,!t(d).username.checkingValidity]]),c(e("span",null,"Checking..",512),[[m,t(d).username.checkingValidity]])],2)],2)],32)])}}},kt=ue($t,[["__scopeId","data-v-fde694fc"]]);const xt={class:"w-full"},Ct={class:"input-block"},St={class:"font-semibold"},At={class:"field"},It={class:"flex flex-row"},Nt=["placeholder"],Ut={class:"input-block"},Vt={class:"font-semibold"},Et={class:"field"},Dt={class:"flex flex-row"},Pt=["placeholder"],jt={class:"input-block"},Ft={class:"font-semibold"},Tt={class:"field"},Lt={class:"flex flex-row"},Mt=["placeholder"],Ot={class:"input-block"},Kt={class:"font-semibold"},Bt={class:"field"},Rt={class:"flex flex-row"},Gt=["placeholder"],zt={class:"input-block"},qt={class:"font-semibold"},Yt={class:"field"},Ht={class:"flex flex-row"},Wt=["placeholder"],Jt={class:"input-block"},Qt={class:"font-semibold"},Xt={class:"field"},Zt={class:"flex flex-row"},es=["placeholder"],ts={class:"input-block"},ss={class:"font-semibold"},os={class:"field"},ls={class:"flex flex-row"},ns=["placeholder"],as={class:"input-block"},rs={class:"font-semibold"},is={class:"field"},us={class:"flex flex-row"},ds=["placeholder"],cs={class:"input-block"},ps={class:"font-semibold"},fs={class:"field"},ms={class:"flex flex-row"},vs=["placeholder"],gs={class:"input-block"},bs={class:"font-semibold"},hs={class:"field"},ws={class:"flex flex-row"},_s=["placeholder"],ys={class:"flex flex-row justify-between mt-2 w-full"},$s={__name:"Social",setup(F){const f=pe(),{oApiConfiguration:A,fetchOptions:v}=fe(),S=ge(A,v()),{t:C}=ie(),{$router:I}=me();ve(()=>{f.loggedIn||I.push("/")}),he(()=>{E()});const E=async()=>{if(f.loggedIn){const[l,s]=await S.getInfo(f.user.id);s||(r.value.facebook=l.user_socials.facebook,r.value.twitter=l.user_socials.twitter,r.value.instagram=l.user_socials.instagram,r.value.patreon=l.user_socials.patreon,r.value.youtube=l.user_socials.youtube,r.value.twitch=l.user_socials.twitch,r.value.discord=l.user_socials.discord,r.value.picarto=l.user_socials.picarto,r.value.gumroad=l.user_socials.gumroad,r.value.site=l.user_socials.personal_website)}},o=h({socials:{loading:!1,success:!1,buttonDisabled:!1}}),N="update-social-form",r=h({facebook:"",twitter:"",instagram:"",patreon:"",youtube:"",twitch:"",discrod:"",picarto:"",gumroad:"",site:""}),d=async()=>{re().validate(N,C),o.value.socials.loading=!0;const[l,s]=await S.updateSocials({userId:f.user.id,facebook:r.value.facebook,twitter:r.value.twitter,instagram:r.value.instagram,patreon:r.value.patreon,youtube:r.value.youtube,twitch:r.value.twitch,discord:r.value.discord,picarto:r.value.picarto,gumroad:r.value.gumroad,site:r.value.site});!l&&s?o.value.socials.success=!1:o.value.socials.success=!0,o.value.socials.loading=!1};return(l,s)=>(z(),oe("div",xt,[e("form",{id:N,onSubmit:s[20]||(s[20]=D(n=>d(),["prevent"]))},[e("n-validate",Ct,[e("label",St,u(l.$t("profile.forms.update.socials.facebook")),1),e("div",At,[e("div",It,[y(V,{name:"i-logos-facebook"}),c(e("input",{"onUpdate:modelValue":s[0]||(s[0]=n=>t(r).facebook=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.facebookPlaceholder"),onKeydown:s[1]||(s[1]=O(D(()=>{},["prevent"]),["space"]))},null,42,Nt),[[j,t(r).facebook]])])])]),e("n-validate",Ut,[e("label",Vt,u(l.$t("profile.forms.update.socials.twitter")),1),e("div",Et,[e("div",Dt,[y(V,{name:"i-logos-twitter"}),c(e("input",{"onUpdate:modelValue":s[2]||(s[2]=n=>t(r).twitter=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.twitterPlaceholder"),onKeydown:s[3]||(s[3]=O(D(()=>{},["prevent"]),["space"]))},null,42,Pt),[[j,t(r).twitter]])])])]),e("n-validate",jt,[e("label",Ft,u(l.$t("profile.forms.update.socials.instagram")),1),e("div",Tt,[e("div",Lt,[y(V,{name:"i-ion-logo-instagram"}),c(e("input",{"onUpdate:modelValue":s[4]||(s[4]=n=>t(r).instagram=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.instagramPlaceholder"),onKeydown:s[5]||(s[5]=O(D(()=>{},["prevent"]),["space"]))},null,42,Mt),[[j,t(r).instagram]])])])]),e("n-validate",Ot,[e("label",Kt,u(l.$t("profile.forms.update.socials.patreon")),1),e("div",Bt,[e("div",Rt,[y(V,{name:"i-logos-patreon"}),c(e("input",{"onUpdate:modelValue":s[6]||(s[6]=n=>t(r).patreon=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.patreonPlaceholder"),onKeydown:s[7]||(s[7]=O(D(()=>{},["prevent"]),["space"]))},null,42,Gt),[[j,t(r).patreon]])])])]),e("n-validate",zt,[e("label",qt,u(l.$t("profile.forms.update.socials.youtube")),1),e("div",Yt,[e("div",Ht,[y(V,{name:"i-logos-youtube-icon"}),c(e("input",{"onUpdate:modelValue":s[8]||(s[8]=n=>t(r).youtube=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.youtubePlaceholder"),onKeydown:s[9]||(s[9]=O(D(()=>{},["prevent"]),["space"]))},null,42,Wt),[[j,t(r).youtube]])])])]),e("n-validate",Jt,[e("label",Qt,u(l.$t("profile.forms.update.socials.twitch")),1),e("div",Xt,[e("div",Zt,[y(V,{name:"i-logos-twitch"}),c(e("input",{"onUpdate:modelValue":s[10]||(s[10]=n=>t(r).twitch=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.twitchPlaceholder"),onKeydown:s[11]||(s[11]=O(D(()=>{},["prevent"]),["space"]))},null,42,es),[[j,t(r).twitch]])])])]),e("n-validate",ts,[e("label",ss,u(l.$t("profile.forms.update.socials.discord")),1),e("div",os,[e("div",ls,[y(V,{name:"i-logos-discord-icon"}),c(e("input",{"onUpdate:modelValue":s[12]||(s[12]=n=>t(r).discord=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.discordPlaceholder"),onKeydown:s[13]||(s[13]=O(D(()=>{},["prevent"]),["space"]))},null,42,ns),[[j,t(r).discord]])])])]),e("n-validate",as,[e("label",rs,u(l.$t("profile.forms.update.socials.picarto")),1),e("div",is,[e("div",us,[y(V,{name:"i-cib-picarto-tv","icon-color":"bg-green-600"}),c(e("input",{"onUpdate:modelValue":s[14]||(s[14]=n=>t(r).picarto=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.picartoPlaceholder"),onKeydown:s[15]||(s[15]=O(D(()=>{},["prevent"]),["space"]))},null,42,ds),[[j,t(r).picarto]])])])]),e("n-validate",cs,[e("label",ps,u(l.$t("profile.forms.update.socials.gumroad")),1),e("div",fs,[e("div",ms,[y(V,{name:"i-cib-gumroad"}),c(e("input",{"onUpdate:modelValue":s[16]||(s[16]=n=>t(r).gumroad=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.gumroadPlaceholder"),onKeydown:s[17]||(s[17]=O(D(()=>{},["prevent"]),["space"]))},null,42,vs),[[j,t(r).gumroad]])])])]),e("n-validate",gs,[e("label",bs,u(l.$t("profile.forms.update.socials.personalWebsite")),1),e("div",hs,[e("div",ws,[y(V,{name:"i-ph-link-simple-break-bold"}),c(e("input",{"onUpdate:modelValue":s[18]||(s[18]=n=>t(r).site=n),type:"text",class:b(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":t(o).socials.loading}]]),placeholder:l.$t("profile.forms.update.socials.personalWebsitePlaceholder"),onKeydown:s[19]||(s[19]=O(D(()=>{},["prevent"]),["space"]))},null,42,_s),[[j,t(r).site]])])])]),e("div",ys,[e("div",null,[c(e("span",{class:"text-success"},u(t(o).socials.loading?l.$t("updating"):l.$t("updated")),513),[[m,t(o).socials.loading||t(o).socials.success]])]),e("button",{type:"submit",class:b(["w-full md:w-auto",t(o).socials.buttonDisabled?"secondary-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(t(o).socials.loading?l.$t("updating"):l.$t("update")),3)])],32)]))}},ks=ue($s,[["__scopeId","data-v-a740e068"]]);const xe=F=>(ye("data-v-11a3221d"),F=F(),$e(),F),xs={class:"w-full"},Cs={class:"mb-2 input-block"},Ss={class:"font-semibold"},As={class:"field"},Is={for:"explicit-toggle",class:"inline-flex relative items-center mb-5 cursor-pointer"},Ns=["checked"],Us=xe(()=>e("div",{class:"w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"},null,-1)),Vs={class:"ml-2"},Es={key:0,class:"mb-2 input-block"},Ds={class:"font-semibold"},Ps={class:"field"},js={for:"gore-toggle",class:"inline-flex relative items-center mb-5 cursor-pointer"},Fs=["checked"],Ts=xe(()=>e("div",{class:"w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"},null,-1)),Ls={class:"ml-2"},Ms={class:"flex flex-row justify-between w-full"},Os={__name:"Settings",setup(F){const f=pe(),{oApiConfiguration:A,fetchOptions:v}=fe(),S=ge(A,v()),{t:C}=ie(),{$router:I}=me();ve(()=>{f.loggedIn||I.push("/")}),he(()=>{E()});const E=async()=>{if(f.loggedIn){const[l,s]=await S.getInfo(f.user.id);s||(r.value.showExplicit=!!l.user_settings.show_explicit,r.value.showGore=!!l.user_settings.show_gore)}},o=h({settings:{loading:!1,success:!1,buttonDisabled:!1}}),N="update-setting-form",r=h({showExplicit:!1,showGore:!1}),d=async()=>{re().validate(N,C),o.value.settings.loading=!0;const[l,s]=await S.updateSettings({userId:f.user.id,showExplicit:r.value.showExplicit,showGore:r.value.showGore});!l&&s?o.value.settings.success=!1:(o.value.settings.success=!0,f.user.user_settings.show_explicit=r.value.showExplicit?1:0,f.user.user_settings.show_gore=r.value.showGore?1:0),o.value.settings.loading=!1};return(l,s)=>(z(),oe("div",xs,[e("form",{id:N,onSubmit:s[2]||(s[2]=D(n=>d(),["prevent"]))},[e("div",Cs,[e("label",Ss,u(l.$t("explicitContent")),1),e("div",As,[e("label",Is,[e("input",{onClick:s[0]||(s[0]=n=>t(r).showExplicit=!t(r).showExplicit),id:"explicit-toggle",type:"checkbox",class:"sr-only peer",checked:t(r).showExplicit},null,8,Ns),Us,e("span",Vs,u(l.$t("profile.forms.update.showExplicitContent")),1)])])]),t(r).showExplicit?(z(),oe("div",Es,[e("label",Ds,u(l.$t("goreContent")),1),e("div",Ps,[e("label",js,[e("input",{onClick:s[1]||(s[1]=n=>t(r).showGore=!t(r).showGore),id:"gore-toggle",type:"checkbox",class:"sr-only peer",checked:t(r).showGore},null,8,Fs),Ts,e("span",Ls,u(l.$t("profile.forms.update.showGoreContent")),1)])])])):ae("",!0),e("div",Ms,[e("div",null,[c(e("span",{class:"text-success"},u(t(o).settings.loading?l.$t("updating"):l.$t("updated")),513),[[m,t(o).settings.loading||t(o).settings.success]])]),e("button",{type:"submit",class:b(["w-full md:w-auto",t(o).settings.buttonDisabled?"secondary-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(t(o).settings.loading?l.$t("updating"):l.$t("update")),3)])],32)]))}},Ks=ue(Os,[["__scopeId","data-v-11a3221d"]]);const Bs={class:"modal-layer xl:w-3/12 lg:w-2/5"},Rs={class:"flex flex-col justify-center w-full text-center"},Gs={class:"mb-6"},zs={class:"flex flex-row justify-center mb-4 w-full text-base font-bold text-green-500"},qs={__name:"SuccessMessageModal",props:{message:{type:String,default:"Success"},autoCloseAfterMs:{type:Number,default:2e3}},setup(F){const f=()=>{ke().closeModal("success-modal")};return(A,v)=>(z(),oe("div",null,[e("div",Bs,[e("div",Rs,[e("div",Gs,[e("div",zs,[y(V,{class:"mr-2 font-bold text-green-400",name:"i-mdi-check-all","text-size":"text-xl"}),Q(" "+u(A.$t("success")),1)]),e("p",null,u(F.message),1)]),e("button",{onClick:v[0]||(v[0]=S=>f()),class:"success-button-close"},u(A.$t("close").toUpperCase()),1)])])]))}},Ys=ue(qs,[["__scopeId","data-v-9730d986"]]);const Hs={class:"w-full"},Ws={class:"input-block"},Js={class:"font-semibold"},Qs={class:"field"},Xs=["readonly","placeholder"],Zs={class:"flex flex-row justify-end"},eo={class:"input-block"},to={class:"font-semibold"},so={class:"field"},oo=["readonly","placeholder"],lo={class:"flex flex-row justify-between w-full"},no={__name:"Password",setup(F){const f=pe(),{oApiConfiguration:A,fetchOptions:v}=fe(),S=ge(A,v()),{t:C}=ie(),{$router:I}=me();ve(()=>{f.loggedIn||I.push("/")});const E=h(""),o=h(""),N=h(!1),r=()=>{E.value="",o.value="",N.value=!1},d=async()=>{N.value=!1,o.value="",n.value="";const[x,w]=await S.checkCurrentPassword({userId:f.user.id,currentPassword:E.value});w?o.value=w:N.value=!0},l=h({settings:{loading:!1,success:!1,buttonDisabled:!1}}),s="update-setting-form",n=h(""),p=h(""),g=()=>{n.value="",p.value=""},k=async()=>{l.value.settings.loading=!0,re().validate(s,C);const[x,w]=await S.updateCurrentPassword({userId:f.user.id,currentPassword:E.value,newPassword:n.value});w?(l.value.settings.success=!1,p.value=w):(l.value.settings.success=!0,g(),r(),ke().openModal("success-modal")),l.value.settings.loading=!1};return(x,w)=>(z(),oe("div",Hs,[e("form",{onSubmit:w[1]||(w[1]=D(U=>d(),["prevent"]))},[e("div",Ws,[e("label",Js,u(x.$t("profile.forms.update.password.currentPasswordLabel")),1),e("div",Qs,[c(e("input",{"onUpdate:modelValue":w[0]||(w[0]=U=>_e(E)?E.value=U:null),type:"password",rules:"required|min:6|containNumber|containSymbol",class:b(["form-input input",{"cursor-not-allowed pointer-events-none":t(N)}]),readonly:t(N),placeholder:x.$t("profile.forms.update.password.currentPassword")},null,10,Xs),[[j,t(E)]]),c(e("div",{class:"error-message"},u(t(o)),513),[[m,t(o)!==""]])])]),c(e("div",Zs,[e("button",{class:b([t(E)===""?"disabled-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(x.$t("next")),3)],512),[[m,!t(N)]])],32),c(e("form",{id:s,onSubmit:w[3]||(w[3]=D(U=>k(),["prevent"]))},[e("div",eo,[e("label",to,u(x.$t("profile.forms.update.password.newPassword")),1),e("div",so,[c(e("input",{"onUpdate:modelValue":w[2]||(w[2]=U=>_e(n)?n.value=U:null),type:"password",rules:"required|min:6|containNumber|containSymbol",class:b(["form-input input",{"cursor-not-allowed pointer-events-none":t(l).settings.loading}]),readonly:t(l).settings.loading,placeholder:x.$t("profile.forms.update.password.newPassword")},null,10,oo),[[j,t(n)]]),c(e("div",{class:"error-message"},u(t(p)),513),[[m,t(p)!==""]])])]),e("div",lo,[e("div",null,[c(e("span",{class:"text-success"},u(t(l).settings.loading?x.$t("updating"):""),513),[[m,t(l).settings.loading||t(l).settings.success]])]),e("button",{type:"submit",class:b(["w-full md:w-auto",t(l).settings.buttonDisabled?"secondary-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(t(l).settings.loading?x.$t("updating"):x.$t("update")),3)])],544),[[m,t(N)]]),y(Ys,{id:"success-modal",class:"modal",message:x.$t("profile.forms.update.password.success"),"auto-close-after-ms":1e3},null,8,["message"])]))}},ao=ue(no,[["__scopeId","data-v-a2d8432f"]]),ro={class:"flex flex-row w-full"},io={class:"mr-2 md:mr-4 lg:w-1/5"},uo={class:"hidden-lg-flex"},co={class:"hidden-lg-flex"},po={class:"hidden-lg-flex"},fo={class:"hidden-lg-flex"},mo={class:"hidden-lg-flex"},vo={class:"w-full"},xo={__name:"setting",setup(F){const{t:f}=ie(),A=h(f("meta.title.profile.profile"));Ie({title:Ne(()=>A.value)});const v=h({currentState:"profile"});Ue(()=>v.value.currentState,C=>{C==="profile"?A.value=f("meta.title.profile.profile"):C==="social"?A.value=f("meta.title.profile.social"):C==="password"?A.value=f("meta.title.profile.password"):A.value=f("meta.title.profile.settings")});const S=C=>{v.value.currentState=C};return(C,I)=>{const E=Ve;return z(),le(Ee,{"hide-side":!0,"with-footer":!0,"no-right-side":!0},{default:be(()=>[e("div",ro,[e("div",io,[y(E,{to:"/profile",class:"mb-6 w-full light-bordered-button"},{default:be(()=>[y(V,{name:"i-typcn-arrow-back",class:"text-lg text-white lg:mr-2 hover:text-white"}),e("span",uo,u(C.$t("settings.backToProfile")),1)]),_:1}),e("div",{class:b(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":t(v).currentState==="profile"}]),onClick:I[0]||(I[0]=o=>S("profile"))},[c(y(V,{name:"i-fluent-person-32-regular",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState==="profile"]]),c(y(V,{name:"i-fluent-person-32-regular",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState!=="profile"]]),e("span",co,u(C.$t("settings.profile")),1)],2),e("div",{class:b(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":t(v).currentState==="social"}]),onClick:I[1]||(I[1]=o=>S("social"))},[c(y(V,{name:"i-ion-share-social-outline",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState==="social"]]),c(y(V,{name:"i-ion-share-social-outline",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState!=="social"]]),e("span",po,u(C.$t("settings.social")),1)],2),e("div",{class:b(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":t(v).currentState==="password"}]),onClick:I[2]||(I[2]=o=>S("password"))},[c(y(V,{name:"i-material-symbols-key-outline-rounded",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState==="password"]]),c(y(V,{name:"i-material-symbols-key-outline-rounded",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState!=="password"]]),e("span",fo,u(C.$t("settings.password")),1)],2),e("div",{class:b(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":t(v).currentState==="settings"}]),onClick:I[3]||(I[3]=o=>S("settings"))},[c(y(V,{name:"i-ph-gear-six",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState==="settings"]]),c(y(V,{name:"i-ph-gear-six",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[m,t(v).currentState!=="settings"]]),e("span",mo,u(C.$t("settings.settings")),1)],2)]),e("div",vo,[t(v).currentState==="profile"?(z(),le(kt,{key:0})):ae("",!0),t(v).currentState==="social"?(z(),le(ks,{key:1})):ae("",!0),t(v).currentState==="settings"?(z(),le(Ks,{key:2})):ae("",!0),t(v).currentState==="password"?(z(),le(ao,{key:3})):ae("",!0)])])]),_:1})}}};export{xo as default};
