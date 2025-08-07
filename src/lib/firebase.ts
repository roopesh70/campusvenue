
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
  apiKey: "AIzaSyDVEQa7TGINV1jZuxqw3tLZ2VUTVPTB9gM",
  authDomain: "campusvenue.firebaseapp.com",
  projectId: "campusvenue",
  storageBucket: "campusvenue.firebasestorage.app",
  messagingSenderId: "681578752192",
  appId: "1:681578752192:web:871776dda3bd3bb2f9a525"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
