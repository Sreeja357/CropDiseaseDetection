import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPbcUsvMbX_ScB7inBpWqgcrYOwJl91rY",
  authDomain: "cropdiseasedetection-712c7.firebaseapp.com",
  projectId: "cropdiseasedetection-712c7",
  storageBucket: "cropdiseasedetection-712c7.firebasestorage.app",
  messagingSenderId: "487829811383",
  appId: "1:487829811383:web:135467fef873a86297dd32",
  measurementId: "G-39LSKYVSMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
