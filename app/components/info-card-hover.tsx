import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { CircleHelp } from 'lucide-react'

interface InfoHoverCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
}

const InfoHoverCard: React.FC<InfoHoverCardProps> = ({ content }) => {
  const prettyJson = typeof content === 'string' ? content : JSON.stringify(content, null, 2)

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <CircleHelp size={14} className="rounded-full mx-2 bg-gray-200" />
      </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-white border border-gray-200 p-4 rounded-lg ">
        <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words text-left h-full">
          {prettyJson}
        </pre>
      </HoverCardContent>
    </HoverCard>
  )
}

export default InfoHoverCard
