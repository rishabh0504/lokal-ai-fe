import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  sender: string
  content: string
  avatarSrcUser?: string
  avatarSrcOther?: string
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  avatarSrcUser = '/icons/user.png',
  avatarSrcOther = '/icons/bot.png',
}) => {
  return (
    <div
      className={cn(
        'flex items-start space-x-2 my-1',
        sender === 'me' ? 'justify-end' : 'justify-start',
      )}
    >
      {sender !== 'me' && (
        <Avatar>
          <AvatarImage src={avatarSrcOther} alt="Other Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-2 rounded-lg text-sm my-1 bg-muted dark:bg-muted-foreground/10 ', // Added max-w-[80%]
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          className="markdown-body"
        >
          {content}
        </ReactMarkdown>
      </div>
      {sender === 'me' && (
        <Avatar>
          <AvatarImage src={avatarSrcUser} alt="User Avatar" sizes="sm" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default ChatMessage
