"use client";
import { useEffect, useState } from 'react';
import ScreenshotList from './components/ScreenshotList';
import Summary from './components/Summary';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import SessionList from "./components/SessionList";
import { ScreenshotType } from './models/Screenshot';

export default function Home() {
    const [screenshots, setScreenshots] = useState<ScreenshotType[]>([]);
    const [summary, setSummary] = useState<string>('');
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/");
        }
    }, [session, router]);

    const handleSessionSelect = (sessionId: string) => {
        setSelectedSessionId(sessionId);
    };

    const handleGenerateSummary = async () => {
        if (!selectedSessionId) return;

        setIsLoading(true);
        try {
            const response = await fetch(`/api/summary?sessionId=${selectedSessionId}`);
            const result = await response.json();
            setSummary(result.summary || '');
            setScreenshots(result.screenshots || []);
        } finally {
            setIsLoading(false);
        }
    };

    if (session) {
        return (
            <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center py-8 px-4">
                <p>Signed in as {session?.user?.email}</p>
                <button
                    onClick={() => signOut()}
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 mb-4"
                >
                    Sign out
                </button>

                <h1 className="text-4xl font-bold mb-4 text-teal-500">Screenshot Dashboard</h1>

                <SessionList onSessionSelect={handleSessionSelect} />

                {selectedSessionId && (
                    <div className="w-full max-w-4xl">
                        <h2 className="text-2xl font-semibold mb-4 text-teal-300">Session: {selectedSessionId}</h2>
                        <ScreenshotList screenshots={screenshots} />
                        <button
                            onClick={handleGenerateSummary}
                            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? "Generating Summary..." : "Generate Summary"}
                        </button>
                        <Summary summary={summary} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center py-8 px-4">
            <p>Not signed in </p>
            <button
                onClick={() => signIn()}
                className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
                Sign in
            </button>
        </div>
    );
}