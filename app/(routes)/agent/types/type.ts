import { LLMModelConfig } from '@/app/(routes)/llm/types/type'

export type Agent = {
  id: string
  name: string
  llmModelId: string
  llmModel?: LLMModelConfig
  temperature?: number
  top_p?: number
  top_k?: number
  max_tokens?: number
  presence_penalty?: number
  frequency_penalty?: number
  repeat_penalty?: number
  created_at: string
  updated_at: string
  description: string
  prompt: string
  toolIds?: string[]
}
