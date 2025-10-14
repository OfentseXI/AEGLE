// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-R2EKBnULSLL80-vGZNtVagYFDfGy5Xg",
  authDomain: "salema-dce69.firebaseapp.com",
  databaseURL: "https://salema-dce69-default-rtdb.firebaseio.com",
  projectId: "salema-dce69",
  storageBucket: "salema-dce69.appspot.com",
  messagingSenderId: "486960310117",
  appId: "1:486960310117:web:dda312b600a939afbbe38c",
  measurementId: "G-7QK3CV70H6",
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore reference
export const firestore = getFirestore(app);

// Firebase Auth reference
export const auth = getAuth(app);
export const db = getFirestore(app);
