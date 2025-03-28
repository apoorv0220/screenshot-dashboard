"use client";
import { useEffect, useState } from 'react';
import ScreenshotList from './components/ScreenshotList';
import Summary from './components/Summary';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from 'next/navigation';


export default function Home() {
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    async function fetchData() {
      if (sessionId) {
        const data = await fetch(`/api/summary?sessionId=${sessionId}`);
        const result = await data.json();
        setScreenshots(result.screenshots || []);
        setSummary(result.summary || '');
      } else {
        // Redirect to page with session id if logged in
        if (session) {
          router.push(`/session`);
        }
      }
    }
    fetchData();
  }, [sessionId, session, router]);

  if (session) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Signed in as {session?.user?.email}</p>
        <button onClick={() => signOut()} style={{ margin: '10px 0' }}>Sign out</button>
        <h1>Screenshot Dashboard</h1>
        {sessionId ? (
          <>
            <ScreenshotList screenshots={screenshots} />
            <Summary summary={summary} />
          </>
        ) : (
          <p>Select a session or provide a sessionId in the query parameters.</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </div>
  );
}