import { LucideIcon } from 'lucide-react'
import { FC, ReactNode } from 'react'

export type IconComponent = LucideIcon

export type Items = {
  name: string
  url: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: FC<any>
}

export type NavItem = {
  title: string
  url: string
  icon: IconComponent
  isActive: boolean
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: FC<any>
  iconName: string
  items?: Items[]
}

export type Teams = {
  name: string
  logo: IconComponent
  plan: string
  iconName: string
}

export type SidebarType = {
  teams: Teams[]
  navItems: NavItem[]
}

export interface SubNavItem {
  name: string
  url: string
  component?: ReactNode
}

export type AgentDto = {
  agentName: string
  model: string
}
