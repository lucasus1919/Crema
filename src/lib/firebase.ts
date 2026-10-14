import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';

setLogLevel('silent');

const firebaseConfig = {
  apiKey: 'AIzaSyAIXAiNC0qKQDkt5G-XaQj0hFAN4MCrEl8',
  appId: '1:369807633070:web:b0cf0378d9ee167154db3f',
  messagingSenderId: '369807633070',
  projectId: 'coffee-1919',
  authDomain: 'coffee-1919.firebaseapp.com',
  storageBucket: 'coffee-1919.firebasestorage.app',
  measurementId: 'G-45HZ2TR4TK',
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
