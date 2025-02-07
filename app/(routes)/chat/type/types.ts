import { Agent } from '../../agent/types/type'

export interface Session {
  id: string
  created_at: Date
  updated_at: Date
  expires_at: Date | null
  title: string | null
  status: string
  userId: string
  agentId: string | null
  agent?: Agent
}
