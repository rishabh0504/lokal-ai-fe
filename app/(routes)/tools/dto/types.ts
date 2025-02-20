export interface ToolConfig {
  id?: string
  name: string
  description: string

  execution_type: 'REST_API' | 'PYTHON_FUNCTION' | 'JAVASCRIPT_FUNCTION' | 'CUSTOM'
  code?: string
  auth_type: 'NONE' | 'API_KEY' | 'OAUTH2' | 'CUSTOM'

  auth_details?: string // JSON string
  input_schema: string // JSON string
  output_schema: string // JSON string
  execution_details: string // JSON string

  is_safe?: boolean
  requires_confirmation?: boolean
  usage_count?: number
  last_used?: string | null
  createdAt?: string
  updatedAt?: string
}
