import { ScrollArea } from '@/components/ui/scroll-area'
import ChatMessage from './message'
import { FC } from 'react'

interface ChatProps {
  messages: {
    sender: string
    content: string
  }[]
}

const Chat: FC<ChatProps> = (props: ChatProps) => {
  const { messages } = props ?? []
  return (
    <>
      <ScrollArea className="flex-1 p-4 space-y-4 ">
        {messages.map((eachMessage: { sender: string; content: string }, index: number) => (
          <ChatMessage key={index} sender={eachMessage.sender} content={eachMessage.content} />
        ))}
      </ScrollArea>
    </>
  )
}
export default Chat
