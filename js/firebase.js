// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoPsdJUVCLS0C0zWP9rEvOinBvULCtVuM",
  authDomain: "mails-declutter.firebaseapp.com",
  projectId: "mails-declutter",
  storageBucket: "mails-declutter.appspot.com",
  messagingSenderId: "327553765388",
  appId: "1:327553765388:web:d18e417a854a28bbc41e29"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
