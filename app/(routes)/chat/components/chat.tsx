import { ScrollArea } from '@/components/ui/scroll-area'
import { FC } from 'react'
import AgentInteration from '../../agent/components/agent-interation'
import { Agent } from '../../agent/types/type'
import ChatMessage from './message'

interface ChatProps {
  messages: {
    sender: string
    content: string
  }[]
  activeAgent: Partial<Agent> | null
}

const Chat: FC<ChatProps> = (props: ChatProps) => {
  const { messages, activeAgent } = props ?? []
  return (
    <>
      <ScrollArea className="flex-1 p-4 space-y-4 ">
        {!activeAgent && <AgentInteration />}

        {activeAgent && messages.length == 0 && (
          <AgentInteration title="How may I help you??" description="Please ask your queries." />
        )}

        {activeAgent && messages.length > 0 && (
          <>
            {messages.map((eachMessage: { sender: string; content: string }, index: number) => (
              <ChatMessage key={index} sender={eachMessage.sender} content={eachMessage.content} />
            ))}
          </>
        )}
      </ScrollArea>
    </>
  )
}
export default Chat
