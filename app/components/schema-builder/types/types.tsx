export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array'

export interface SchemaField {
  name: string
  type: FieldType
  required: boolean
  children?: SchemaField[]
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: string[]
  description?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default?: any
  format?: string
  uniqueItems?: boolean
}

export interface Schema {
  title?: string
  type?: 'object'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>
  required?: string[]
}
