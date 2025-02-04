import { Brain, LucideIcon, SquareTerminal } from 'lucide-react'
import Chat from '../components/chat'
import { SidebarType } from './types'
export type IconComponent = LucideIcon

export const SIDEBAR_CONFIG: SidebarType = {
  teams: [
    {
      name: 'Lokal-AI',
      logo: Brain,
      plan: 'Enterprise',
      iconName: 'logo.png',
    },
  ],
  navItems: [
    {
      title: 'Chat History',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      type: 'chat_history',
      iconName: 'history.png',
      items: [
        {
          name: 'New Chat',
          url: '/chat',
          component: Chat,
        },
      ],
    },
    {
      title: 'Agents',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      type: 'agent',
      iconName: 'agents.png',
      items: [
        {
          name: 'New Agent',
          url: '/agent',
        },
      ],
    },
    {
      title: 'LLM Models',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      iconName: 'llm.png',
      type: 'llm_model',
      items: [],
    },
  ],
}
