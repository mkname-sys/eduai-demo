import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCZfK-6FOeKUSb4iC2SRRi4QJM4nQeOdd8",
  authDomain: "eduai-2.firebaseapp.com",
  projectId: "eduai-2",
  storageBucket: "eduai-2.firebasestorage.app",
  messagingSenderId: "1045538282323",
  appId: "1:1045538282323:web:8a04b90fb9cc7c081d5fa6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
// HARD-CODED: always show Google account picker
googleProvider.setCustomParameters({ prompt: "select_account" });
