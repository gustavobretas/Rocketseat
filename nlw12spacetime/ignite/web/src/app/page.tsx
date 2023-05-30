import { EmptyMemory } from '@/components/EmptyMemory'
import { getUser } from '@/lib/Auth'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MoreHorizontal } from 'lucide-react'
// import Cookie from 'js-cookie'

dayjs.locale(ptBr)

interface Memory {
  id: string
  coverUrl: string
  excerpt: boolean
  createdAt: string
}

export default async function Home() {
  // const token = Cookie.get('token') || ''
  const token = cookies().get('token')?.value || ''
  const { name } = getUser(token)

  if (name === undefined) {
    return <EmptyMemory />
  }

  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemory />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <div className="grid grid-cols-2">
              <div>
                <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </time>
              </div>
              <div className="flex max-h-screen flex-col">
                <Link
                  href={`memories/${memory.id}`}
                  className="flex items-center gap-2 self-end text-sm text-gray-200 hover:text-gray-100"
                >
                  <MoreHorizontal></MoreHorizontal>
                </Link>
              </div>
            </div>
            <Image
              src={memory.coverUrl}
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
              alt={`Cover Image of ${memory.id}`}
            ></Image>
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>
            <Link
              href={`memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Ler mais
              <ArrowRight className="h-4 w-4"></ArrowRight>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
