import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const experts = db.prepare('SELECT * FROM similar_experts ORDER BY id').all() as any[];

    const result = experts.map(e => ({
      name: e.name,
      image: e.image,
      lessons: e.lessons,
      rating: e.rating,
      price: parseInt(String(e.price || '1'), 10) || 1,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
