import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwx9IeSD2Ib9uYRAQaW9Kc_XtQoxjTIww",
  authDomain: "backstage-tasks.firebaseapp.com",
  projectId: "backstage-tasks",
  storageBucket: "backstage-tasks.firebasestorage.app",
  messagingSenderId: "949920359936",
  appId: "1:949920359936:web:a3b2f881e6cb3f32a61ae5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };