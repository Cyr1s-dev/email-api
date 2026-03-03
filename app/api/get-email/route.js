// app/api/get-email/route.js
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: '请提供 email 参数' }, { status: 400 });
  }

  try {
    // 根据邮箱地址从 KV 数据库中查找
    const data = await kv.get(`email:${email}`);

    if (!data) {
      return NextResponse.json({ status: 'pending', message: '尚未收到邮件或已过期' });
    }

    // (可选) 如果您的注册机读完一次就不需要了，可以取消下面这行的注释，实现“阅后即焚”
    // await kv.del(`email:${email}`);

    return NextResponse.json({ status: 'success', data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}