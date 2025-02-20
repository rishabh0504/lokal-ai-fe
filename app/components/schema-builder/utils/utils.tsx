import { FieldType, Schema, SchemaField } from '../types/types'

export function generateSchema(fields: SchemaField[]): Schema {
  const schema: Schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false, // Recommended for security
  }

  fields.forEach((field) => {
    if (schema.properties && schema.required) {
      schema.properties[field.name] = generateFieldSchema(field)
      if (field.required) {
        schema.required.push(field.name)
      }
    }
  })

  return schema
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateFieldSchema(field: SchemaField): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fieldSchema: any = { type: field.type }

  if (field.type === 'object') {
    fieldSchema.type = 'object'
    fieldSchema.properties = {}
    fieldSchema.required = []
    fieldSchema.additionalProperties = false // Recommended for security

    if (field.children) {
      field.children.forEach((child) => {
        fieldSchema.properties[child.name] = generateFieldSchema(child)
        if (child.required) {
          fieldSchema.required.push(child.name)
        }
      })
    }
  } else if (field.type === 'array' && field.children && field.children.length > 0) {
    fieldSchema.type = 'array'
    fieldSchema.items = generateFieldSchema(field.children[0])
  }

  // Add validation properties
  if (field.minimum !== undefined) fieldSchema.minimum = field.minimum
  if (field.maximum !== undefined) fieldSchema.maximum = field.maximum
  if (field.minLength !== undefined) fieldSchema.minLength = field.minLength
  if (field.maxLength !== undefined) fieldSchema.maxLength = field.maxLength
  if (field.pattern !== undefined) fieldSchema.pattern = field.pattern
  if (field.enum !== undefined) fieldSchema.enum = field.enum

  // Add new properties
  if (field.description) fieldSchema.description = field.description
  if (field.default !== undefined) fieldSchema.default = field.default
  if (field.format) fieldSchema.format = field.format
  if (field.uniqueItems !== undefined) fieldSchema.uniqueItems = field.uniqueItems

  return fieldSchema
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseSchema(schema: any): SchemaField[] {
  if (schema.type !== 'object') {
    throw new Error('Root schema must be an object')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.entries(schema.properties).map(([name, prop]: [string, any]) => {
    return parseSchemaField(name, prop, schema.required?.includes(name) || false)
  })
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSchemaField(name: string, schema: any, required: boolean): SchemaField {
  const field: SchemaField = {
    name,
    type: schema.type as FieldType,
    required,
  }

  if (schema.description) field.description = schema.description
  if (schema.default !== undefined) field.default = schema.default
  if (schema.format) field.format = schema.format
  if (schema.uniqueItems !== undefined) field.uniqueItems = schema.uniqueItems

  if (schema.minimum !== undefined) field.minimum = schema.minimum
  if (schema.maximum !== undefined) field.maximum = schema.maximum
  if (schema.minLength !== undefined) field.minLength = schema.minLength
  if (schema.maxLength !== undefined) field.maxLength = schema.maxLength
  if (schema.pattern !== undefined) field.pattern = schema.pattern
  if (schema.enum !== undefined) field.enum = schema.enum

  if (schema.type === 'object' && schema.properties) {
    field.children = Object.entries(schema.properties).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([childName, childProp]: [string, any]) => {
        return parseSchemaField(childName, childProp, schema.required?.includes(childName) || false)
      },
    )
  } else if (schema.type === 'array' && schema.items) {
    field.children = [parseSchemaField('items', schema.items, false)]
  }

  return field
}
