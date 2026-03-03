import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, from, subject, raw } = body;

    if (!to) {
      return NextResponse.json({ error: 'Missing to' }, { status: 400 });
    }

    const emailMatch = to.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : to;

    await redis.set(`email:${cleanEmail}`, JSON.stringify({ from, subject, raw }), { ex: 600 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}