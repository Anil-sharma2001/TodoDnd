// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getDatabase} from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyDM1rzgY_xOhS1fF-uDsC_VZ3rq7fwu8",
  authDomain: "authentication-3cf16.firebaseapp.com",
  projectId: "authentication-3cf16",
  storageBucket: "authentication-3cf16.appspot.com",
  messagingSenderId: "398367417319",
  appId: "1:398367417319:web:99aede8a35d3905e219342"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app)
 export const db = getDatabase(app)
