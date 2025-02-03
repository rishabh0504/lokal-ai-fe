import { Bot, Brain, Settings2, SquareTerminal } from 'lucide-react'
export const SIDEBAR_CONFIG = {
  teams: [
    {
      name: 'lokal-ai',
      logo: Brain,
      plan: 'Enterprise',
      iconName: 'logo.png',
    },
  ],
  navMain: [
    {
      title: 'Chat History',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      iconName: 'history.png',
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
      iconName: 'chat.png',
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
      ],
    },
    {
      title: 'Audio Generator',
      url: '#',
      icon: Settings2,
      iconName: 'audio.png',
      items: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
    {
      title: 'Image Generator',
      url: '#',
      icon: Settings2,
      iconName: 'image.png',
      items: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
    {
      title: 'Video Generator',
      url: '#',
      icon: Settings2,
      iconName: 'video.png',
      items: [
        {
          title: 'General',
          url: '#',
        },
      ],
    },
  ],
}
