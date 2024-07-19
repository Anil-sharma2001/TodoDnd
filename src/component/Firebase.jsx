// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAyDM1rzgY_xOhS1fF-uDsC_VZ3rq7fwu8",
  authDomain: "authentication-3cf16.firebaseapp.com",
  databaseURL: "https://authentication-3cf16-default-rtdb.firebaseio.com",
  projectId: "authentication-3cf16",
  storageBucket: "authentication-3cf16.appspot.com",
  messagingSenderId: "398367417319",
  appId: "1:398367417319:web:99aede8a35d3905e219342"
};

 export const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app)
 export const db = getFirestore(app)
