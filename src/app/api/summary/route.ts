import { NextResponse } from "next/server";
import OpenAI from "openai";
import dbConnect from "../../lib/mongodb";
import Screenshot from "../../models/Screenshot";
import { ScreenshotType } from "../../models/Screenshot";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o";

type GPT4VisionContent =
  | { type: "text"; text: string }
  | {
      type: "image_url";
      image_url: { url: string; detail: "low" | "high" | "auto" };
    };

interface GPT4VisionMessage {
  role: "system" | "user";
  content: string | GPT4VisionContent[];
}

async function imageToBase64(imageUrl: string): Promise<string> {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
}

interface AnalysisItem {
  url: string;
  timestamp: string;
  analysis: string;
}

async function generateAnalysis(screenshot: ScreenshotType): Promise<string> {
  try {
    const base64Image = await imageToBase64(screenshot.url);
    const content: GPT4VisionContent[] = [
      {
        type: "text",
        text: `Analyze this screenshot (session ID: ${screenshot.sessionId}, timestamp: ${screenshot.timestamp}). Describe what the user is doing.`,
      },
      { type: "image_url", image_url: { url: base64Image, detail: "low" } },
    ];

    const messages: GPT4VisionMessage[] = [
      {
        role: "system",
        content:
          "You are an expert at analyzing screenshots and providing insightful summaries of user activity. Provide a summary of what is going on in the image",
      },
      {
        role: "user",
        content: content,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      max_tokens: 1500,
      stream: true,
    });

    let analysis = "";
    for await (const part of completion) {
      analysis += part.choices[0]?.delta?.content || "";
    }
    return analysis;
  } catch (error) {
    console.error(`OpenAI analysis error for ${screenshot.url}:`, error);
    return `Failed to analyze screenshot due to an error.`;
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { screenshots: [], summary: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { screenshots: [], summary: "No sessionId provided." },
        { status: 400 }
      );
    }

    const screenshots = await Screenshot.find({ sessionId: sessionId }).sort({
      timestamp: 1,
    });

    if (!screenshots || screenshots.length === 0) {
      return NextResponse.json({
        screenshots: [],
        summary: "No screenshots found for this session.",
      });
    }

    const transformStream = new TransformStream();
    const writer = transformStream.writable.getWriter();
    const encoder = new TextEncoder();

    const sendData = (data: string) => {
      writer.write(encoder.encode(`data: ${data}\n\n`));
    };

    const closeStream = () => {
      writer.close();
    };

    sendData(JSON.stringify({ type: "start" }));

    for (const screenshot of screenshots) {
      try {
        const analysis = await generateAnalysis(screenshot);

        const analysisItem: AnalysisItem = {
          url: screenshot.url,
          timestamp: screenshot.timestamp.toISOString(),
          analysis: analysis,
        };
        sendData(JSON.stringify({ type: "analysis", data: analysisItem }));
      } catch (error) {
        console.error(
          `Failed to generate summary for screenshot ${screenshot.url}:`,
          error
        );
        sendData(
          JSON.stringify({
            type: "error",
            data: `Failed to analyze screenshot due to an error.`,
          })
        );
      }
    }

    sendData(JSON.stringify({ type: "done" }));
    closeStream();

    return new NextResponse(transformStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("MongoDB/OpenAI error:", error);
    return NextResponse.json(
      { screenshots: [], summary: "Error: " + error.message },
      { status: 500 }
    );
  }
}