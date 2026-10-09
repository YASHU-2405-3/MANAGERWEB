(()=>{const KEY="creatorXBrandProfile";
function getProfile(){try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}}
function initials(name,email){const s=(name||email||"U").trim();return s.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}

function setAdminMenu(isAdmin){
  const drawer=document.getElementById("siteDrawer");
  if(!drawer)return;
  const current=location.pathname.split("/").pop()||"index.html";
  const existing=drawer.querySelector('[data-admin-link]');
  if(isAdmin&&!existing){
    drawer.insertAdjacentHTML("beforeend",'<a data-admin-link href="admin.html"'+(current==="admin.html"?' class="active"':'')+'>Admin Dashboard</a>');
  }else if(!isAdmin&&existing) existing.remove();
}
function showApplicationSuccess(ticketId){
  let old=document.getElementById("applicationSuccessModal"); if(old)old.remove();
  document.body.insertAdjacentHTML("beforeend",'<div id="applicationSuccessModal" style="position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.76);backdrop-filter:blur(9px)"><div style="width:min(450px,100%);padding:26px;border:1px solid #31583e;border-radius:24px;background:linear-gradient(160deg,#102319,#07110b);color:#f5f8f6;text-align:center;box-shadow:0 30px 90px #0009"><div style="width:58px;height:58px;margin:0 auto 12px;display:grid;place-items:center;border-radius:18px;background:#b9f5cb;color:#07120b;font-size:32px;font-weight:900">✓</div><div style="font-size:10px;letter-spacing:.16em;color:#2dff91;font-weight:900;text-transform:uppercase">Creator X Brand</div><h2 style="margin:8px 0;font-size:25px">Application Successfully Applied!</h2><p style="color:#b4c5ba;line-height:1.65;margin:0">We’ve received your application. Our team will review it and aim to respond within <strong style="color:#f5f8f6">24 hours</strong>.</p><div style="margin:18px 0;padding:14px;border:1px dashed #31583e;border-radius:14px;background:#06100b"><small style="color:#91a99a">YOUR TICKET ID</small><strong style="display:block;margin-top:5px;font-size:20px;letter-spacing:1px;color:#b9f5cb">'+ticketId+'</strong><small style="display:block;margin-top:5px;color:#91a99a">Save this ID for your records.</small></div><div style="padding:14px;margin-bottom:16px;border-radius:13px;background:#102319;text-align:left"><strong style="display:block;margin-bottom:4px">💬 Want to contact us?</strong><span style="font-size:12px;line-height:1.6;color:#b4c5ba">Tap the <b style="color:#f5f8f6">☰ three-line menu</b> and choose <b style="color:#b9f5cb">Chat</b>. Send us a message anytime; we’ll get back to you within 24 hours.</span></div><button id="openChatFromSuccess" style="width:100%;padding:13px;border:0;border-radius:12px;background:#b9f5cb;color:#07120b;font-weight:900">Open Chat →</button><button id="closeApplicationSuccess" style="width:100%;margin-top:8px;padding:12px;border:1px solid #31583e;border-radius:12px;background:transparent;color:#f5f8f6;font-weight:750">Done</button></div></div>');
  document.getElementById("closeApplicationSuccess").onclick=()=>document.getElementById("applicationSuccessModal")?.remove();
  document.getElementById("openChatFromSuccess").onclick=()=>{document.getElementById("applicationSuccessModal")?.remove();location.href="chat.html"};
}
function header(){
  const old=document.querySelector("body>header");if(old)old.remove();
  document.querySelectorAll(".top").forEach(e=>e.classList.add("legacy-hidden"));
  const current=location.pathname.split("/").pop()||"index.html";
  const nav=[["index.html","Home"],["about.html","About"],["services.html","Services"],["contact.html","Contact"],...(profile&&profile.signedIn?[["chat.html","Chat"]]:[])];
  const profile=getProfile();
  const account=profile
    ? '<div class="site-profile"><button class="site-profile-btn" id="siteProfileBtn"><span class="site-avatar">'+initials(profile.name,profile.email)+'</span>Profile</button><div class="site-profile-menu" id="siteProfileMenu"><a href="chat.html">Chat</a><button id="siteSignOut">Sign out</button></div></div>'
    : '<a class="site-account" href="#" data-auth="signin">Sign in</a><a class="site-account signup" href="#" data-auth="signup">Sign up</a>';
  const links=nav.map(([href,label])=>'<a href="'+href+'"'+(current===href?' class="active"':'')+'>'+label+'</a>').join("");
  document.body.insertAdjacentHTML("afterbegin",'<header class="site-header"><nav class="site-nav"><a class="site-logo" href="index.html">Creator <span>X</span> Brand</a><div class="site-nav-right">'+account+'<button class="site-menu-btn" id="siteMenuBtn" aria-label="Open menu" aria-expanded="false"><span class="site-menu-icon"></span></button></div><div class="site-drawer" id="siteDrawer">'+links+'</div></nav></header>');
}

function modal(){
  document.body.insertAdjacentHTML("beforeend",'<div class="site-auth-modal" id="siteAuthModal" aria-hidden="true"><div class="site-auth-box"><div class="site-auth-head"><h2 id="siteAuthTitle">Sign in</h2><button class="site-auth-close" id="siteAuthClose" aria-label="Close">×</button></div><div class="site-auth-tabs"><button class="site-auth-tab active" data-mode="signin">Sign in</button><button class="site-auth-tab" data-mode="signup">Sign up</button></div><form class="site-auth-form" id="siteAuthForm"><div id="siteNameWrap" style="display:none"><label for="siteName">Name</label><input id="siteName" autocomplete="name" placeholder="Your name"><label for="siteRole">I am</label><select id="siteRole"><option value="creator">Creator</option><option value="brand">Brand</option></select></div><label for="siteEmail">Email</label><input id="siteEmail" type="email" required autocomplete="email" placeholder="you@example.com"><label for="sitePassword">Password</label><input id="sitePassword" type="password" required autocomplete="current-password" placeholder="Your password"><button class="site-auth-submit" type="submit" id="siteAuthSubmit">Sign in</button></form><p class="site-auth-note">Your account is secured by Firebase Authentication.</p></div></div>')
}

async function initFirebase(){
  if(!window.firebaseConfig||!window.firebase) return null;
  if(!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
  return {auth:firebase.auth(),db:firebase.firestore()};
}

async function init(){
  const fb=await initFirebase();
  if(fb){
    fb.auth.onAuthStateChanged(async user=>{
      if(user){
        let p=getProfile();
        let role="creator",name=user.displayName||user.email?.split("@")[0]||"User",isAdmin=false;
        try{
          const snap=await fb.db.collection("users").doc(user.uid).get();
          if(snap.exists){const d=snap.data();role=d.role||role;name=d.name||name}
          const token=await user.getIdTokenResult(true);
          isAdmin=token.claims.admin===true;
        }catch{}
        localStorage.setItem(KEY,JSON.stringify({name,email:user.email,signedIn:true,uid:user.uid,role,isAdmin}));
        if(!document.querySelector(".site-header")){header();modal();bind(fb)}
        setAdminMenu(isAdmin);
      }else{
        localStorage.removeItem(KEY);
        if(!document.querySelector(".site-header")){header();modal();bind(fb)}
        setAdminMenu(false);
      }
    });
  }
  header();modal();bind(fb);
}

function toast(message,type="success"){let el=document.getElementById("siteToast");if(!el){el=document.createElement("div");el.id="siteToast";el.style.cssText="position:fixed;left:50%;bottom:24px;transform:translateX(-50%) translateY(20px);z-index:500;max-width:min(92vw,520px);padding:12px 16px;border:1px solid #31583e;border-radius:12px;background:#0b1913;color:#f5f8f6;box-shadow:0 18px 45px rgba(0,0,0,.4);font:600 13px/1.45 system-ui,sans-serif;opacity:0;transition:.25s ease";document.body.appendChild(el)}el.textContent=message;el.style.borderColor=type==="error"?"#704040":"#31583e";el.style.color=type==="error"?"#ffb4b4":"#f5f8f6";requestAnimationFrame(()=>{el.style.opacity="1";el.style.transform="translateX(-50%) translateY(0)"});clearTimeout(el._t);el._t=setTimeout(()=>{el.style.opacity="0";el.style.transform="translateX(-50%) translateY(20px)"},3200)}
function bindApplicationForms(fb){document.querySelectorAll("form[data-application]").forEach(form=>{if(form.dataset.bound)return;form.dataset.bound="1";const status=form.querySelector(".app-form-status"),button=form.querySelector(".submit");form.addEventListener("submit",async e=>{e.preventDefault();if(!fb){toast("Firebase is not connected yet.","error");return}const user=fb.auth.currentUser;if(!user){toast("Please sign in before submitting your application.","error");return}const type=form.dataset.application;
      const now=new Date();
      const date=now.toISOString().slice(0,10).replaceAll("-","");
      const rand=Math.floor(1000+Math.random()*9000);
      const ticketId="CXB-"+date+"-"+rand;
      const data={userId:user.uid,type,status:"pending",ticketId,createdAt:firebase.firestore.FieldValue.serverTimestamp()};form.querySelectorAll("[data-field]").forEach(input=>{data[input.dataset.field]=input.value.trim()});if(status){status.className="app-form-status";status.textContent=""}button.disabled=true;button.textContent="Submitting...";try{await fb.db.collection("applications").add(data);form.reset();if(status){status.className="app-form-status show success";status.textContent="Application submitted successfully. We’ll review your details and get back to you."}showApplicationSuccess(ticketId);
        toast("Application submitted successfully.");}catch(err){if(status){status.className="app-form-status show error";status.textContent=err.message||"Could not submit your application. Please try again."}toast("Could not submit the application.","error")}finally{button.disabled=false;button.textContent=type==="creator"?"Submit Creator Application →":"Submit Brand Application →"}})})}
function bind(fb){
  const drawer=document.getElementById("siteDrawer"),menu=document.getElementById("siteMenuBtn");
  if(menu&&!menu.dataset.bound){menu.dataset.bound="1";menu.addEventListener("click",e=>{e.stopPropagation();const open=drawer.classList.toggle("open");menu.setAttribute("aria-expanded",open)});document.addEventListener("click",e=>{if(!e.target.closest("#siteMenuBtn")&&!e.target.closest("#siteDrawer"))drawer.classList.remove("open")})}
  const modalEl=document.getElementById("siteAuthModal"),close=document.getElementById("siteAuthClose"),title=document.getElementById("siteAuthTitle"),nameWrap=document.getElementById("siteNameWrap"),name=document.getElementById("siteName"),role=document.getElementById("siteRole"),email=document.getElementById("siteEmail"),pass=document.getElementById("sitePassword"),submit=document.getElementById("siteAuthSubmit"),form=document.getElementById("siteAuthForm");
  if(!form||form.dataset.bound)return;
  form.dataset.bound="1";let mode="signin";
  function setMode(m){mode=m;title.textContent=m==="signup"?"Create your account":"Sign in";nameWrap.style.display=m==="signup"?"block":"none";name.required=m==="signup";submit.textContent=m==="signup"?"Create account":"Sign in";document.querySelectorAll(".site-auth-tab").forEach(x=>x.classList.toggle("active",x.dataset.mode===m));pass.autocomplete=m==="signup"?"new-password":"current-password"}
  function open(m){setMode(m);modalEl.classList.add("open");modalEl.setAttribute("aria-hidden","false");email.focus()}
  document.querySelectorAll("[data-auth]").forEach(x=>x.addEventListener("click",e=>{e.preventDefault();open(x.dataset.auth)}));
  document.querySelectorAll(".site-auth-tab").forEach(x=>x.addEventListener("click",()=>setMode(x.dataset.mode)));
  close.addEventListener("click",()=>modalEl.classList.remove("open"));
  modalEl.addEventListener("click",e=>{if(e.target===modalEl)modalEl.classList.remove("open")});
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!fb){alert("Firebase is not connected yet.");return}
    submit.disabled=true;submit.textContent="Please wait...";
    try{
      let user;
      if(mode==="signup"){
        const cred=await fb.auth.createUserWithEmailAndPassword(email.value.trim(),pass.value);
        user=cred.user;
        await user.updateProfile({displayName:name.value.trim()});
        await fb.db.collection("users").doc(user.uid).set({uid:user.uid,name:name.value.trim(),email:user.email,role:role.value,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      }else{
        const cred=await fb.auth.signInWithEmailAndPassword(email.value.trim(),pass.value);
        user=cred.user;
      }
      modalEl.classList.remove("open");
      location.reload();
    }catch(err){
      alert(err.message||"Authentication failed.");
    }finally{submit.disabled=false;submit.textContent=mode==="signup"?"Create account":"Sign in"}
  });
  const profileBtn=document.getElementById("siteProfileBtn");
  if(profileBtn){
    const pm=document.getElementById("siteProfileMenu");
    profileBtn.addEventListener("click",e=>{e.stopPropagation();pm.classList.toggle("open")});
    document.addEventListener("click",e=>{if(!e.target.closest(".site-profile"))pm.classList.remove("open")});
    const signout=document.getElementById("siteSignOut");
    signout.addEventListener("click",async()=>{try{if(fb)await fb.auth.signOut()}finally{localStorage.removeItem(KEY);location.reload()}})
  }
  bindApplicationForms(fb);
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init()})();