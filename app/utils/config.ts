import { Brain, Hammer, LucideIcon, SquareTerminal } from 'lucide-react'
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
      title: 'Dashboard',
      url: '/',
      icon: SquareTerminal,
      isActive: false,
      type: 'dashboard',
      iconName: 'history.png',
    },

    {
      title: 'Agents',
      url: '/agent',
      icon: SquareTerminal,
      isActive: false,
      type: 'agent',
      iconName: 'agents.png',
    },
    {
      title: 'LLM Models',
      url: '/llm',
      icon: SquareTerminal,
      isActive: false,
      iconName: 'llm.png',
      type: 'llm_model',
    },
    {
      title: 'Tools',
      url: '/tools',
      icon: Hammer,
      isActive: false,
      iconName: 'llm.png',
      type: 'llm_model',
    },
    {
      title: 'Chat History',
      url: '#',
      icon: SquareTerminal,
      isActive: false,
      type: 'chat_history',
      iconName: 'history.png',
      items: [],
    },
  ],
}

export const DASHBOARD_STATS = {
  stats: [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      description: '+20.1% from last month',
    },
    {
      title: 'Subscriptions',
      value: '+2350',
      description: '+180.1% from last month',
    },
    {
      title: 'Sales',
      value: '+12,234',
      description: '+19% from last month',
    },
  ],
  detailedStats: {
    data: [
      { name: 'Jan', Revenue: 4000 },
      { name: 'Feb', Revenue: 3000 },
      { name: 'Mar', Revenue: 2000 },
      { name: 'Apr', Revenue: 2780 },
      { name: 'May', Revenue: 1890 },
      { name: 'Jun', Revenue: 2390 },
      { name: 'Jul', Revenue: 3490 },
      { name: 'Aug', Revenue: 2780 },
      { name: 'Sep', Revenue: 1890 },
      { name: 'Oct', Revenue: 2390 },
      { name: 'Nov', Revenue: 3490 },
      { name: 'Dec', Revenue: 3490 },
    ],
  },
}

export const API_CONFIG = {
  llms: {
    root: 'llm-models',
  },
  agents: {
    root: 'agents',
  },
  chat: {
    session: 'sessions',
    root: 'chat',
  },
  aiService: {
    root: 'ai-services/models',
  },
  toolConfig: {
    root: 'tools',
  },
}
