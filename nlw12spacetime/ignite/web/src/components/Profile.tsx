import { getUser } from '@/lib/Auth'
import Image from 'next/image'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    // SignIn
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt="User Avatar"
        className="h-10 w-10 rounded-full"
      />
      <p className="max-w-[150px] text-sm leading-snug">
        {name}
        <a href="/logout" className="block text-red-400 hover:text-red-300">
          Quero sair
        </a>
      </p>
    </div>
  )
}
