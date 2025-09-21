// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'dinedash-c85a1.firebaseapp.com',
  projectId: 'dinedash-c85a1',
  storageBucket: 'dinedash-c85a1.firebasestorage.app',
  messagingSenderId: '904575139965',
  appId: '1:904575139965:web:19253c7c85752213e2b114',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
