import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import PostalMime from 'postal-mime';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, from, raw } = body;
    const parser = new PostalMime();
    const email = await parser.parse(raw);
    const emailMatch = to.match(/<([^>]+)>/);
    const cleanEmail = emailMatch ? emailMatch[1] : to;
    await redis.set(`email:${cleanEmail}`, JSON.stringify({
      from,
      subject: email.subject,
      content: email.text,
      date: new Date().toISOString()
    }), { ex: 600 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}