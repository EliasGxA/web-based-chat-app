import firebase from "firebase";
// import "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBAS_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSender: process.env.NEXT_PUBLIC_FIREBASE,
  appId: process.env.NEXT_PUBLIC_FIREBASE_API_ID,
};

try {
  firebase.initializeApp(config);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

export const db = firebase.database();

const fire = firebase;
export default fire;
