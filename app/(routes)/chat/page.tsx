'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import Chat from './components/chat'
export default function ChatPage() {
  const [userMessage, setUserMessage] = useState('')
  const [messages, setMessages] = useState([
    { sender: 'user', content: 'Hello everyone!' },
    { sender: 'user', content: "How's it going?" },
    { sender: 'me', content: "Hello! It's going well, thanks for asking." },
    { sender: 'me', content: 'What about you?' },
  ])

  const sendMessage = () => {
    if (userMessage.trim() !== '') {
      setMessages([...messages, { sender: 'me', content: userMessage }])
      setUserMessage('')
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
        <Chat messages={messages} />
        <footer className="flex w-full items-center space-x-2 p-2">
          <Textarea
            className="flex-1 resize-none"
            placeholder="Type a message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          />
          <Button variant="outline" size="sm" onClick={sendMessage}>
            Send
          </Button>
        </footer>
      </div>
    </div>
  )
}
