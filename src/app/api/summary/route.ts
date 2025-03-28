import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import dbConnect from '../../lib/mongodb';
import Screenshot from '../../models/Screenshot';
import { ScreenshotType } from '../../models/Screenshot';
import { getServerSession } from "next-auth/next"
import { getAuthOptions } from '../[...nextauth]/route';
import axios from 'axios';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o"

// Define the content type for GPT-4o Vision API
type GPT4VisionContent =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail: "low" | "high" | "auto" } };

// Define the message type for GPT-4o Vision API
interface GPT4VisionMessage {
    role: "system" | "user";
    content: string | GPT4VisionContent[];
}

async function imageToBase64(imageUrl: string): Promise<string> {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        return `data:image/png;base64,${buffer.toString('base64')}`;
    } catch (error) {
        console.error("Error converting image to base64:", error);
        throw error;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    const session = await getServerSession(getAuthOptions());

    if (!session) {
        return NextResponse.json({ screenshots: [], summary: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();

        const screenshots = await Screenshot.find({}).sort({ timestamp: 1 });

        if (!screenshots || screenshots.length === 0) {
            return NextResponse.json({ screenshots: [], summary: 'No screenshots found.' });
        }

        const summary = await generateSummary(screenshots);

        return NextResponse.json({ screenshots: screenshots, summary: summary });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("MongoDB/OpenAI error:", error);
        return NextResponse.json({ screenshots: [], summary: 'Error: ' + error.message }, { status: 500 });
    }
}

async function generateSummary(screenshots: ScreenshotType[]): Promise<string> {
    if (!screenshots || screenshots.length === 0) {
        return "No screenshots available to generate a summary.";
    }

    const messages: GPT4VisionMessage[] = [
        {
            role: "system",
            content: "You are an expert at summarizing user activity based on screenshots and metadata.",
        },
    ];

    for (const screenshot of screenshots) {
        try {
            const base64Image = await imageToBase64(screenshot.url);
            const content: GPT4VisionContent[] = [
                { type: "text", text: `Analyze this screenshot (session ID: ${screenshot.sessionId}, timestamp: ${screenshot.timestamp}). Describe what the user is doing.` },
                { type: "image_url", image_url: { url: base64Image, detail: "low" } },
            ];

            messages.push({
                role: "user",
                content: content,
            });
        } catch (imageError) {
            console.error(`Failed to convert image ${screenshot.url} to base64:`, imageError);
            messages.push({
                role: "user",
                content: `Failed to analyze screenshot due to an error. Session ID: ${screenshot.sessionId}, timestamp: ${screenshot.timestamp}.`,
            });
        }
    }

    messages.push({
        role: "user",
        content: "Based on these screenshots and any available descriptions, provide a concise summary of the user's overall activity.",
    });

    try {
        const completion = await openai.chat.completions.create({
            model: MODEL,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages: messages as any,
            max_tokens: 500,
        });

        const summary = completion.choices[0].message.content;
        return summary || "No summary generated"; // Ensure a string is always returned
    } catch (error) {
        console.error("OpenAI error:", error);
        return "Error generating AI summary.";
    }
}