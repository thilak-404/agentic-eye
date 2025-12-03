import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1Y0ceF6kX2ZxSJhk2kJt5hL1y8ETZ0Uw",
    authDomain: "agentic-eye.firebaseapp.com",
    projectId: "agentic-eye",
    storageBucket: "agentic-eye.firebasestorage.app",
    messagingSenderId: "516433648780",
    appId: "1:516433648780:web:dfb6bb4ab270b9b8ddafa9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, onAuthStateChanged };

// Auto-create user profile with 3 credits on first login
export const createUserProfile = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, {
            email: user.email,
            plan: "free",
            credits: 3,
            createdAt: new Date()
        });
    }
};
