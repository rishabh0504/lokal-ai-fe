import { Agent } from '@/app/(routes)/agent/types/type'

export interface Session {
  id: string
  created_at: Date
  updated_at: Date
  expires_at: Date | null
  title: string
  status: string
  userId: string
  agentId: string
  agent?: Agent
}
