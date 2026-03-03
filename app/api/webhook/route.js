// app/api/webhook/route.js
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, from, subject, raw } = body;

    if (!to) {
      return NextResponse.json({ error: 'Missing recipient' }, { status: 400 });
    }

    // 提取纯邮箱地址
    const emailMatch = to.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : to;

    // 600 秒后自动删除
    await kv.set(`email:${cleanEmail}`, { from, subject, raw }, { ex: 600 });

    console.log(`Saved email for ${cleanEmail}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}