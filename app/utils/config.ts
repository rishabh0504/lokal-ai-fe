import { BookOpen, Bot, Brain, Settings2, SquareTerminal } from 'lucide-react'
export const SIDEBAR_CONFIG = {
  teams: [
    {
      name: 'lokal-ai',
      logo: Brain,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Chat History',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
      ],
    },
    {
      title: 'Text Generator',
      url: '#',
      icon: Bot,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
      ],
    },
    {
      title: 'Image Generator',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'History',
          url: '#',
        },
      ],
    },
    {
      title: 'Video Generator',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
  ],
}
