'use client'
import useFetch from '@/app/hooks/useFetch'
import { RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Agent } from '@/app/(routes)/agent/types/type'
import Chat from '@/app/(routes)/chat/components/chat'
import { Session } from '@/app/(routes)/chat/type/types'

type Message = {
  sender: string
  content: string
}
export default function ChatPage() {
  const { user } = useUser()

  const activeAgent: Partial<Agent> | null = useSelector(
    (state: RootState) => state.agents.activeAgent,
  )
  const [userMessage, setUserMessage] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messages, setMessages] = useState<Message[]>([])
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}${API_CONFIG.chat.session}`

  const { post: createSession } = useFetch<Partial<Session>>(baseUrl)

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
  }
  const sendMessage = async (message: string) => {
    if (userMessage.trim() !== '') {
      setUserMessage('')
      if (messages.length > 0) {
        // Continue Chat
      } else {
        // Create Chat Session
        createChatSession()
        console.log(message)
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
        <Chat messages={messages} activeAgent={activeAgent} />
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
