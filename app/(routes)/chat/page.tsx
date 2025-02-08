'use client'
import AgentInteration from '@/app/(routes)/agent/components/agent-interation'
import { Agent } from '@/app/(routes)/agent/types/type'
import ChatMessage from '@/app/(routes)/chat/components/message'
import { Session } from '@/app/(routes)/chat/type/types'
import useFetch from '@/app/hooks/useFetch'
import { RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

type Message = {
  sender: string
  content: string
  id: string
}

export default function ChatPage() {
  const { user } = useUser()
  const activeAgent: Partial<Agent> | null = useSelector(
    (state: RootState) => state.agents.activeAgent,
  )
  const [userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.session}`
  const { post: createSession } = useFetch<Partial<Session>>(baseUrl)
  const [sessionId, setSessionId] = useState<string | null>(null) // Track the session ID

  const sseRef = useRef<EventSource | null>(null)

  const initializeSSE = (sessionId: string) => {
    // Close existing connection if it exists
    if (sseRef.current) {
      sseRef.current.close()
    }
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/chat/${sessionId}/stream`,
    )

    eventSource.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as Omit<Message, 'userId' | 'agentId'>
        // Update the messages array with the new message
        setMessages((prevMessages) => {
          const messageIndex = prevMessages.findIndex((m) => m.id === message.id)

          if (messageIndex !== -1) {
            // Message exists, update it
            const newMessages = [...prevMessages]
            newMessages[messageIndex] = message
            return newMessages
          } else {
            // Message doesn't exist, add it
            return [...prevMessages, message]
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

  useEffect(() => {
    if (sessionId) {
      initializeSSE(sessionId)
    }
    return () => {
      // Clean up the SSE connection when the component unmounts or the session ID changes
      sseRef.current?.close()
    }
  }, [sessionId]) //Re-run this effect anytime the sessionId changes

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
      //When sesison is created, get the ID and update it.
      setSessionId(response.id ?? null) //Set session ID to start SSE

      //Set all to use SSE and remove double-check, check only for sessionId.
      if (response.id) {
        //Set SSE and Messages after the ChatSession has been set.
        setSessionId(response.id)
        initializeSSE(response.id)
        setMessages([]) // Set messages
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
  const sendMessage = async (message: string) => {
    if (message.trim() !== '') {
      setUserMessage('')

      let currentSessionId: string | null = sessionId ?? null

      //If there are no messages, create new chat session
      if (!currentSessionId) {
        // Create Chat Session if there is no seesion ID
        const newSessionId = await createChatSession()

        if (!newSessionId) {
          // If creating a new chat session fails, early return
          console.error('Failed to create chat session')
          return
        } else {
          currentSessionId = newSessionId
        }
      }

      // Continue Chat
      const endpoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/chat/${currentSessionId}/message`
      // Send Message
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, message }),
      })

      if (!response.ok) {
        console.error('Error sending message:', response.status, await response.text())
      } else {
        console.log('Message sent successfully')
      }
    }
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8 ">
      <div className="flex flex-col h-screen w-full bg-background ">
        <div className="flex justify-between items-center py-4">
          <Label htmlFor="Agent" className="text-lg font-semibold tracking-tight text-primary">
            Chat
          </Label>
        </div>
        <Separator />
        <>
          <ScrollArea className="flex-1 p-4 space-y-4 ">
            {!activeAgent && <AgentInteration />}

            {activeAgent && messages.length == 0 && (
              <AgentInteration
                title="How may I help you??"
                description="Please ask your queries."
              />
            )}

            {activeAgent && messages.length > 0 && (
              <>
                {messages.map((eachMessage: { sender: string; content: string; id: string }) => (
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
            disabled={activeAgent ? false : true}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              sendMessage(userMessage)
            }}
            disabled={activeAgent ? false : true}
          >
            Send
          </Button>
        </footer>
      </div>
    </div>
  )
}
