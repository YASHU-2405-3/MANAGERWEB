const admin=require("firebase-admin");
const fs=require("node:fs");

if(!process.env.ADMIN_UID||(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON&&!process.env.FIREBASE_SERVICE_ACCOUNT_PATH)){
  console.error("Set ADMIN_UID and either FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH.");
  process.exit(1);
}

const serviceAccountJson=process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  || fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH,"utf8");
const serviceAccount=JSON.parse(serviceAccountJson);
admin.initializeApp({credential:admin.credential.cert(serviceAccount)});

(async()=>{
  try{
    const user=await admin.auth().getUser(process.env.ADMIN_UID);
    const existingClaims=user.customClaims||{};
    await admin.auth().setCustomUserClaims(user.uid,{...existingClaims,admin:true});
    console.log("Admin claim added for:",user.email||user.uid);
    console.log("Sign out of the website, then sign in again to refresh the ID token.");
  }catch(err){console.error(err);process.exit(1)}
})();