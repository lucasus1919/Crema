import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';

setLogLevel('silent');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAIXAiNC0qKQDkt5G-XaQj0hFAN4MCrEl8',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:369807633070:web:b0cf0378d9ee167154db3f',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '369807633070',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'coffee-1919',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'coffee-1919.firebaseapp.com',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'coffee-1919.firebasestorage.app',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-45HZ2TR4TK',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

let firestoreInstance;
try {
  firestoreInstance = getFirestore(app);
} catch {
  firestoreInstance = initializeFirestore(app, {});
}

export const db = firestoreInstance;
export default app;
