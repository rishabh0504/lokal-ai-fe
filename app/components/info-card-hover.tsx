import { CircleHelp } from 'lucide-react'

import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
type InfoHoverCardProps = {
  content: string
}
const InfoHoverCard: React.FC<InfoHoverCardProps> = ({ content }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <CircleHelp size={14} className=" rounded-full mx-2 bg-gray-200" />
      </HoverCardTrigger>
      <HoverCardContent className="w-64 bg-gray-100">
        <span className="text-xs text-primary">{content}</span>
      </HoverCardContent>
    </HoverCard>
  )
}
export default InfoHoverCard
