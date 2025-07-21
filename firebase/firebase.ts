
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPWLceNKGwgk4puYbBc1UUWvCdfKJ-KYE",
  authDomain: "mymizo.firebaseapp.com",
  projectId: "mymizo",
  storageBucket: "mymizo.firebasestorage.app",
  messagingSenderId: "268483585376",
  appId: "1:268483585376:web:49e462cc5f337d2839aa05",
  measurementId: "G-51GV1ETF3T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);