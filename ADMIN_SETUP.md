# Admin account setup

The Admin Panel requires a Firebase Authentication custom claim. A Firestore document field such as `users/{uid}.role = "admin"` is not enough, and the website must not grant this permission from the browser.

## Grant the Admin claim to the intended account

1. Sign in to `/admin.html` with the account that should be the single Admin.
2. The locked screen shows that account's email and Firebase UID. Copy the UID.
3. A trusted project owner downloads a Firebase Admin SDK service-account JSON for the `creator-x-brand` project. Keep this file private. Do not commit it, upload it to chat, or share it.
4. On a trusted computer in the repository folder, install dependencies:

   ```powershell
   npm install
   ```

5. Store the service-account JSON locally as `service-account.json` in the repository root. This filename is ignored by Git.
6. In PowerShell, set the UID copied from the Admin screen and the local file path, then run the script:

   ```powershell
   $env:ADMIN_UID = "PASTE_THE_ADMIN_UID_HERE"
   $env:FIREBASE_SERVICE_ACCOUNT_PATH = ".\service-account.json"
   npm run set-admin
   ```

7. When the script confirms success, sign out of the website and sign in again. The Admin Panel forces a fresh ID token and should unlock only for that account.
8. Keep the service-account JSON offline or delete the local copy after setup. Never put it in GitHub or Vercel client-side files.

The script merges `admin: true` into existing custom claims rather than deleting other claims. Only grant this to the intended owner account. To revoke access, a trusted Admin SDK operator must remove the `admin` claim.


## Publish the Firestore rules used by this repository

The Admin dashboard needs the Admin custom claim **and** the matching Firestore Security Rules. A successful `set-admin` command does not publish Firestore rules.

From the Codespaces terminal, in `/workspaces/MANAGERWEB`, sign in with a Google account that has permission to manage the Firebase project:

```bash
npx firebase-tools login --no-localhost
```

Complete the browser/device login flow. Then deploy only the rules:

```bash
npx firebase-tools deploy --only firestore:rules --project creator-x-brand
```

Wait for the CLI to report that Firestore rules were released successfully, then refresh `admin.html`. Do not deploy rules copied from elsewhere; this repository's `firestore.rules` keeps application, conversation, and deal data restricted to the intended Admin/participants.

The repository includes `firebase.json` and `.firebaserc` to connect the CLI to this rules file and the `creator-x-brand` project.
