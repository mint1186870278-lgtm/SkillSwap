import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

/** GET /api/nfts/[id] - NFT 详情（交换故事、贡献分配、时间线） */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    seedDatabase();
    const db = getDb();
    const { id } = await params;

    const row = db.prepare(`
      SELECT id, user_id as userId, title, skill_me as skillMe, skill_them as skillThem,
             partner_name as partnerName, partner_avatar as partnerAvatar,
             contribution_me as contributionMe, contribution_them as contributionThem,
             story, created_at as createdAt, timeline
      FROM nfts WHERE id = ?
    `).get(id) as any;

    if (!row) {
      return NextResponse.json({ error: 'NFT not found' }, { status: 404 });
    }

    const timeline = typeof row.timeline === 'string' ? JSON.parse(row.timeline || '[]') : (row.timeline || []);

    return NextResponse.json({
      id: row.id,
      title: row.title,
      skillMe: row.skillMe,
      skillThem: row.skillThem,
      partnerName: row.partnerName,
      partnerAvatar: row.partnerAvatar,
      contributionMe: row.contributionMe,
      contributionThem: row.contributionThem,
      story: row.story,
      createdAt: row.createdAt,
      timeline,
    });
  } catch (error: any) {
    console.error('[nfts/:id]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
