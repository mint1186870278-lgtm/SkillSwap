import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const posts = db.prepare('SELECT * FROM posts ORDER BY id').all() as any[];

    const result = posts.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      user: p.user_name,
      avatar: p.avatar,
      image: p.image,
      likes: p.likes,
      comments: p.comments,
      tag: p.tag,
      time: p.time,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
