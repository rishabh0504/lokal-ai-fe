'use client'

import { useDispatch, useSelector } from 'react-redux'

import { Agent } from '@/app/(routes)/agent/types/type'
import { SessionModel } from '@/app/components/nav-main'
import useFetch from '@/app/hooks/useFetch'
import { setActiveAgent } from '@/app/store/slices/agent.reducer'
import { setSessions } from '@/app/store/slices/session.reducer'
import { AppDispatch, RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Session } from '../../chat/type/types'

interface CurrentAgentProps {
  className?: string
  disabled?: boolean
}

const CurrentAgent: React.FC<CurrentAgentProps> = ({ className, disabled }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useUser()

  const agents = (useSelector((state: RootState) => state.agents.items) as Agent[]) || []
  const activeAgent = useSelector((state: RootState) => state.agents.activeAgent) as Agent | null
  const router = useRouter()
  const searchParams = useSearchParams()

  const sessionIdFromParams = searchParams.get('sessionId')
  const [value, setValue] = useState<string>(activeAgent?.id || '')

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.session}`
  const { post: createSession } = useFetch<Partial<Session>>(baseUrl)

  useEffect(() => {
    if (activeAgent?.id) {
      setValue(activeAgent.id)
    }
  }, [activeAgent])

  const sessionsBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.session}`
  const { get: fetchSessions } = useFetch<SessionModel[]>(sessionsBaseUrl)
  const getAllSessions = async () => {
    const sessions = await fetchSessions(sessionsBaseUrl)
    if (sessions && Array.isArray(sessions)) {
      dispatch(setSessions(sessions))
    }
  }

  useEffect(() => {
    if (value) {
      const agent = agents.find((agent) => agent.id === value)
      if (agent) {
        dispatch(setActiveAgent(agent))
        if (!sessionIdFromParams) {
          createChatSession(agent)
        }
      }
    }
  }, [value, agents, dispatch])

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
  }

  const createChatSession = async (agent: Agent) => {
    try {
      const payload: Partial<Session> = {
        agentId: agent?.id,
        userId: user?.id,
        title: 'default',
      }
      const response = await createSession<Partial<Session>>(payload, baseUrl)
      if (!response) {
        throw new Error(`Failed to create session.`)
      }

      if (response.id) {
        await getAllSessions()
        router.push(`/chat?sessionId=${response.id}`)
      }

      return response.id
    } catch (error: unknown) {
      let errorMessage = `Failed to initiate chat. Please try again.`

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred:', error)
        errorMessage = 'An unexpected error occurred. Please check the console for details.'
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
    }
    return null
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
