'use client'

import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export function MemoryForm(props: { id?: string }) {
  const router = useRouter()
  const method = props.id ? 'PUT' : 'POST'
  const action = props.id ? `/memories/${props.id}` : '/memories'

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    let coverUrl = ''

    const token = Cookie.get('token')
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    const fileToUpload = formData.get('coverUrl')

    if (fileToUpload && method === 'POST') {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers,
      })

      coverUrl = uploadResponse.data.fileUrl.toString()
    }

    const data = {
      coverUrl,
      content: formData.get('content'),
      isPublic: formData.get('isPublic'),
    }

    if (method === 'POST') {
      await api.post(action, data, { headers })
    } else {
      await api.put(action, data, { headers })
    }

    MySwal.fire({
      title: 'Gravado Sucesso!',
      toast: true,
      position: 'top-right',
      icon: 'success',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })

    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4"></Camera>
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value={'true'}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar mémória pública
        </label>
      </div>
      <MediaPicker />
      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre sua experiência que você quer se lembrar pra sempre."
      ></textarea>
      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
