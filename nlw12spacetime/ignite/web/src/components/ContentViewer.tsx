'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'

export function ContentViewer(props: { value?: string; shrink: boolean }) {
  const [content, setContent] = useState(props.value || '')
  const [showExcerpt, setShowExcerpt] = useState(props.shrink)

  function handleContentChange() {
    if (showExcerpt) {
      setContent(props.value?.substring(0, 115).concat('...') || '')
    } else {
      setContent(props.value || '')
    }
    setShowExcerpt(!showExcerpt)
  }
  return (
    <>
      <p className="text-lg leading-relaxed text-gray-100">{content}</p>
      <div
        onClick={handleContentChange}
        className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
      >
        {showExcerpt ? (
          <>
            <ArrowLeft className="h-4 w-4" />
            Menos
          </>
        ) : (
          <>
            Ler mais
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </div>
    </>
  )
}
