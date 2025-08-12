
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "scribescroll-adventures",
  appId: "1:573064171570:web:abcdaece36ea501ca76c2b",
  storageBucket: "scribescroll-adventures.firebasestorage.app",
  apiKey: "AIzaSyD3ol-FrK2m8tq46NBVp3xPIQcDUAGhnzI",
  authDomain: "scribescroll-adventures.firebaseapp.com",
  messagingSenderId: "573064171570",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
