'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { SchemaField } from './types/types'
import { parseSchema } from './utils/utils'

interface SchemaImporterProps {
  onImport: (fields: SchemaField[]) => void
}

export function SchemaImporter({ onImport }: SchemaImporterProps) {
  const [schemaText, setSchemaText] = useState('')

  const handleImport = () => {
    try {
      const schema = JSON.parse(schemaText)
      const fields = parseSchema(schema)
      onImport(fields)
    } catch (error) {
      console.error('Error parsing schema:', error)
      alert('Invalid JSON schema. Please check your input and try again.')
    }
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={schemaText}
        onChange={(e) => setSchemaText(e.target.value)}
        placeholder="Paste your JSON schema here..."
        rows={10}
      />

      <div className="space-y-2 p-3 flex justify-end">
        <Button onClick={handleImport} className="px-4 text-xs">
          Import Schema
        </Button>
      </div>
    </div>
  )
}
