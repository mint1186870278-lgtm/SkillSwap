import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

/** GET /api/nfts - 当前用户 NFT 列表；?userId=xxx 可查指定用户（技能提供者） */
export async function GET(req: NextRequest) {
  try {
    seedDatabase();
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'u_jessica';

    const rows = db.prepare(`
      SELECT id, title, skill_me as skillMe, skill_them as skillThem, partner_name as partner,
             partner_avatar as partnerAvatar, contribution_me as contributionMe,
             contribution_them as contributionThem, created_at as createdAt
      FROM nfts WHERE user_id = ? ORDER BY created_at DESC
    `).all(userId) as any[];

    const result = rows.map(r => ({
      id: r.id,
      title: r.title,
      partner: r.partner,
      partnerAvatar: r.partnerAvatar,
      skillMe: r.skillMe,
      skillThem: r.skillThem,
      contributionMe: r.contributionMe,
      contributionThem: r.contributionThem,
      date: r.createdAt?.slice(0, 7) || r.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[nfts]', error);
    return NextResponse.json([], { status: 200 });
  }
}
