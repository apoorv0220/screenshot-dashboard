import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongodb';
import Screenshot from '../../models/Screenshot';
import { ScreenshotType } from '../../models/Screenshot';
import { getServerSession } from "next-auth/next"
import { getAuthOptions } from '../[...nextauth]/route';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
    const session = await getServerSession(getAuthOptions())

    if (!session) {
        return NextResponse.json({screenshots: [], summary: "Unauthorized"}, {status: 401});
    }

    try {
        await dbConnect();

        const {searchParams} = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({screenshots: [], summary: 'No sessionId provided.'}, {status: 400});
        }

        const screenshots = await Screenshot.find({sessionId: sessionId}).sort({timestamp: 1});

        if (!screenshots || screenshots.length === 0) {
            return NextResponse.json({screenshots: [], summary: 'No screenshots found for this session.'});
        }

        const summary = await generateSummary(screenshots);

        return NextResponse.json({screenshots: screenshots, summary: summary});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("MongoDB/OpenAI error:", error);
        return NextResponse.json({screenshots: [], summary: 'Error: ' + error.message}, {status: 500});
    }
}

async function generateSummary(screenshots: ScreenshotType[]) {
    if (!screenshots || screenshots.length === 0) {
        return "No screenshots available to generate a summary.";
    }

    const screenshotData = screenshots.map((s: ScreenshotType) => ({
        timestamp: s.timestamp,
        url: s.url,
        sessionId: s.sessionId,
    }));

    const prompt = `You are a highly skilled analyst tasked with summarizing a user's activity based on a series of screenshots. Your summaries must be comprehensive, detailed, and insightful. For each screenshot, provide a brief analysis of what the user appears to be doing at that specific timestamp, considering the visual content of the screenshot, the timestamp, and the session ID. Then, synthesize these individual analyses into a cohesive and thorough summary of the user's overall activity during the session. Ensure that the summary covers key actions, patterns, and any notable observations. Here are the screenshots (timestamp, URL, and session ID): ${JSON.stringify(screenshotData)}. Be as detailed and comprehensive as possible, while remaining concise and focused on the most important aspects of the user's activity.`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{role: "user", content: prompt}],
            max_tokens: 1500,
        });

        const summary = completion.choices[0].message.content;
        return summary;
    } catch (error) {
        console.error("OpenAI error:", error);
        return "Error generating AI summary.";
    }
}