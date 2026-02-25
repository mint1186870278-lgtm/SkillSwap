import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get('u_jessica') as any;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      title: user.title,
      location: user.location,
      level: user.level,
      trustScore: user.trust_score,
      credits: user.credits,
      bio: user.bio,
      isPro: !!user.is_pro,
      tags: JSON.parse(user.tags || '[]'),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
