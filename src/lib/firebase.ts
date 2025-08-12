
import { initializeApp, getApp, getApps, FirebaseOptions } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import admin from 'firebase-admin';

// Public (Client-side) Firebase configuration
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyD3ol-FrK2m8tq46NBVp3xPIQcDUAGhnzI",
    authDomain: "scribescroll-adventures.firebaseapp.com",
    projectId: "scribescroll-adventures",
    storageBucket: "scribescroll-adventures.appspot.com",
    messagingSenderId: "573064171570",
    appId: "1:573064171570:web:abcdaece36ea501ca76c2b",
};

// Initialize Firebase for the client
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


// Server-side (Admin) Firebase initialization
function getAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccountString = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    const credentials = serviceAccountString
        ? admin.credential.cert(JSON.parse(serviceAccountString))
        : admin.credential.applicationDefault();

    admin.initializeApp({
        credential: credentials,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'scribescroll-adventures',
    });


    return admin.app();
}


function getAdminDb() {
    return admin.firestore(getAdminApp());
}


export { app, db, auth, getAdminDb };
