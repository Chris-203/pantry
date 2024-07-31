import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqC3MSUn1II6qurSxmlDT8pIf1wY6aWZA",
  authDomain: "mypantryapp-3569a.firebaseapp.com",
  projectId: "mypantryapp-3569a",
  storageBucket: "mypantryapp-3569a.appspot.com",
  messagingSenderId: "663898581689",
  appId: "1:663898581689:web:e310f077fe83dde5994968",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
