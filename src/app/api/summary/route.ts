import { NextResponse } from "next/server";
import OpenAI from "openai";
import dbConnect from "../../lib/mongodb";
import Screenshot from "../../models/Screenshot";
import { ScreenshotType } from "../../models/Screenshot";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
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

    const summary = await generateSummary(screenshots);

    return NextResponse.json({ screenshots: screenshots, summary: summary });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("MongoDB/OpenAI error:", error);
    return NextResponse.json(
      { screenshots: [], summary: "Error: " + error.message },
      { status: 500 }
    );
  }
}

interface AnalysisItem {
  url: string;
  timestamp: string;
  analysis: string;
}

async function generateSummary(
  screenshots: ScreenshotType[]
): Promise<AnalysisItem[]> {
  if (!screenshots || screenshots.length === 0) {
    return [];
  }

  const messages: GPT4VisionMessage[] = [
    {
      role: "system",
      content:
        "You are an expert at analyzing screenshots and providing insightful summaries of user activity. Provide a summary of what is going on in the image",
    },
  ];

  const analysisItems: AnalysisItem[] = [];

  for (const screenshot of screenshots) {
    try {
      const base64Image = await imageToBase64(screenshot.url);
      const content: GPT4VisionContent[] = [
        {
          type: "text",
          text: `Analyze this screenshot (session ID: ${screenshot.sessionId}, timestamp: ${screenshot.timestamp}). Describe what the user is doing.`,
        },
        { type: "image_url", image_url: { url: base64Image, detail: "low" } },
      ];

      messages.push({
        role: "user",
        content: content,
      });

      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          messages: messages as any,
          max_tokens: 500,
        });

        const analysis =
          completion.choices[0].message.content || "No analysis generated";
        analysisItems.push({
          url: screenshot.url,
          timestamp: screenshot.timestamp.toISOString(),
          analysis: analysis,
        });
      } catch (analysisError) {
        console.error(
          `OpenAI analysis error for ${screenshot.url}:`,
          analysisError
        );
        analysisItems.push({
          url: screenshot.url,
          timestamp: screenshot.timestamp.toISOString(),
          analysis: `Failed to analyze screenshot due to an error.`,
        });
      }
    } catch (imageError) {
      console.error(
        `Failed to convert image ${screenshot.url} to base64:`,
        imageError
      );
      analysisItems.push({
        url: screenshot.url,
        timestamp: screenshot.timestamp.toISOString(),
        analysis: `Failed to analyze screenshot due to an error.`,
      });
    }
  }

  return analysisItems;
}
