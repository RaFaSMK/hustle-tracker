import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

function requireEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to your .env file.`,
    );
  }

  return value;
}

const firebaseConfig = {
  apiKey: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    "EXPO_PUBLIC_FIREBASE_API_KEY",
  ),
  authDomain: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  ),
  projectId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  ),
  storageBucket: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ),
  messagingSenderId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  ),
  appId: requireEnv(
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ),
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
