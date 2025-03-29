import { NextResponse } from "next/server";
import OpenAI from "openai";
import dbConnect from "../../lib/mongodb";
import Screenshot from "../../models/Screenshot";
import { ScreenshotType } from "../../models/Screenshot";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o";

interface GPT4VisionMessage {
  role: "system" | "user";
  content: string;
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

  const analysisItems: AnalysisItem[] = [];

  const batchPrompt = `You are an expert at analyzing screenshots and providing insightful summaries of user activity. I will provide you with a list of screenshots from a user session. Provide a summary for each screenshot. Then provide a detailed summary and overall conclusion.The overall conclusion must be in the following format:\n\n"overall summary of the user's activity" \n\nDo not include any other text or formatting outside the conclusion and the analysis.`;
  const messages: GPT4VisionMessage[] = [
    {
      role: "system",
      content: batchPrompt,
    },
  ];
  let promptText = "Here are the screenshots:\n";
  for (const screenshot of screenshots) {
    promptText += `- Screenshot URL: ${screenshot.url}, Timestamp: ${screenshot.timestamp}\n`;
  }

  messages.push({
    role: "user",
    content: promptText,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      max_tokens: 16000,
    });
    const analysis =
      completion.choices[0].message.content || "No analysis generated";

    try {
      const parsedAnalysis = analysis.split('\n');

      if (parsedAnalysis.length >= screenshots.length) {
        for (let i = 0; i < screenshots.length; i++) {
          analysisItems.push({
            url: screenshots[i].url,
            timestamp: screenshots[i].timestamp.toISOString(),
            analysis: parsedAnalysis[i] || "No analysis generated",
          });
        }
         if (parsedAnalysis.length > screenshots.length)
         {
           analysisItems.push({
                      url: '',
                      timestamp: '',
                      analysis: "conclusion: " + parsedAnalysis[parsedAnalysis.length -1] || "Failed to analyze screenshot due to parsing error.",
                  });

          }
      } else {
        console.warn(
          "Parsed analysis length does not match screenshots length."
        );
        screenshots.forEach((screenshot) =>
          analysisItems.push({
            url: screenshot.url,
            timestamp: screenshot.timestamp.toISOString(),
            analysis: "Failed to analyze screenshot due to parsing error.",
          })
        );
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      screenshots.forEach((screenshot) =>
        analysisItems.push({
          url: screenshot.url,
          timestamp: screenshot.timestamp.toISOString(),
          analysis: "Failed to analyze screenshot due to parsing error.",
        })
      );
    }
  } catch (analysisError) {
    console.error(`OpenAI analysis error:`, analysisError);
    screenshots.forEach((screenshot) =>
      analysisItems.push({
        url: screenshot.url,
        timestamp: screenshot.timestamp.toISOString(),
        analysis: "Failed to analyze screenshot due to parsing error.",
      })
    );
  }

  return analysisItems;
}