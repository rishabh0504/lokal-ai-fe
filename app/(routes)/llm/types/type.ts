import { Agent } from '@/app/(routes)/agent/types/type'

export type LLMModelConfig = {
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

export interface OllamaModelResponse {
  name: string
  modified_at: Date
  size: number
  digest: string
  details: ModelDetails
  expires_at: Date
  size_vram: number
}
export interface ModelDetails {
  parent_model: string
  format: string
  family: string
  families: string[]
  parameter_size: string
  quantization_level: string
}
