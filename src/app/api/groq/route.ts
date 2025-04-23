import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { content, mode, maxTokens = 800 } = await req.json();

    if (!content || !mode) {
      return NextResponse.json(
        { error: "Missing required parameters: content or mode" },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt(mode);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_completion_tokens: maxTokens,
      top_p: 1,
      stream: false,
    });

    return NextResponse.json({
      response:
        chatCompletion.choices?.[0]?.message?.content?.trim() ||
        "Something went wrong. Please try again.",
    });
  } catch (error) {
    console.error("Error during Groq request:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}

function getSystemPrompt(mode: "summary" | "explain" | "insight") {
  switch (mode) {
    case "summary":
      return `
        You are an expert note summarizer. Your goal is to extract the key ideas from a user's note and rewrite them in a clear, concise, and easy-to-read way.
        - Keep it under 100 words.
        - Use bullet points if helpful.
        - Do not include personal commentary.
      `.trim();

    case "explain":
      return `
        You are a helpful assistant who explains complex information in simple terms.
        - Break down difficult concepts.
        - Use analogies or examples if needed.
        - Keep the tone friendly and educational.
      `.trim();

    case "insight":
      return `
        You are a reflective assistant that reviews user notes and offers insights.
        - Give 1 question to spark deeper thought.
        - Offer a helpful suggestion based on the note.
        - Avoid summarizing. Focus on analysis and usefulness.
      `.trim();

    default:
      return "You are a helpful assistant.";
  }
}
