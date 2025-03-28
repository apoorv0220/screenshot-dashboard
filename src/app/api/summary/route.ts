import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongodb';
import Screenshot, { ScreenshotType } from '../../models/Screenshot';
import {getSession} from "next-auth/react"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ screenshots: [], summary: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const screenshots = await Screenshot.find({ sessionId: sessionId }).sort({ timestamp: 1 });

    if (!screenshots || screenshots.length === 0) {
      return NextResponse.json({ screenshots: [], summary: 'No screenshots found for this session.' });
    }

    const summary = await generateSummary(screenshots, sessionId as string);

    return NextResponse.json({ screenshots: screenshots, summary: summary });
  } catch (error) {
    console.error("MongoDB/OpenAI error:", error);
    return NextResponse.json({ screenshots: [], summary: 'Error generating AI summary.' }, { status: 500 });
  }
}

async function generateSummary(screenshots: ScreenshotType[], sessionId: string) {
  if (!screenshots || screenshots.length === 0) {
    return "No screenshots available to generate a summary.";
  }

  // Extract timestamps and URLs
  const screenshotData = screenshots.map((s: ScreenshotType) => ({
    timestamp: s.timestamp,
    url: s.url,
  }));

  const prompt = `Please provide a summary of a user's activity based on the following screenshots for session ${sessionId}. Here are the screenshots (timestamp and URL): ${JSON.stringify(screenshotData)}. Be general in your description.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    const summary = completion.choices[0].message.content;
    return summary;
  } catch (error) {
    console.error("OpenAI error:", error);
    return "Error generating AI summary.";
  }
}