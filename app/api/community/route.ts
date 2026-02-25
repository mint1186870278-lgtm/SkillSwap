import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const updates = db.prepare('SELECT * FROM community_updates ORDER BY id').all() as any[];

    const result = updates.map(u => ({
      id: u.id,
      text: u.text,
      time: u.time,
      icon: u.icon,
      color: u.color,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
