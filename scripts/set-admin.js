const admin=require("firebase-admin");

if(!process.env.FIREBASE_SERVICE_ACCOUNT_JSON||!process.env.ADMIN_UID){
  console.error("Set FIREBASE_SERVICE_ACCOUNT_JSON and ADMIN_UID first.");
  process.exit(1);
}

const serviceAccount=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
admin.initializeApp({credential:admin.credential.cert(serviceAccount)});

admin.auth().setCustomUserClaims(process.env.ADMIN_UID,{admin:true})
  .then(()=>console.log("Admin claim added successfully. Sign out/in or force-refresh the ID token."))
  .catch(err=>{console.error(err);process.exit(1)});