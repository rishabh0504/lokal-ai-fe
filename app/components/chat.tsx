'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function Chat() {
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
    <div className="flex flex-col h-screen w-full bg-background">
      <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex items-end space-x-2',
              message.sender === 'me' ? 'justify-end' : 'justify-start',
            )}
          >
            {message.sender !== 'me' && (
              <Avatar>
                <AvatarImage src="/icons/bot.png" alt="Bot Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'p-2 rounded-lg text-sm',
                message.sender === 'me'
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted dark:bg-muted-foreground/10',
              )}
            >
              {message.content}
            </div>
            {message.sender === 'me' && (
              <Avatar>
                <AvatarImage src="/icons/user.png" alt="User Avatar" sizes="sm" />
                <AvatarFallback>Me</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </ScrollArea>

      <footer className="flex items-center space-x-2 p-2 border-t">
        <Input
          className="flex-1"
          placeholder="Type a message"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage()
            }
          }}
        />
        <Button variant="outline" size="sm" onClick={sendMessage}>
          Send
        </Button>
      </footer>
    </div>
  )
}
