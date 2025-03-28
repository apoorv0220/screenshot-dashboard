"use client";
import { useEffect, useState } from 'react';
import ScreenshotList from './components/ScreenshotList';
import Summary from './components/Summary';
import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [summary, setSummary] = useState<string>('');
  const { data: session } = useSession()

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.email) {
        const data = await fetch(`/api/summary?email=${session.user.email}`);
        const result = await data.json();
        setScreenshots(result.screenshots || []);
        setSummary(result.summary || '');
      }
    }
    fetchData();
  }, [session]);

  if (session) {
    return (
      <div style={{ padding: '20px' }}>
        <p>Signed in as {session?.user?.email}</p>
        <button onClick={() => signOut()} style={{ margin: '10px 0' }}>Sign out</button>
        <h1>Screenshot Dashboard</h1>
        <ScreenshotList screenshots={screenshots} />
        <Summary summary={summary} />
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