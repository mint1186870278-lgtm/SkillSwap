import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const dashboard = searchParams.get('dashboard');

    let query: string;
    let params: any[] = [];

    if (dashboard === 'true') {
      // Dashboard upcoming sessions use "Learning"/"Teaching" types
      query = "SELECT * FROM sessions WHERE type IN ('Learning', 'Teaching')";
    } else if (filter) {
      query = 'SELECT * FROM sessions WHERE type = ?';
      params.push(filter);
    } else {
      query = "SELECT * FROM sessions WHERE type IN ('upcoming', 'pending', 'past')";
    }

    const sessions = db.prepare(query).all(...params) as any[];

    const result = sessions.map(s => ({
      id: s.id,
      type: s.type,
      skill: s.skill,
      title: s.title,
      partner: s.partner,
      with: s.with,
      avatar: s.avatar,
      date: s.date,
      time: s.time,
      status: s.status,
      roomLink: s.room_link,
      meetingLink: s.meeting_link,
      rated: !!s.rated,
      rating: s.rating,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
