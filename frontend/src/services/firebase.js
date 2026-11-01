import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAp10SZ8BguSW6GlkAa1Ie8t0nM-hltKU",
  authDomain: "re-source-e360d.firebaseapp.com",
  projectId: "re-source-e360d",
  storageBucket: "re-source-e360d.firebasestorage.app",
  messagingSenderId: "222324711111",
  appId: "1:222324711111:web:74392b31fd8d48b5c9a8e2",
  measurementId: "G-8TZDYKHFEY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;