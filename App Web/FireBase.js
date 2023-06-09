// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANzqPQtYgB7maCqzwoemjs0KLl8PVATo8",
  authDomain: "osc-agenda-virtual.firebaseapp.com",
  projectId: "osc-agenda-virtual",
  storageBucket: "osc-agenda-virtual.appspot.com",
  messagingSenderId: "1006550872783",
  appId: "1:1006550872783:web:ab75238cd9a27d78d17dba",
  measurementId: "G-915JWB3GNX"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
