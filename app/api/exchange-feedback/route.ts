import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  try {
    seedDatabase();
    const db = getDb();
    const rows = db.prepare(`
      SELECT id, user_name as user, avatar, title, content, image, likes, comments, tag, time,
             skill_me as skillMe, skill_them as skillThem, partner, partner_avatar as partnerAvatar,
             progress_updates as progressUpdates
      FROM exchange_feedback ORDER BY id DESC
    `).all() as any[];

    const result = rows.map(r => ({
      ...r,
      type: 'exchange_feedback',
      tag: r.tag || '交换反馈',
      progressUpdates: typeof r.progressUpdates === 'string' ? JSON.parse(r.progressUpdates || '[]') : (r.progressUpdates || []),
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[exchange-feedback]', error);
    return NextResponse.json([], { status: 200 });
  }
}
