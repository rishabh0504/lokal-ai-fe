'use client'

import { useDispatch, useSelector } from 'react-redux'

import { Agent } from '@/app/(routes)/agent/types/type'
import { setActiveAgent } from '@/app/store/slices/agent.reducer'
import { AppDispatch, RootState } from '@/app/store/store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

interface CurrentAgentProps {
  className?: string
  disabled?: boolean
}

const CurrentAgent: React.FC<CurrentAgentProps> = ({ className, disabled }) => {
  const dispatch = useDispatch<AppDispatch>()

  const agents = (useSelector((state: RootState) => state.agents.items) as Agent[]) || []
  const activeAgent = useSelector((state: RootState) => state.agents.activeAgent) as Agent | null

  const [value, setValue] = useState<string>(activeAgent?.id || '')

  useEffect(() => {
    if (activeAgent?.id) {
      setValue(activeAgent.id)
    }
  }, [activeAgent])

  useEffect(() => {
    if (value) {
      const agent = agents.find((agent) => agent.id === value)
      if (agent) {
        dispatch(setActiveAgent(agent))
      }
    }
  }, [value, agents, dispatch])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
  }

  return (
    <Select onValueChange={handleValueChange} value={value} disabled={disabled}>
      <SelectTrigger className={`w-[200px] text-sm ${className || ''}`}>
        <SelectValue placeholder="Select Agent" />
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
export default CurrentAgent
