// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8dfd4.firebaseapp.com",
  projectId: "mern-estate-8dfd4",
  storageBucket: "mern-estate-8dfd4.appspot.com",
  messagingSenderId: "947856452122",
  appId: "1:947856452122:web:a824ac85e5c54ed5eb3fa3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);