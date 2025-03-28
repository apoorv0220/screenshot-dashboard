"use client";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';

export default function SessionPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [sessionId, setSessionId] = useState('')

    useEffect(() => {
        if (!session) {
            router.push("/");
        } else {
            // Retrieve from local storage or generate
            const storedSessionId = localStorage.getItem('sessionId');
            if (storedSessionId) {
                setSessionId(storedSessionId);
            } else {
                const newSessionId = generateSessionId();
                localStorage.setItem('sessionId', newSessionId);
                setSessionId(newSessionId);
            }
        }
    }, [session, router]);


    useEffect(() => {
        if (sessionId) {
            router.push(`/?sessionId=${sessionId}`);
        }
    }, [sessionId, router]);


    function generateSessionId() {
        // Simple random string generator
        return Math.random().toString(36).substring(2, 15);
    }


    return (
        <div>Loading session...</div>
    );
}