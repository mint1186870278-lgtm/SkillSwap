import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM skills';
    const conditions: string[] = [];
    const params: any[] = [];

    if (category && category !== 'All Skills') {
      if (category === 'Design') {
        conditions.push("(type = 'Design' OR type = 'Art')");
      } else if (category === 'Other') {
        conditions.push("type NOT IN ('Language', 'Fitness', 'Tech', 'Design', 'Art')");
      } else {
        conditions.push('type = ?');
        params.push(category);
      }
    }

    if (search) {
      conditions.push('(title LIKE ? OR user_name LIKE ? OR description LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const skills = db.prepare(query).all(...params) as any[];

    const result = skills.map(s => ({
      id: s.id,
      title: s.title,
      user: s.user_name,
      avatar: s.avatar,
      type: s.type,
      distance: s.distance,
      image: s.image,
      rating: s.rating,
      lessons: s.lessons,
      speaks: s.speaks,
      price: s.price,
      description: s.description,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
