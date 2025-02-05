'use client'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function LLMPage() {
  return (
    <div className="w-full flex flex-col px-2 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="LLMs" className="text-lg font-semibold tracking-tight text-primary">
          LLMs
        </Label>
      </div>

      <div className="flex flex-col gap-4">
        <Separator />
      </div>
    </div>
  )
}
