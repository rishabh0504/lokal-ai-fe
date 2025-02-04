import { Brain, SquareTerminal } from 'lucide-react'
export const SIDEBAR_CONFIG = {
  teams: [
    {
      name: 'Lokal-AI',
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
          title: 'New Chat',
          url: '#',
        },
      ],
    },
    {
      title: 'LLM Models',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      iconName: 'llm.png',
      items: [
        {
          title: 'History',
          url: '#',
        },
      ],
    },
  ],
}
