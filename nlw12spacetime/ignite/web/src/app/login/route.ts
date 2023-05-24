import { signInUrl } from '@/lib/common'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = new URL(signInUrl, request.url)

  return NextResponse.redirect(redirectUrl)
}
