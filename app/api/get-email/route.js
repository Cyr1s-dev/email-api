import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  if (token !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  try {
    const data = await redis.get(`email:${email}`);
    if (!data) return NextResponse.json({ status: 'pending' });
    return NextResponse.json({ status: 'success', data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}