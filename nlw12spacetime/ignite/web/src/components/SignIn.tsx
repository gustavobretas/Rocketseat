import { User } from 'lucide-react'
import { cookies } from 'next/headers'
import { Profile } from './Profile'
import { getUser } from '@/lib/Auth'

export function SignIn() {
  const { name, avatarUrl } = getUser(cookies().get('token')?.value || '')

  if (name !== undefined) {
    return <Profile name={name} avatarUrl={avatarUrl} />
  }

  return (
    // SignIn
    <a
      href="/login"
      className="flex items-center gap-3 text-left transition-colors hover:text-gray-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
        <User className="h-5 w-5 text-gray-500" />
      </div>
      <p className="max-w-[150px] text-sm leading-snug">
        <span className="underline">Crie sua conta e salve suas memórias!</span>
      </p>
    </a>
  )
}
