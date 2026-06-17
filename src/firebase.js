import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIza" + "SyA6KhfU00AGpVQyxBEtgfOL5Ss7mMiWYXU",
    authDomain: "drugs-triage.firebaseapp.com",
    projectId: "drugs-triage",
    storageBucket: "drugs-triage.firebasestorage.app",
    messagingSenderId: "97433969938",
    appId: "1:97433969938:web:5910d37e0d8cd7f680bfcb",
    measurementId: "G-953D58H2H5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { experimentalForceLongPolling: true });

export { app, auth, db };
