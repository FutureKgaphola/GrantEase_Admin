// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from "firebase/storage";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXDrQy5CtTn76B2f6saF9dibTLzskBRJg",
  authDomain: "sassa-c2b7f.firebaseapp.com",
  projectId: "sassa-c2b7f",
  storageBucket: "sassa-c2b7f.appspot.com",
  messagingSenderId: "534881027218",
  appId: "1:534881027218:web:f2fc61bf6104a9bff7524b",
  measurementId: "G-ZVYY8WLMX8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth =getAuth(app);
export const db=getFirestore(app);
export const storage=getStorage(app);