import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id').all() as any[];

    const result = reviews.map(r => ({
      id: r.id,
      user: r.user_name,
      avatar: r.avatar,
      rating: r.rating,
      date: r.date,
      text: r.text,
      class: r.class,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
