import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl)
  const code = searchParams.get('code')

  const redirectTo = request.cookies.get('redirectTo')?.value || '/'

  const registerResponse = await api.post(
    '/register',
    {
      code,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  const tokenSchema = z.object({
    token: z.string(),
  })

  const { token } = tokenSchema.parse(registerResponse.data)

  const redirectUrl = new URL(redirectTo, request.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30 // 30 days

  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
