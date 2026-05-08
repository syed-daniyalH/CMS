// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCC8HJPxZJUjfvXRaIBt7zufoiSuyHvT1w",
  authDomain: "indraaj-1729c.firebaseapp.com",
  projectId: "indraaj-1729c",
  messagingSenderId: "239583489416",
  appId: "1:239583489416:web:28a707f4361c5454431e3d"
};

const app = initializeApp(firebaseConfig);
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== "undefined" && typeof navigator !== "undefined") {
  isSupported().then((supported) => {
    if(supported) {
      messaging = getMessaging(app);
    }
  })
}

export { messaging, getToken, onMessage, isSupported };
