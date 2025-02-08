import { Agent } from '@/app/(routes)/agent/types/type'

export type LLMModel = {
  id: string
  name: string
  modelName: string
  version: string
  description: string
  defaultPrompt: string

  temperatureMin: number
  temperatureMax: number
  temperatureDefault: number

  top_pMin: number
  top_pMax: number
  top_pDefault: number

  top_kMin: number
  top_kMax: number
  top_kDefault: number

  max_tokensMin: number
  max_tokensMax: number
  max_tokensDefault: number

  presence_penaltyMin: number
  presence_penaltyMax: number
  presence_penaltyDefault: number

  frequency_penaltyMin: number
  frequency_penaltyMax: number
  frequency_penaltyDefault: number

  repeat_penaltyMin: number
  repeat_penaltyMax: number
  repeat_penaltyDefault: number

  stop_sequences: string[]

  usageCount: number
  agents: Agent[]
  created_at: string
  updated_at: string
}
