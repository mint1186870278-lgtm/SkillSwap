import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    seedDatabase();
    const db = getDb();
    const { contactId } = await params;
    const cid = parseInt(contactId, 10);

    const messages = db.prepare('SELECT * FROM messages WHERE contact_id = ? ORDER BY id').all(cid) as any[];

    const result = messages.map(m => ({
      id: m.id,
      sender: m.sender,
      text: m.text,
      time: m.time,
      type: m.type || 'text',
      status: m.status,
      skill_me: m.skill_me,
      skill_them: m.skill_them,
      time_slot: m.time_slot,
      icon: m.icon,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    seedDatabase();
    const db = getDb();
    const { contactId } = await params;
    const cid = parseInt(contactId, 10);
    const body = await request.json();

    const stmt = db.prepare(`
      INSERT INTO messages (contact_id, sender, text, time, type, status, skill_me, skill_them, time_slot)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    const result = stmt.run(
      cid,
      body.sender || 'me',
      body.text || null,
      body.time || timeStr,
      body.type || 'text',
      body.status || null,
      body.skill_me || null,
      body.skill_them || null,
      body.time_slot || null,
    );

    // Update contact's last message
    if (body.text) {
      db.prepare('UPDATE contacts SET last_msg = ?, time = ? WHERE id = ?')
        .run(body.text, 'now', cid);
    }

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
