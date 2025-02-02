// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeLA5y60b2OpfGGisEtQMrErUHUIrqQLU",
  authDomain: "airbnbclone-be2b0.firebaseapp.com",
  projectId: "airbnbclone-be2b0",
  storageBucket: "airbnbclone-be2b0.appspot.com",
  messagingSenderId: "1020094669062",
  appId: "1:1020094669062:web:22a68fbbc6f835155b7e87",
  measurementId: "G-2LHVP6F9NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);