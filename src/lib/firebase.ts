
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- IMPORTANT ---
// To register your app with Firebase, you must replace these placeholder values
// with the actual configuration details from your Firebase project.
//
// 1. Go to your Firebase project console: https://console.firebase.google.com/
// 2. Click the gear icon (⚙️) to go to "Project settings".
// 3. In the "General" tab, scroll down to the "Your apps" section.
// 4. Find your web app and copy the `firebaseConfig` object.
// 5. Paste the values here, replacing the placeholder strings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_AUTH_DOMAIN_HERE",
  projectId: "YOUR_PROJECT_ID_HERE",
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE",
};


// A check to ensure credentials have been added.
if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
  console.error("Firebase config is not set. Please update src/lib/firebase.ts with your project credentials.");
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
