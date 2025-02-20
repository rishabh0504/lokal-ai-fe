import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  sender: string
  content: string
  userIdentifier?: string
  avatarSrcUser?: string
  avatarSrcOther?: string
}

const ChatMessage: FC<ChatMessageProps> = ({
  sender,
  content,
  userIdentifier,
  avatarSrcUser = '/icons/user.png',
  avatarSrcOther = '/icons/bot.png',
}) => {
  const isUser = sender === userIdentifier

  return (
    <div
      className={cn('flex items-start space-x-2 my-1', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser && (
        <Avatar>
          <AvatarImage src={avatarSrcOther} alt="Other Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'p-2 rounded-lg text-sm my-1 max-w-[80%] px-4',
          isUser
            ? 'bg-green-100 dark:bg-green-600 text-right'
            : 'bg-muted dark:bg-muted-foreground/10 text-left',
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
      {isUser && (
        <Avatar>
          <AvatarImage src={avatarSrcUser} alt="User Avatar" sizes="sm" />
          <AvatarFallback>Me</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export default ChatMessage
