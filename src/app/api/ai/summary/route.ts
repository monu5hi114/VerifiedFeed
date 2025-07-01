// app/api/ai/summary/route.ts

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set.');
}

const ai = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    // Read raw text for logging and safer JSON parsing
    const rawBody = await req.text();
    console.log('📦 Raw Request Body:', rawBody);

    let parsed;
    try {
      parsed = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json({ error: 'Malformed JSON body.' }, { status: 400 });
    }

    const title = parsed?.title;

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: a "title" string is required in the request body.' },
        { status: 400 }
      );
    }

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent([
      { text: `Summarize this headline/news in 2-3 lines:\n"${title}"` }
    ]);

    const response = await result.response;
    const summary = response.text();

    if (!summary || typeof summary !== 'string') {
      return NextResponse.json(
        { error: 'Gemini did not return a valid summary.' },
        { status: 500 }
      );
    }

    console.log('📝 Gemini Summary:', summary);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('❌ Server error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again later.' },
      { status: 500 }
    );
  }
}
