const admin=require("firebase-admin");

if(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON||!process.env.ADMIN_UID){
  console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON and ADMIN_UID first.");
  process.exit(1);
}

const serviceAccount=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
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