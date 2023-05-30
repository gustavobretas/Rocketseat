import { BackToTimeline } from '@/components/BackToTimeline'
import { MemoryForm } from '@/components/MemoryForm'

export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <BackToTimeline></BackToTimeline>
      <MemoryForm />
    </div>
  )
}
