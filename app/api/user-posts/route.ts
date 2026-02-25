import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const posts = db.prepare(`
      SELECT up.*, u.name as user_name, u.avatar as user_avatar
      FROM user_posts up
      JOIN users u ON up.user_id = u.id
      ORDER BY up.id
    `).all() as any[];

    const result = posts.map(p => ({
      id: p.id,
      content: p.content,
      image: p.image,
      likes: p.likes,
      comments: p.comments,
      time: p.time,
      user: p.user_name,
      avatar: p.user_avatar,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
