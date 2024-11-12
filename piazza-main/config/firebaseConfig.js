import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCf6Z21CwfUoWJy2MPi8vDPb765O0wGfsM",
  authDomain: "piazza-30cd6.firebaseapp.com",
  projectId: "piazza-30cd6",
  storageBucket: "piazza-30cd6.firebasestorage.app",
  messagingSenderId: "813471041503",
  appId: "1:813471041503:web:7b57cc34aa71079307a66a",
  measurementId: "G-XYVZ6MXT4R"
};

const clientApp = initializeApp(firebaseConfig);

const auth = getAuth(clientApp); // For client-side auth

const db = getFirestore(clientApp); // For Firestore usage

export { auth, db };



