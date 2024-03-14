// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "winning-habits-e676a.firebaseapp.com",
  projectId: "winning-habits-e676a",
  storageBucket: "winning-habits-e676a.appspot.com",
  messagingSenderId: "1016367336511",
  appId: "1:1016367336511:web:64e8a61f2d608b974bfc8a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
