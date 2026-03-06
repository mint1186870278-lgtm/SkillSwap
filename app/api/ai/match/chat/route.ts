import { NextRequest, NextResponse } from 'next/server';

/**
 * AI 配对助手 - 占位实现
 * 后端实现后替换此文件逻辑，详见 AI_ASSISTANT_BACKEND_SPEC.md
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages is required and must be an array' }, { status: 400 });
    }

    // 占位：返回简单回复，后端实现后替换为真实 AI 调用
    return NextResponse.json({
      text: '收到！正在为你匹配最合适的技能交换伙伴...（后端实现中）',
      skillIds: []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI match failed' }, { status: 500 });
  }
}
