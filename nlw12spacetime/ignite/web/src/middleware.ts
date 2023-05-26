import { NextRequest, NextResponse } from 'next/server'
import { signInUrl } from './lib/common'
import { getUser } from './lib/Auth'

export async function middleware(request: NextRequest) {
  const { name } = getUser(request.cookies.get('token')?.value || '')

  if (name === undefined) {
    return NextResponse.redirect(signInUrl, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=60`,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/memories/:path*',
}
