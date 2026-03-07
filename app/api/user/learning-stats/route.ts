import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const learningSessions = db.prepare("SELECT * FROM sessions WHERE type IN ('Learning', 'Teaching')").all() as any[];
    const learningInProgress = learningSessions.length;

    const skills = db.prepare('SELECT id FROM skills').all() as any[];
    const savedCount = Math.min(skills.length, 20);

    return NextResponse.json({
      learningInProgress,
      savedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
