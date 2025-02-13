'use client'
import AgentInteration from '@/app/(routes)/agent/components/agent-interation'
import { Agent } from '@/app/(routes)/agent/types/type'
import ChatMessage from '@/app/(routes)/chat/components/chat-message'
import { Session } from '@/app/(routes)/chat/type/types'
import { SessionModel } from '@/app/components/nav-main'
import useFetch from '@/app/hooks/useFetch'
import { setActiveAgent } from '@/app/store/slices/agent.reducer'
import { AppDispatch, RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import Loading from '@/components/ui/loading'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useAuth, useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CurrentAgent from '../agent/components/current-agent'

type Message = {
  sender: string
  content: string
  id: string
  done?: boolean
  isAgent?: boolean
}

interface SSEData {
  content: string
  sender: string
  done: boolean
}

export default function ChatPage() {
  const { user } = useUser()
  const activeAgent: Partial<Agent> | null = useSelector(
    (state: RootState) => state.agents.activeAgent,
  )

  const allAgents: Agent[] = useSelector((state: RootState) => state.agents.items)
  const allSessions: SessionModel[] = useSelector((state: RootState) => state.sessions.items) || []

  const dispatch = useDispatch<AppDispatch>()

  const [userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.session}`
  const { post: createSession } = useFetch<Partial<Session>>(baseUrl)
  const chatBasepoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.root}`
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const { get: fetchHistory } = useFetch<Message[]>(chatBasepoint)

  const [historyLoading, setHistoryLoading] = useState(false)

  const { getToken } = useAuth()

  const searchParams = useSearchParams()
  const router = useRouter()

  const sessionIdFromParams = searchParams.get('sessionId')
  const [sessionId, setSessionId] = useState<string | null>(null)

  const sseRef = useRef<EventSource | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sessionIdFromParams) {
      if (allSessions && allAgents && Array.isArray(allSessions) && Array.isArray(allAgents)) {
        const session = allSessions.find(
          (eachSession: SessionModel) => eachSession.id === sessionIdFromParams,
        )
        if (session) {
          const agentId = session.agentId
          if (agentId) {
            const foundAgent = allAgents.find((agent: Agent) => agent.id === agentId)
            if (foundAgent) {
              dispatch(setActiveAgent(foundAgent))
            } else {
              console.warn(`Agent with ID ${agentId} not found in allAgents.`)
            }
          } else {
            console.warn(`No agent ID found for session ${sessionIdFromParams}.`)
          }
        }
      }
      setSessionId(sessionIdFromParams)
      initializeSSE(sessionIdFromParams)
      fetchChatHistory(sessionIdFromParams)
    } else {
      setActiveAgent(null)
      setMessages([])
      setSessionId(null)
    }
  }, [sessionIdFromParams, allSessions, allAgents, dispatch, setActiveAgent])

  const initializeSSE = async (sessionId: string) => {
    if (sseRef.current) {
      sseRef.current.close()
    }

    const token = await getToken()

    if (!token) {
      console.error('No Clerk token found')
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Could not retrieve authentication token. Please try again.',
      })
      return
    }
    const sseUrl = new URL(`${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/chat/${sessionId}/stream`)
    sseUrl.searchParams.append('token', token)

    const eventSource = new EventSource(sseUrl)

    eventSource.onmessage = (event) => {
      try {
        const payload: SSEData = JSON.parse(event.data)

        setMessages((prevMessages) => {
          if (
            prevMessages.length > 0 &&
            !prevMessages[prevMessages.length - 1].done &&
            prevMessages[prevMessages.length - 1].isAgent
          ) {
            setIsStreaming(true)
            const updatedMessages = [...prevMessages]
            updatedMessages[prevMessages.length - 1] = {
              ...updatedMessages[prevMessages.length - 1],
              content: updatedMessages[prevMessages.length - 1].content + payload.content,
              done: payload.done,
              sender: payload.sender,
              isAgent: true,
            }
            return updatedMessages
          } else {
            const newMessage: Message = {
              id: new Date().toISOString(),
              sender: payload.sender,
              content: payload.content,
              done: payload.done,
              isAgent: true,
            }
            setIsStreaming(false)
            return [...prevMessages, newMessage]
          }
        })
      } catch (error) {
        console.error('Error parsing SSE data:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
    }
    sseRef.current = eventSource
  }

  const fetchChatHistory = async (sessionId: string) => {
    try {
      setHistoryLoading(true)
      const historyMessage: Message[] | null = await fetchHistory(
        `${chatBasepoint}/${sessionId}/chat-history`,
      )
      if (historyMessage && Array.isArray(historyMessage)) {
        setMessages(historyMessage)
      }
      if (!historyMessage) {
        setMessages([])
      }
      setHistoryLoading(false)
    } catch (error) {
      console.error('Error fetching chat history:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load chat history. Please try again.',
      })
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const createChatSession = async () => {
    try {
      const payload: Partial<Session> = {
        agentId: activeAgent?.id,
        userId: user?.id,
        title: 'default',
      }
      const response = await createSession<Partial<Session>>(payload, baseUrl)
      if (!response) {
        throw new Error(`Failed to create session.`)
      }

      setSessionId(response.id ?? null)
      if (response.id) {
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

  const sendMessageToBackend = async (message: string) => {
    const currentSessionId = sessionId ?? null

    if (!currentSessionId) {
      await createChatSession()
      return
    }

    const token = await getToken()

    if (!token) {
      console.error('No Clerk token found for message')
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Could not retrieve authentication token. Please try again.',
      })
      return
    }

    const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/chat/${currentSessionId}/message`
    const messageResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user?.id, message }),
    })

    if (!messageResponse.ok) {
      console.error('Error sending message:', messageResponse.status, await messageResponse.text())
    } else {
      console.log('Message sent successfully')
    }
  }

  const sendMessage = async (message: string) => {
    if (message.trim() !== '') {
      setUserMessage('')
      sendMessageToBackend(message)
    }
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8 ">
      <div className="flex flex-col h-screen w-full bg-background ">
        <div className="flex justify-between items-center py-4">
          <Label
            htmlFor="Agent"
            className="text-lg font-semibold tracking-tight text-primary flex-grow text-left"
          >
            Chat
          </Label>
          <CurrentAgent
            className="flex-shrink-0 text-right"
            disabled={(activeAgent !== null && messages.length > 0) || !!sessionId}
          />
        </div>
        <Separator />
        <>
          <ScrollArea className="flex-1 p-4 space-y-4 " ref={scrollAreaRef}>
            {!activeAgent && <AgentInteration />}
            {activeAgent && messages.length === 0 && (
              <AgentInteration
                title="How may I help you??"
                description="Please ask your queries."
              />
            )}
            {historyLoading && <Loading />}
            {((activeAgent && sessionId) || sessionId) && (
              <>
                {messages.map((eachMessage: Message) => (
                  <ChatMessage
                    key={eachMessage.id}
                    sender={eachMessage.sender}
                    content={eachMessage.content}
                    userIdentifier={user?.id}
                  />
                ))}
              </>
            )}
          </ScrollArea>
        </>
        <footer className="flex w-full items-center space-x-2 p-2">
          <Textarea
            className="flex-1 resize-none"
            placeholder="Type a message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(userMessage)
              }
            }}
            disabled={!activeAgent || isStreaming}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={!activeAgent || isStreaming}
            onClick={() => {
              sendMessage(userMessage)
            }}
          >
            Send
          </Button>
        </footer>
      </div>
    </div>
  )
}
