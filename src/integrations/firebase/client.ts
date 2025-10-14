import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
