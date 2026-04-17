import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHm5ipscgg1XXkanNmYXQ6xnSHgZZ9E5E",
  authDomain: "easy-go-c18c8.firebaseapp.com",
  projectId: "easy-go-c18c8",
  storageBucket: "easy-go-c18c8.firebasestorage.app",
  messagingSenderId: "718978220368",
  appId: "1:718978220368:web:8aeba3671f1976c729ac55",
  measurementId: "G-4RSZCY1D4T"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);