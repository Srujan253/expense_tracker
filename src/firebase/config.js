import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD8B5NYiJmGsGyUJSAh-R4MG4dq52OVe4s",
  authDomain: "expense-tracker-bc280.firebaseapp.com",
  projectId: "expense-tracker-bc280",
  storageBucket: "expense-tracker-bc280.firebasestorage.app",
  messagingSenderId: "188978894650",
  appId: "1:188978894650:web:4cc5e2b60a04567e2ba203",
  measurementId: "G-LR6L880NZE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
