'use client'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useCallback, useEffect, useState } from 'react'
import { FieldBuilder } from './field-builder'
import JsonSchemaViewer from './json-schema-viewer'
import { SchemaImporter } from './schema-importer'
import { Schema, SchemaField } from './types/types'
import { generateSchema, parseSchema } from './utils/utils'

interface SchemaBuilderProps {
  open: boolean
  onClose: () => void
  onSchemaChange: (schema: Schema, fields: SchemaField[]) => void
  initialSchema?: Schema // Changed prop name
}

export function SchemaBuilder({
  open,
  onClose,
  onSchemaChange,
  initialSchema, // Changed prop name
}: SchemaBuilderProps) {
  const [fields, setFields] = useState<SchemaField[]>([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [currentSchema, setCurrentSchema] = useState<Schema | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    if (initialSchema && initialLoad) {
      try {
        const parsedFields = parseSchema(initialSchema)
        setFields(parsedFields)
        setCurrentSchema(initialSchema)
        setInitialLoad(false)
      } catch (error) {
        console.error('Error parsing initial schema:', error)
        toast({
          title: 'Error Parsing Schema',
          description: 'There was an error parsing the provided schema.',
          variant: 'destructive',
        })
      }
    }
  }, [initialSchema, toast])

  const addField = (field: SchemaField) => {
    const newFields = [...fields, field]
    setFields(newFields)
    const newSchema = generateSchema(newFields)
    setCurrentSchema(newSchema)
    onSchemaChange(newSchema, newFields)
    toast({
      title: 'Field Added',
      description: `New field "${field.name}" of type ${field.type} has been added.`,
    })
  }

  const updateField = (index: number, updatedField: SchemaField) => {
    const newFields = [...fields]

    // Check if the index is valid before updating
    if (index >= 0 && index < newFields.length) {
      newFields[index] = updatedField
      setFields(newFields)
      const newSchema = generateSchema(newFields)
      setCurrentSchema(newSchema)
      onSchemaChange(newSchema, newFields)
    } else {
      console.error(`Invalid index: ${index}`)
    }
  }

  const removeField = (index: number) => {
    const fieldName = fields[index].name
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
    const newSchema = generateSchema(newFields)
    setCurrentSchema(newSchema)
    onSchemaChange(newSchema, newFields)
    toast({
      title: 'Field Removed',
      description: `Field "${fieldName}" has been removed.`,
      variant: 'destructive',
    })
  }

  const handleImport = (importedFields: SchemaField[]) => {
    setFields(importedFields)
    const newSchema = generateSchema(importedFields)
    setCurrentSchema(newSchema)
    onSchemaChange(newSchema, importedFields)
    toast({
      title: 'Schema Imported',
      description: 'The schema has been successfully imported and loaded.',
    })
  }

  const generateNewSchema = useCallback(
    (newFields: SchemaField[]) => {
      const newSchema = generateSchema(newFields)
      setCurrentSchema(newSchema)
      onSchemaChange(newSchema, newFields)
      return newSchema
    },
    [onSchemaChange],
  )

  useEffect(() => {
    generateNewSchema(fields)
  }, [fields, generateNewSchema])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Schema Builder</DialogTitle>
          <DialogDescription>Create and manage your JSON schema here.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] p-4">
          <Tabs defaultValue="builder">
            <TabsList>
              <TabsTrigger value="builder">Schema Builder</TabsTrigger>
              <TabsTrigger value="importer">Import Schema</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="border border-gray-300 rounded-lg min-h-50">
              <div className="space-y-2 p-3">
                <Accordion type="single" collapsible className="w-full">
                  {fields.map((field, index) => (
                    <AccordionItem value={`item-${index}`} key={`item-${index}`}>
                      <FieldBuilder
                        key={index} // Add the key prop here
                        field={field}
                        onUpdate={(updatedField) => updateField(index, updatedField)}
                        onRemove={() => removeField(index)}
                      />
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="flex justify-end pt-4 space-x-2">
                  <Button
                    onClick={() => addField({ name: '', type: 'string', required: false })}
                    className="px-4 text-xs"
                  >
                    Add Field
                  </Button>
                  <Button onClick={() => onClose} className="px-4 text-xs">
                    Done
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="importer">
              <SchemaImporter onImport={handleImport} />
            </TabsContent>
            <TabsContent value="schema">
              {currentSchema && <JsonSchemaViewer schema={currentSchema} />}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
