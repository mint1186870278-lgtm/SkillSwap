import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, context, targetLanguage } = body;

    if (!action || !context) {
      return NextResponse.json(
        { error: 'Missing required fields: action, context' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service not configured. Set GEMINI_API_KEY in .env.local' },
        { status: 503 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    let prompt: string;

    switch (action) {
      case 'translate':
        prompt = `Translate the following text to ${targetLanguage || 'Chinese (Simplified)'}. Only return the translation, nothing else.\n\nText: "${context}"`;
        break;
      case 'contract':
        prompt = `Generate a brief, friendly skill exchange agreement based on this conversation context. Include: participants, skills exchanged, proposed schedule, and basic terms. Keep it concise and informal.\n\nContext: "${context}"`;
        break;
      case 'schedule':
        prompt = `Based on the conversation context, suggest 3 possible meeting times for a skill exchange session. Consider typical availability patterns. Format each as a simple date/time option.\n\nContext: "${context}"`;
        break;
      default:
        prompt = `Process the following text for a skill exchange platform. Action: ${action}.\n\nText: "${context}"`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      result: text,
      confidence: 0.95,
      action,
    });
  } catch (error: any) {
    console.error('AI processing error:', error);
    return NextResponse.json(
      { error: 'AI processing failed: ' + error.message },
      { status: 500 }
    );
  }
}
