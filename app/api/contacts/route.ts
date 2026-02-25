import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY id').all() as any[];

    const result = contacts.map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      lastMsg: c.last_msg,
      time: c.time,
      unread: c.unread,
      status: c.status,
      skill: c.skill,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
