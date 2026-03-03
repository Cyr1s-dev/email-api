import { Redis } from '@upstash/redis'
import { NextResponse } from 'next/server'

// 自动读取环境变量中的配置
const redis = Redis.fromEnv()

export async function POST(request) {
  try {
    const body = await request.json()
    const { to, from, subject, raw } = body
    const emailMatch = to.match(/<([^>]+)>/)
    const cleanEmail = emailMatch ? emailMatch[1] : to

    await redis.set(`email:${cleanEmail}`, JSON.stringify({ from, subject, raw }), { ex: 600 })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}