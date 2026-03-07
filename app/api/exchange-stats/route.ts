import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();

    const pastSessions = db.prepare("SELECT * FROM sessions WHERE type = 'past'").all() as any[];
    const contacts = db.prepare('SELECT id FROM contacts').all() as any[];

    const completedCount = pastSessions.length;
    const totalHours = completedCount * 1; // 假设每次约 1 小时
    const friendsMade = contacts.length;
    const newSkills = completedCount;

    const level = Math.min(5, Math.floor(totalHours / 8) + 1);
    const levelProgress = Math.round(((totalHours % 8) / 8) * 100);

    return NextResponse.json({
      totalHours,
      level,
      levelProgress,
      moneySaved: Math.round(totalHours * 50),
      friendsMade,
      newSkills,
      nextMilestoneText: 'Complete 5 more sessions for "Consistent" badge.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
