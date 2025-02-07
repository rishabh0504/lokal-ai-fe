import { Label } from '@/components/ui/label'
import Image from 'next/image'

interface AgentInterationProps {
  imageSrc?: string
  imageAlt?: string
  title?: string
  description?: string
}

function AgentInteration({
  imageSrc = '/icons/agents.png',
  imageAlt = 'No Agent Selected',
  title = 'No Agent Selected',
  description = 'Please select an agent from the list to begin. You can manage agents in the sidebar section.', // Default description
}: AgentInterationProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-full bg-gray-100 flex items-center justify-center w-48 h-48 shadow-md">
        <Image src={imageSrc} alt={imageAlt} width={120} height={120} className="object-contain" />
      </div>
      <Label htmlFor="Dashboard" className="mt-8 text-xl font-semibold text-primary text-center">
        {title}
      </Label>
      <p className="text-md text-muted-foreground text-center mt-2 max-w-md">{description}</p>
    </div>
  )
}

export default AgentInteration
