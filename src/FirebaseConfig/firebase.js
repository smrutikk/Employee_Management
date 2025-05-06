import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVqGD_tEH_sk4kqQKkcR34MSA0ODOQA54",
    authDomain: "rpg-app-76f89.firebaseapp.com",
    projectId: "rpg-app-76f89",
    storageBucket: "rpg-app-76f89.firebasestorage.app",
    messagingSenderId: "774427432008",
    appId: "1:774427432008:web:53231be5423c1aecbcb47d",
    measurementId: "G-75KX4QNQK0"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
