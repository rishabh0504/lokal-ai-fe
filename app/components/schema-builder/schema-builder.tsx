'use client'

import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { AccordionItem } from '@radix-ui/react-accordion'
import { useState } from 'react'
import { FieldBuilder } from './field-builder'
import { JSONOutput } from './json-output'
import { SchemaImporter } from './schema-importer'
import { SchemaField } from './types/types'
import { generateSchema } from './utils/utils'

export function SchemaBuilder() {
  const [fields, setFields] = useState<SchemaField[]>([])
  const { toast } = useToast()
  const [open, setOpen] = useState(false)

  const addField = (field: SchemaField) => {
    setFields([...fields, field])
    toast({
      title: 'Field Added',
      description: `New field "${field.name}" of type ${field.type} has been added.`,
    })
  }

  const updateField = (index: number, updatedField: SchemaField) => {
    const newFields = [...fields]
    newFields[index] = updatedField
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const fieldName = fields[index].name
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
    toast({
      title: 'Field Removed',
      description: `Field "${fieldName}" has been removed.`,
      variant: 'destructive',
    })
  }

  const handleImport = (importedFields: SchemaField[]) => {
    setFields(importedFields)
    toast({
      title: 'Schema Imported',
      description: 'The schema has been successfully imported and loaded.',
    })
  }

  const schema = generateSchema(fields)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open Schema Builder</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[75%] lg:max-w-[60%] xl:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>Schema Builder</DialogTitle>
          <DialogDescription>Create and manage your JSON schema here.</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="builder">
          <TabsList>
            <TabsTrigger value="builder">Schema Builder</TabsTrigger>
            <TabsTrigger value="importer">Import Schema</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
          </TabsList>
          <TabsContent value="builder" className="border border-gray-300 rounded-lg min-h-50">
            <div className="space-y-2 p-3">
              <ScrollArea className="h-[400px] p-4">
                <Accordion type="single" collapsible className="w-full">
                  {fields.map((field, index) => (
                    <AccordionItem value={`item-${index}`} key={`item-${index}`}>
                      <FieldBuilder
                        field={field}
                        onUpdate={(updatedField) => updateField(index, updatedField)}
                        onRemove={() => removeField(index)}
                      />
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>

              <div className="space-y-2 p-3 flex justify-end">
                <Button
                  onClick={() => addField({ name: '', type: 'string', required: false })}
                  className="px-4 text-xs"
                >
                  Add Field
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="importer">
            <SchemaImporter onImport={handleImport} />
          </TabsContent>
          <TabsContent value="schema">{schema && <JSONOutput schema={schema} />}</TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
