"use client";
import {useEffect, useState} from 'react';
import ScreenshotList from './components/ScreenshotList';
import Summary from './components/Summary';
import {useSession, signIn, signOut} from "next-auth/react"
import {useRouter} from 'next/navigation';
import { ScreenshotType } from './models/Screenshot';

export default function Home() {
    const [screenshots, setScreenshots] = useState<ScreenshotType[]>([]);
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            if (session) {
                setIsLoading(true);
                try {
                    const data = await fetch(`/api/summary`);
                    const result = await data.json();
                    setScreenshots(result.screenshots || []);
                    setSummary(result.summary || '');
                } finally {
                    setIsLoading(false);
                }

            } else {
                router.push("/");
            }
        }

        fetchData();
    }, [session, router]);

    if (session) {
        return (
            <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-around py-8 px-4">
                <div className="flex justify-between w-[98vw]">
                    <p className="text-2xl font-bold pb-4 text-teal-500">Signed in as {session?.user?.email}</p>
                    <button
                        onClick={() => signOut()}
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline transition duration-200"
                    >
                        Sign out
                    </button>
                </div>
                <h1 className="text-4xl font-bold mb-4 text-teal-500">Screenshot Dashboard</h1>
                {isLoading ? (
                    <div className="text-teal-500 animate-spin text-4xl">Loading...</div>
                ) : (
                    <div className="border-teal-100 border-2 p-2">
                        <ScreenshotList screenshots={screenshots}/>
                        <Summary summary={summary}/>
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