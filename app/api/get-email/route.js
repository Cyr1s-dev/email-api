import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

const redis = Redis.fromEnv()

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  try {
    const data = await redis.get(`email:${email}`)
    if (!data) return NextResponse.json({ status: 'pending' })
    
    return NextResponse.json({ status: 'success', data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}