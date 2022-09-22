import{H as ke,h as Z,i as ee,a as te,A as se,X as ae,k as le,r as p,o as C,l as R,m as e,t as u,s as o,v as c,u as J,J as f,b,p as S,E as k,S as A,F as y,cf as pe,e as fe,K as oe,L as ne,q as T,bP as Ce,c as X,w as Ie}from"./entry.ece145ee.js";import{u as Se}from"./useI18n.97a1667f.js";import{u as G,L as Ne}from"./Layout.811f3195.js";import{_ as $}from"./Icon.6574d282.js";import{S as B}from"./Spinner.56d480ea.js";import{u as ie}from"./useUser.094e0fe8.js";import{_ as ue}from"./_plugin-vue_export-helper.a1a6add7.js";import"./user-counters-api.63ef0669.js";const K=g=>(oe("data-v-0cd5fd9d"),g=g(),ne(),g),Ae={class:"flex flex-col w-full"},Ue={class:"mb-4 w-44"},Ve={class:"font-semibold"},De={class:"mt-2"},Ee=["src"],Fe=["src"],je={class:"mt-2 w-full text-center text-failure"},Le=K(()=>e("br",null,null,-1)),Be=K(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),Re={class:"mb-4"},Te={class:"font-semibold"},Ke={class:"mt-2"},Ye=["src"],Me=["src"],ze={class:"flex flex-row justify-end w-full"},Oe={class:"mt-2 w-full text-center text-failure"},Pe=K(()=>e("br",null,null,-1)),qe=K(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),He={class:"input-block"},Je={class:"font-semibold"},Xe={class:"field"},Ge={class:"input-block"},Qe={class:"font-semibold"},We={class:"field"},Ze={class:"mb-2 input-block"},et={class:"font-semibold"},tt={class:"field"},st={class:"flex flex-row p-1 w-full rounded-md cursor-pointer md:w-min theme-color"},at={class:"input-block"},lt={class:"font-semibold"},ot={class:"field"},nt={class:"input-block"},it={class:"font-semibold"},ut={class:"field"},rt={class:"flex flex-row justify-between w-full"},dt={class:"flex flex-row text-success"},ct=K(()=>e("div",{class:"mb-4 custom-divider"},null,-1)),vt=["name"],pt={class:"font-semibold"},ft={class:"field"},mt={__name:"Information",setup(g){const v=ke(),m=Z(),{oApiConfiguration:I,fetchOptions:w}=ee(),_=ie(I,w()),{$router:E}=te(),{t:U}=se();ae(()=>{m.loggedIn||E.push("/")}),le(()=>{r()});const s=p({name:"",username:"",penName:"",bio:"",gender:"m",location:""}),x=p({username:"",penName:""}),r=async()=>{if(m.loggedIn){const[t,a]=await _.getInfo(m.user.id);a||(s.value.name=t.name,s.value.username=t.username,x.value.username=t.username,s.value.penName=t.pen_name,x.value.penName=t.pen_name,s.value.bio=t.bio,s.value.gender=t.gender,s.value.location=t.location)}},l=p({basic:{loading:!1,success:!1,buttonDisabled:!1,checkingValidity:!1},username:{loading:!1,success:!1,buttonDisabled:!0,checkingValidity:!1}}),d=p(!1),n=async()=>{s.value.penName===""&&(d.value=!1,l.value.basic.buttonDisabled=!0,l.value.basic.checkingValidity=!1),s.value.penName.length>=4&&s.value.penName.length<=12?(l.value.basic.buttonDisabled=!0,l.value.basic.checkingValidity=!0,await pe.exports.debounce(async t=>{if(s.value.penName===x.value.penName)d.value=!1,l.value.basic.buttonDisabled=!1,l.value.basic.checkingValidity=!1;else{const[a,i]=await _.checkPenNameAvailability(s.value.penName);!a&&i&&m.user.pen_name!==s.value.penName?(d.value=!0,l.value.basic.buttonDisabled=!0,l.value.basic.checkingValidity=!1):(d.value=!1,l.value.basic.buttonDisabled=!1,l.value.basic.checkingValidity=!1)}},700)()):d.value=!1},h="basic-information-form",me=async()=>{if(G().validate(h,U),!d.value){l.value.basic.loading=!0;const[t,a]=await _.updateInfo({userId:m.user.id,name:s.value.name,gender:s.value.gender,bio:s.value.bio,location:s.value.location,penName:s.value.penName});!t&&a?l.value.basic.loading=!1:l.value.basic.success=!0,l.value.basic.loading=!1}},N=p(!1),be=async()=>{s.value.username===""&&(N.value=!1,l.value.username.buttonDisabled=!0,l.value.username.checkingValidity=!1),s.value.username.length>=4&&s.value.username.length<=12?(l.value.username.buttonDisabled=!0,l.value.username.checkingValidity=!0,await pe.exports.debounce(async t=>{if(s.value.username===x.value.username)N.value=!1,l.value.username.buttonDisabled=!1,l.value.username.checkingValidity=!1;else{const[a,i]=await _.checkUsernameAvailability(s.value.username);!a&&i?(N.value=!0,l.value.username.buttonDisabled=!0,l.value.username.checkingValidity=!1):(N.value=!1,l.value.username.buttonDisabled=!1,l.value.username.checkingValidity=!1)}},500)()):N.value=!1},de="change-username-form",ge=async()=>{if(G().validate(de,U),!N.value){l.value.username.loading=!0;const[t,a]=await _.changeUsername(s.value.username);!t&&a?l.value.username.loading=!1:l.value.username.success=!0,l.value.username.loading=!1}},ce=()=>{document.getElementById("inputAvatarFile").click()},M=p(""),z=p(""),he=t=>{const a=t.target.files[0];z.value=URL.createObjectURL(a),M.value=a},V=p(!1),Q=p(!1),O=p(!1),we=p(null),F=p(""),_e=async()=>{if(M.value){Q.value=!1,V.value=!0,O.value=!1,F.value="";const t=M.value,a=new FormData;a.append("avatar",t);try{const i=await fe.post(v.public.apiUrl+"/user/update/avatar",a,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${m.a4ht0jen}`}});Q.value=!0}catch(i){const L=i.response;L.data.error==="File too large"?O.value=!0:F.value=L.data.message}V.value=!1}},ve=()=>{document.getElementById("inputCoverFile").click()},P=p(""),q=p(""),ye=t=>{const a=t.target.files[0];q.value=URL.createObjectURL(a),P.value=a},D=p(!1),W=p(!1),H=p(!1),$e=p(null),j=p(""),xe=async()=>{if(P.value){W.value=!1,D.value=!0,H.value=!1,j.value="";const t=P.value,a=new FormData;a.append("cover",t);try{const i=await fe.post(v.public.apiUrl+"/user/update/cover",a,{headers:{"Content-Type":"multipart/form-data",Authorization:`Bearer ${m.a4ht0jen}`}});W.value=!0}catch(i){const L=i.response;L.data.error==="File too large"?H.value=!0:j.value=L.data.message}D.value=!1}};return(t,a)=>(C(),R("div",Ae,[e("div",Ue,[e("label",Ve,u(t.$t("profile.forms.update.avatar")),1),e("div",De,[o(e("img",{src:t.avatarCoverUrl(J(m).user.avatar_bucket,J(m).user.avatar_filename),class:"avatar",onError:a[0]||(a[0]=(...i)=>t.imageLoadError&&t.imageLoadError(...i))},null,40,Ee),[[c,!z.value]]),o(e("img",{src:z.value,class:f(["avatar",O.value||F.value?"border-2 border-red-400":"border-none"])},null,10,Fe),[[c,z.value]]),e("input",{id:"inputAvatarFile",ref_key:"selectedNewAvatarRef",ref:we,type:"file",accept:"image/png, image/gif, image/jpeg",class:"hidden",onChange:he},null,544),e("button",{id:"selectNewAvatarButton",class:"mt-2 w-full primary-button",onClick:a[1]||(a[1]=i=>ce())},u(t.$t("profile.forms.update.chooseNewAvatar")),1),e("button",{class:f(["flex flex-row mt-2 w-full",[M.value?"primary-button cursor-pointer":"disabled-button cursor-not-allowed",V.value?"disabled-button cursor-not-allowed":"primary-button cursor-pointer"]]),onClick:a[2]||(a[2]=i=>ce&&!V.value?_e():null)},[o(b(B,{class:"mr-2"},null,512),[[c,V.value]]),S(" "+u(V.value?t.$t("updating"):t.$t("update")),1)],2),o(e("div",je,[S(u(t.$t("profile.forms.update.fileTooLarge"))+" ",1),Le,S(" "+u(t.$t("profile.forms.update.avatarMaxAllowedFileSize")),1)],512),[[c,O.value]]),o(e("div",{class:"mt-2 w-full text-center text-failure"},u(F.value),513),[[c,F.value!=""]]),o(e("div",{class:"mt-2 w-full text-center text-success"},u(t.$t("updated")),513),[[c,Q.value]])])]),Be,e("div",Re,[e("label",Te,u(t.$t("profile.forms.update.cover")),1),e("div",Ke,[o(e("img",{src:t.avatarCoverUrl(J(m).user.cover_bucket,J(m).user.cover_filename),class:"object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable",onError:a[3]||(a[3]=(...i)=>t.defaultCoverImage&&t.defaultCoverImage(...i))},null,40,Ye),[[c,!q.value]]),o(e("img",{src:q.value,class:f(["object-cover object-top w-full h-28 rounded-md md:h-48 lg:h-64 xl:h-72 unselectable",H.value||j.value?"border-2 border-red-400":"border-none"])},null,10,Me),[[c,q.value]]),e("input",{id:"inputCoverFile",ref_key:"selectedNewCoverRef",ref:$e,type:"file",accept:"image/png, image/gif, image/jpeg",class:"hidden",onChange:ye},null,544),e("button",{id:"selectNewCoverButton",class:"mt-2 w-full primary-button",onClick:a[4]||(a[4]=i=>ve())},u(t.$t("profile.forms.update.chooseNewCover")),1),e("div",ze,[e("button",{class:f(["flex flex-row mt-2 w-full md:w-auto",[P.value?"primary-button cursor-pointer":"disabled-button cursor-not-allowed",D.value?"disabled-button cursor-not-allowed":"primary-button cursor-pointer"]]),onClick:a[5]||(a[5]=i=>ve&&!D.value?xe():null)},[o(b(B,{class:"mr-2"},null,512),[[c,D.value]]),S(" "+u(D.value?t.$t("updating"):t.$t("update")),1)],2)]),o(e("div",Oe,[S(u(t.$t("profile.forms.update.fileTooLarge"))+" ",1),Pe,S(" "+u(t.$t("profile.forms.update.coverMaxAllowedFileSize")),1)],512),[[c,H.value]]),o(e("div",{class:"mt-2 w-full text-center text-failure"},u(j.value),513),[[c,j.value!=""]]),o(e("div",{class:"mt-2 w-full text-center text-success"},u(t.$t("updated")),513),[[c,W.value]])])]),qe,e("form",{id:h,class:"mb-4",onSubmit:a[14]||(a[14]=y(i=>me(),["prevent"]))},[e("n-validate",He,[e("label",Je,u(t.$t("profile.forms.update.name")),1),e("div",Xe,[o(e("input",{"onUpdate:modelValue":a[6]||(a[6]=i=>s.value.name=i),type:"text",class:f(["form-input input",[{"pointer-events-none cursor-not-allowed":l.value.basic.loading}]])},null,2),[[k,s.value.name]])])]),e("n-validate",Ge,[e("label",Qe,u(t.$t("profile.forms.update.penName")),1),e("div",We,[o(e("input",{"onUpdate:modelValue":a[7]||(a[7]=i=>s.value.penName=i),type:"text",maxlength:"12",class:f(["form-input input",{"pointer-events-none cursor-not-allowed":l.value.username.loading}]),onInput:a[8]||(a[8]=i=>n()),onKeydown:a[9]||(a[9]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,s.value.penName]]),o(e("div",{class:"input-error"},u(t.$t("profile.forms.update.penNameTaken")),513),[[c,d.value]])])]),e("div",Ze,[e("label",et,u(t.$t("profile.forms.update.gender")),1),e("div",tt,[e("div",st,[e("div",{class:f(["flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon",{"button-color text-white":s.value.gender==="m"}]),onClick:a[10]||(a[10]=i=>s.value.gender="m")},u(t.$t("male")),3),e("div",{class:f(["flex flex-row justify-center py-2 px-3 w-full rounded-md parent-icon",{"button-color text-white":s.value.gender==="f"}]),onClick:a[11]||(a[11]=i=>s.value.gender="f")},u(t.$t("female")),3)])])]),e("n-validate",at,[e("label",lt,u(t.$t("profile.forms.update.bio")),1),e("div",ot,[o(e("textarea",{"onUpdate:modelValue":a[12]||(a[12]=i=>s.value.bio=i),class:f(["mb-1 form-input input",{"pointer-events-none cursor-not-allowed":l.value.basic.loading}]),rows:"8",cols:"0","data-gramm":"false"},null,2),[[k,s.value.bio]])])]),e("n-validate",nt,[e("label",it,u(t.$t("profile.forms.update.location")),1),e("div",ut,[o(e("input",{"onUpdate:modelValue":a[13]||(a[13]=i=>s.value.location=i),type:"text",class:f(["form-input input",{"pointer-events-none cursor-not-allowed":l.value.basic.loading}])},null,2),[[k,s.value.location]])])]),e("div",rt,[e("div",null,[o(e("span",dt,[o(b(B,{class:"mr-2"},null,512),[[c,l.value.basic.loading]]),S(" "+u(l.value.basic.loading?t.$t("updating"):t.$t("updated")),1)],512),[[c,l.value.basic.loading||l.value.basic.success]])]),e("button",{type:"submit",class:f(["flex flex-row w-full md:w-auto",l.value.basic.buttonDisabled?"disabled-button":"primary-button"])},[o(b(B,{class:"mr-2"},null,512),[[c,l.value.basic.loading]]),S(" "+u(l.value.basic.loading?t.$t("updating"):t.$t("update")),1)],2)])],32),ct,e("form",{id:de,onSubmit:a[18]||(a[18]=y(i=>ge(),["prevent"]))},[e("n-validate",{for:"=username",class:"input-block",name:t.$t("profile.forms.update.username")},[e("label",pt,u(t.$t("profile.forms.update.username")),1),e("div",ft,[o(e("input",{"onUpdate:modelValue":a[15]||(a[15]=i=>s.value.username=i),type:"text",maxlength:"12",class:f(["form-input input",{"pointer-events-none cursor-not-allowed":l.value.username.loading}]),rules:"required|min:5",onInput:a[16]||(a[16]=i=>be()),onKeydown:a[17]||(a[17]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,s.value.username]])])],8,vt),e("div",{class:f(["flex flex-row justify-between w-full",{"cursor-not-allowed":N.value}])},[e("div",null,[o(e("span",{class:"text-success"},u(l.value.username.loading?t.$t("profile.forms.update.changingYourUsername"):t.$t("profile.forms.update.usernameChanged")),513),[[c,l.value.username.loading||l.value.username.success]])]),e("button",{type:"submit",class:f(["w-full md:w-auto",l.value.username.buttonDisabled?"disabled-button":"primary-button"])},[o(b(B,{class:"mr-2"},null,512),[[c,l.value.username.loading||l.value.username.checkingValidity]]),o(e("span",null,u(l.value.username.loading?t.$t("profile.forms.update.changingYourUsername"):t.$t("profile.forms.update.changeUsername")),513),[[c,!l.value.username.checkingValidity]]),o(e("span",null,"Checking..",512),[[c,l.value.username.checkingValidity]])],2)],2)],32)]))}},bt=ue(mt,[["__scopeId","data-v-0cd5fd9d"]]),Y=g=>(oe("data-v-e9f97cb9"),g=g(),ne(),g),gt={class:"w-full"},ht={class:"input-block"},wt=Y(()=>e("label",{class:"font-semibold"},"Facebook",-1)),_t={class:"field"},yt={class:"flex flex-row"},$t={class:"input-block"},xt=Y(()=>e("label",{class:"font-semibold"},"Twitter",-1)),kt={class:"field"},Ct={class:"flex flex-row"},It={class:"input-block"},St=Y(()=>e("label",{class:"font-semibold"},"Instagram",-1)),Nt={class:"field"},At={class:"flex flex-row"},Ut={class:"input-block"},Vt=Y(()=>e("label",{class:"font-semibold"},"Patreon",-1)),Dt={class:"field"},Et={class:"flex flex-row"},Ft={class:"input-block"},jt=Y(()=>e("label",{class:"font-semibold"},"Youtube",-1)),Lt={class:"field"},Bt={class:"flex flex-row"},Rt={class:"flex flex-row justify-between mt-2 w-full"},Tt={__name:"Social",setup(g){const v=Z(),{oApiConfiguration:m,fetchOptions:I}=ee(),w=ie(m,I()),{t:_}=se(),{$router:E}=te();ae(()=>{v.loggedIn||E.push("/")}),le(()=>{U()});const U=async()=>{if(v.loggedIn){const[d,n]=await w.getInfo(v.user.id);n||(r.value.facebook=d.user_socials.facebook,r.value.twitter=d.user_socials.twitter,r.value.instagram=d.user_socials.instagram,r.value.patreon=d.user_socials.patreon,r.value.youtube=d.user_socials.youtube)}},s=p({socials:{loading:!1,success:!1,buttonDisabled:!1}}),x="update-social-form",r=p({facebook:"",twitter:"",instagram:"",patreon:"",youtube:""}),l=async()=>{G().validate(x,_),s.value.socials.loading=!0;const[d,n]=await w.updateSocials({userId:v.user.id,facebook:r.value.facebook,twitter:r.value.twitter,instagram:r.value.instagram,patreon:r.value.patreon,youtube:r.value.youtube});!d&&n?s.value.socials.success=!1:s.value.socials.success=!0,s.value.socials.loading=!1};return(d,n)=>(C(),R("div",gt,[e("form",{id:x,onSubmit:n[10]||(n[10]=y(h=>l(),["prevent"]))},[e("n-validate",ht,[wt,e("div",_t,[e("div",yt,[b($,{name:"i-logos-facebook"}),o(e("input",{"onUpdate:modelValue":n[0]||(n[0]=h=>r.value.facebook=h),type:"text",class:f(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":s.value.socials.loading}]]),placeholder:"Your facebook username (https://facebook.com/<your-username-here>)",onKeydown:n[1]||(n[1]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,r.value.facebook]])])])]),e("n-validate",$t,[xt,e("div",kt,[e("div",Ct,[b($,{name:"i-logos-twitter"}),o(e("input",{"onUpdate:modelValue":n[2]||(n[2]=h=>r.value.twitter=h),type:"text",class:f(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":s.value.socials.loading}]]),placeholder:"Your twitter username (twitter.com/<your-username-here>)",onKeydown:n[3]||(n[3]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,r.value.twitter]])])])]),e("n-validate",It,[St,e("div",Nt,[e("div",At,[b($,{name:"i-ion-logo-instagram"}),o(e("input",{"onUpdate:modelValue":n[4]||(n[4]=h=>r.value.instagram=h),type:"text",class:f(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":s.value.socials.loading}]]),placeholder:"Your instagram username (instagram.com/<your-username-here>)",onKeydown:n[5]||(n[5]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,r.value.instagram]])])])]),e("n-validate",Ut,[Vt,e("div",Dt,[e("div",Et,[b($,{name:"i-logos-patreon"}),o(e("input",{"onUpdate:modelValue":n[6]||(n[6]=h=>r.value.patreon=h),type:"text",class:f(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":s.value.socials.loading}]]),placeholder:"Your patreon username (patreon.com/<your-username-here>)",onKeydown:n[7]||(n[7]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,r.value.patreon]])])])]),e("n-validate",Ft,[jt,e("div",Lt,[e("div",Bt,[b($,{name:"i-logos-youtube-icon"}),o(e("input",{"onUpdate:modelValue":n[8]||(n[8]=h=>r.value.youtube=h),type:"text",class:f(["rounded-l-none form-input input",[{"pointer-events-none cursor-not-allowed":s.value.socials.loading}]]),placeholder:"Your full youtube URL",onKeydown:n[9]||(n[9]=A(y(()=>{},["prevent"]),["space"]))},null,34),[[k,r.value.youtube]])])])]),e("div",Rt,[e("div",null,[o(e("span",{class:"text-success"},u(s.value.socials.loading?d.$t("updating"):d.$t("updated")),513),[[c,s.value.socials.loading||s.value.socials.success]])]),e("button",{type:"submit",class:f(["w-full md:w-auto",s.value.socials.buttonDisabled?"secondary-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(s.value.socials.loading?d.$t("updating"):d.$t("update")),3)])],32)]))}},Kt=ue(Tt,[["__scopeId","data-v-e9f97cb9"]]),re=g=>(oe("data-v-6774a872"),g=g(),ne(),g),Yt={class:"w-full"},Mt={class:"mb-2 input-block"},zt={class:"font-semibold"},Ot={class:"field"},Pt=["for"],qt=re(()=>e("span",{class:"block w-10 h-6 bg-gray-300 rounded-full shadow-inner"},null,-1)),Ht={key:0,class:"block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ease-in-out focus-within:shadow-outline"},Jt=re(()=>e("input",{id:"unchecked",type:"checkbox",class:"absolute w-0 h-0 opacity-0"},null,-1)),Xt=[Jt],Gt={key:1,class:"block absolute inset-y-0 left-0 mt-1 ml-1 w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out transform translate-x-full focus-within:shadow-outline button-color"},Qt=re(()=>e("input",{id:"checked",type:"checkbox",class:"absolute w-0 h-0 opacity-0"},null,-1)),Wt=[Qt],Zt={class:"ml-2"},es={class:"flex flex-row justify-between w-full"},ts={__name:"Settings",setup(g){const v=Z(),{oApiConfiguration:m,fetchOptions:I}=ee(),w=ie(m,I()),{$router:_}=te(),{t:E}=se();ae(()=>{v.loggedIn||_.push("/")}),le(()=>{U()});const U=async()=>{if(v.loggedIn){const[d,n]=await w.getInfo(v.user.id);n||(r.value.showExplicit=!!d.user_settings.show_explicit)}},s=p({settings:{loading:!1,success:!1,buttonDisabled:!1}}),x="update-setting-form",r=p({showExplicit:!1}),l=async()=>{G().validate(x,E),s.value.settings.loading=!0;const[d,n]=await w.updateSettings({userId:v.user.id,showExplicit:r.value.showExplicit});!d&&n?s.value.settings.success=!1:(s.value.settings.success=!0,v.user.user_settings.show_explicit=r.value.showExplicit?1:0),s.value.settings.loading=!1};return(d,n)=>(C(),R("div",Yt,[e("form",{id:x,onSubmit:n[1]||(n[1]=y(h=>l(),["prevent"]))},[e("div",Mt,[e("label",zt,u(d.$t("explicitContent")),1),e("div",Ot,[e("label",{for:r.value.showExplicit?"unchecked":"checked",class:"inline-flex items-center mt-2"},[e("span",{class:"relative cursor-pointer",onClick:n[0]||(n[0]=h=>r.value.showExplicit=!r.value.showExplicit)},[qt,r.value.showExplicit?T("",!0):(C(),R("span",Ht,Xt)),r.value.showExplicit?(C(),R("span",Gt,Wt)):T("",!0)]),e("span",Zt,u(d.$t("profile.forms.update.showExplicitContent")),1)],8,Pt)])]),e("div",es,[e("div",null,[o(e("span",{class:"text-success"},u(s.value.settings.loading?d.$t("updating"):d.$t("updated")),513),[[c,s.value.settings.loading||s.value.settings.success]])]),e("button",{type:"submit",class:f(["w-full md:w-auto",s.value.settings.buttonDisabled?"secondary-button pointer-events-none cursor-not-allowed":"primary-button cursor-pointer"])},u(s.value.settings.loading?d.$t("updating"):d.$t("update")),3)])],32)]))}},ss=ue(ts,[["__scopeId","data-v-6774a872"]]),as={class:"flex flex-row w-full"},ls={class:"mr-4 md:mr-6 lg:w-1/5"},os=e("span",{class:"hidden-lg-flex"},"Profile",-1),ns=e("span",{class:"hidden-lg-flex"},"Social",-1),is=e("span",{class:"hidden-lg-flex"},"Settings",-1),us={class:"w-full"},gs={__name:"setting",setup(g){Ce({title:Se().tl("meta.title.profile.settings")});const v=p({currentState:"profile"}),m=I=>{v.value.currentState=I};return(I,w)=>(C(),X(Ne,{"hide-side":!0,"with-footer":!0,"no-right-side":!0},{default:Ie(()=>[e("div",as,[e("div",ls,[e("div",{class:f(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":v.value.currentState==="profile"}]),onClick:w[0]||(w[0]=_=>m("profile"))},[o(b($,{name:"i-fluent-person-32-regular",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState==="profile"]]),o(b($,{name:"i-fluent-person-32-regular",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState!=="profile"]]),os],2),e("div",{class:f(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":v.value.currentState==="social"}]),onClick:w[1]||(w[1]=_=>m("social"))},[o(b($,{name:"i-ion-share-social-outline",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState==="social"]]),o(b($,{name:"i-ion-share-social-outline",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState!=="social"]]),ns],2),e("div",{class:f(["flex flex-row py-3 px-4 mb-2 font-medium leading-5 rounded ring-offset-2 transition-all duration-200 cursor-pointer left-menu-link parent-icon theme-color hover:button hover:text-white",{"button-color text-white":v.value.currentState==="settings"}]),onClick:w[2]||(w[2]=_=>m("settings"))},[o(b($,{name:"i-ph-gear-six",class:"text-lg text-white lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState==="settings"]]),o(b($,{name:"i-ph-gear-six",class:"text-lg lg:mr-2 hover:text-white"},null,512),[[c,v.value.currentState!=="settings"]]),is],2)]),e("div",us,[v.value.currentState==="profile"?(C(),X(bt,{key:0})):T("",!0),v.value.currentState==="social"?(C(),X(Kt,{key:1})):T("",!0),v.value.currentState==="settings"?(C(),X(ss,{key:2})):T("",!0)])])]),_:1}))}};export{gs as default};
