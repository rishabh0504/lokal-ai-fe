import { LucideIcon } from 'lucide-react'

export type IconComponent = LucideIcon

// interface ModelDetails {
//   parent_model: string
//   format: string
//   family: string
//   families: string[]
//   parameter_size: string
//   quantization_level: string
// }
// export interface LLMModel {
//   name: string
//   model: string
//   modified_at: Date
//   size: number
//   digest: string
//   details: ModelDetails
// }

export type Items = {
  name: string
  url: string
  component?: React.ComponentType | undefined
}
export type NavItem = {
  title: string
  url: string
  icon: IconComponent
  isActive: boolean
  type: string
  component?: React.ComponentType
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
  component?: React.ReactNode
}

// export type Agent = {
//   id: string
//   agentName: string
//   created_at: string
//   updated_at: string
//   model: string
// }
export type AgentDto = {
  agentName: string
  model: string
}
