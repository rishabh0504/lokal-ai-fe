'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import type React from 'react'
import { FieldType, SchemaField } from './types/types'

import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion'

interface FieldBuilderProps {
  field: SchemaField
  onUpdate: (field: SchemaField) => void
  onRemove: () => void
}

export function FieldBuilder({ field, onUpdate, onRemove }: FieldBuilderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ ...field, [e.target.name]: e.target.value })
  }

  const handleTypeChange = (value: FieldType) => {
    onUpdate({
      ...field,
      type: value,
      children: value === 'object' || value === 'array' ? [] : undefined,
    })
  }

  const handleRequiredChange = (checked: boolean) => {
    onUpdate({ ...field, required: checked })
  }

  const addChild = () => {
    onUpdate({
      ...field,
      children: [...(field.children || []), { name: '', type: 'string', required: false }],
    })
  }

  return (
    <div className="bg-gray-100 rounded-md px-4 m-1">
      <AccordionTrigger className="text-sm ">{field.name || 'New Field'}</AccordionTrigger>
      <AccordionContent className="">
        <div className="space-y-4 border p-4 rounded-md ">
          <div className="flex space-x-4 ">
            <div className="flex-1">
              <Label htmlFor="name">Field Name</Label>
              <Input id="name" name="name" value={field.name} onChange={handleChange} />
            </div>
            <div className="flex-1">
              <Label htmlFor="type">Field Type</Label>
              <Select onValueChange={handleTypeChange} value={field.type}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="object">Object</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex ">
              <div className="flex items-center  space-y-5">
                <Label htmlFor="required" className="mt-5">
                  Required
                </Label>
                <Switch
                  id="required"
                  checked={field.required}
                  onCheckedChange={handleRequiredChange}
                  className="mt-4"
                />
              </div>

              <div className="flex items-center justify-center   w-full">
                <Button variant="destructive" size="sm" onClick={onRemove}>
                  X
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={field.description || ''}
              onChange={handleChange}
              placeholder="Enter field description"
            />
          </div>

          {field.type === 'string' && (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="minLength">Min Length</Label>
                  <Input
                    id="minLength"
                    name="minLength"
                    type="number"
                    value={field.minLength || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="maxLength">Max Length</Label>
                  <Input
                    id="maxLength"
                    name="maxLength"
                    type="number"
                    value={field.maxLength || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="pattern">Pattern</Label>
                <Input
                  id="pattern"
                  name="pattern"
                  value={field.pattern || ''}
                  onChange={handleChange}
                  placeholder="Enter regex pattern"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="format">Format</Label>
                <Select
                  onValueChange={(value) => onUpdate({ ...field, format: value })}
                  value={field.format}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-time">Date-Time</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="hostname">Hostname</SelectItem>
                    <SelectItem value="ipv4">IPv4</SelectItem>
                    <SelectItem value="ipv6">IPv6</SelectItem>
                    <SelectItem value="uri">URI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {field.type === 'number' && (
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="minimum">Minimum</Label>
                <Input
                  id="minimum"
                  name="minimum"
                  type="number"
                  value={field.minimum || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="maximum">Maximum</Label>
                <Input
                  id="maximum"
                  name="maximum"
                  type="number"
                  value={field.maximum || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {(field.type === 'number' || field.type === 'string') && (
            <div className="flex-1">
              <Label htmlFor="default">Default Value</Label>
              <Input
                id="default"
                name="default"
                value={field.default || ''}
                onChange={handleChange}
                placeholder="Enter default value"
              />
            </div>
          )}
          {field.type === 'array' && (
            <div className="flex items-center space-x-2">
              <Switch
                id="uniqueItems"
                checked={field.uniqueItems || false}
                onCheckedChange={(checked) => onUpdate({ ...field, uniqueItems: checked })}
              />
              <Label htmlFor="uniqueItems">Unique Items</Label>
            </div>
          )}

          {(field.type === 'object' || field.type === 'array') && (
            <div>
              <div className="space-y-2 p-3 flex justify-end">
                <Button onClick={addChild}>Add Child Field</Button>
              </div>
              <div className="ml-4 mt-2">
                {field.children?.map((child, index) => (
                  <>
                    <FieldBuilder
                      field={child}
                      onUpdate={(updatedChild) => {
                        const newChildren = [...(field.children || [])]
                        newChildren[index] = updatedChild
                        onUpdate({ ...field, children: newChildren })
                      }}
                      onRemove={() => {
                        const newChildren = field.children?.filter((_, i) => i !== index)
                        onUpdate({ ...field, children: newChildren })
                      }}
                    />
                  </>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </div>
  )
}
