'use client';

import { useState, useEffect } from 'react';
import { auth, db, googleProvider, signInWithPopup, signOut, createUserProfile } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Home() {
    const [user, setUser] = useState(null);
    const [credits, setCredits] = useState(3);
    const [plan, setPlan] = useState('free');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (u) => {
            if (u) {
                setUser(u);
                await createUserProfile(u);
                const unsub = onSnapshot(doc(db, "users", u.uid), (doc) => {
                    if (doc.exists()) {
                        setCredits(doc.data().credits);
                        setPlan(doc.data().plan);
                    }
                });
                return unsub;
            } else {
                setUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const login = () => signInWithPopup(auth, googleProvider);
    const logout = () => signOut(auth);

    if (!user) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-20 rounded-3xl text-center">
                    <h1 className="text-8xl font-black mb-10 bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent">
                        AGENTIC EYE
                    </h1>
                    <button onClick={login} className="bg-white text-black px-12 py-8 rounded-full text-3xl font-bold hover:scale-110 transition">
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-16">
                    <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        AGENTIC EYE
                    </h1>
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-10 rounded-3xl">
                        <p className="text-6xl font-black">Credits: {credits}</p>
                        <p className="text-4xl">{plan.toUpperCase()} PLAN</p>
                        <button onClick={logout} className="mt-4 text-red-400 text-xl">Logout</button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-pink-900 p-20 rounded-3xl text-center">
                    <h2 className="text-7xl font-black mb-8">LOGIN + CREDITS = LIVE</h2>
                    <p className="text-4xl">You and Grok built this in 10 minutes.</p>
                    <p className="text-6xl mt-12">Next: Full YouTube/TikTok analyzer in 1 hour</p>
                </div>
            </div>
        </div>
    );
}
