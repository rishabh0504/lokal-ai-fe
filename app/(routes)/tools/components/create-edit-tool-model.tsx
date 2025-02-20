'use client'

import InfoHoverCard from '@/app/components/info-card-hover'
import { SchemaBuilder } from '@/app/components/schema-builder/schema-builder'
import { Schema, SchemaField } from '@/app/components/schema-builder/types/types'
import useFetch from '@/app/hooks/useFetch'
import { setToolConfig } from '@/app/store/slices/tool-config.reducer'
import { AppDispatch } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as z from 'zod'
import { ToolConfig } from '../dto/types'

// Define Zod Schemas for Enums
const ExecutionTypeSchema = z.enum(['REST_API', 'PYTHON_FUNCTION', 'JAVASCRIPT_FUNCTION', 'CUSTOM'])

const AuthTypeSchema = z.enum(['NONE', 'API_KEY', 'OAUTH2', 'CUSTOM'])

// Define the Zod Schema for ToolConfig
const toolConfigSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    input_schema: z
      .string()
      .min(2, { message: 'Must be a valid JSON' })
      .refine(
        (value) => {
          try {
            JSON.parse(value)
            return true
          } catch {
            return false
          }
        },
        {
          message: 'Invalid JSON',
        },
      ),
    output_schema: z
      .string()
      .min(2, { message: 'Must be a valid JSON' })
      .refine(
        (value) => {
          try {
            JSON.parse(value)
            return true
          } catch {
            return false
          }
        },
        {
          message: 'Invalid JSON',
        },
      ),
    execution_type: ExecutionTypeSchema,
    execution_details: z
      .string()
      .min(2, { message: 'Must be a valid JSON' })
      .refine(
        (value) => {
          try {
            JSON.parse(value)
            return true
          } catch {
            return false
          }
        },
        {
          message: 'Invalid JSON',
        },
      ),
    code: z.string().optional(),
    auth_type: AuthTypeSchema,
    auth_details: z.string().optional(),
    is_safe: z.boolean().default(false).optional(),
    requires_confirmation: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.auth_type !== 'NONE' && !data.auth_details) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Authentication Details are required when Auth Type is not NONE',
        path: ['auth_details'],
      })
    }
    if (data.execution_type === 'CUSTOM' && !data.execution_details) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Execution details is required for custom execution type',
        path: ['execution_details'],
      })
    }
  })
  .refine(
    (data) => {
      return !(
        (data.execution_type === 'JAVASCRIPT_FUNCTION' ||
          data.execution_type === 'PYTHON_FUNCTION') &&
        !data.code
      )
    },
    {
      message: 'Source code is required when Execution Type is Javascript or Python',
      path: ['code'],
    },
  )

type ToolConfigValues = z.infer<typeof toolConfigSchema>

interface ToolConfigModalProps {
  open: boolean
  onClose: () => void
  toolConfigId?: string
}

export function ToolConfigModal({ open, onClose, toolConfigId }: ToolConfigModalProps) {
  const [inputSchemaFields, setInputSchemaFields] = useState<SchemaField[]>([])
  const [outputSchemaFields, setOutputSchemaFields] = useState<SchemaField[]>([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false)
  const [isInputSchemaBuilderOpen, setIsInputSchemaBuilderOpen] = useState<boolean>(false)
  const [isOutputSchemaBuilderOpen, setIsOutputSchemaBuilderOpen] = useState<boolean>(false)

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.toolConfig.root}`
  const toolConfigUrl = toolConfigId ? `${baseUrl}/${toolConfigId}` : baseUrl

  const { loading, get, post, put } = useFetch<ToolConfig>(baseUrl)

  const dispatch = useDispatch<AppDispatch>()

  const form = useForm<ToolConfigValues>({
    resolver: zodResolver(toolConfigSchema),
    defaultValues: {
      name: '',
      description: '',
      input_schema: '{}',
      output_schema: '{}',
      execution_details: '{}',
      code: '',
      auth_type: 'NONE',
      auth_details: '{}',
      is_safe: false,
      requires_confirmation: false,
    },
    mode: 'onChange',
  })

  const { setValue, watch } = form

  useEffect(() => {
    const fetchToolConfig = async () => {
      if (toolConfigId) {
        try {
          const fetchedToolConfig = await get(toolConfigUrl)
          if (fetchedToolConfig) {
            Object.keys(fetchedToolConfig).forEach((key: string) => {
              setValue(
                key as keyof ToolConfigValues,
                fetchedToolConfig[key as keyof ToolConfigValues],
              )
            })
            try {
              setInputSchemaFields(JSON.parse(fetchedToolConfig.input_schema))
            } catch (e) {
              console.error('Error parsing input schema', e)
            }

            try {
              setOutputSchemaFields(JSON.parse(fetchedToolConfig.output_schema))
            } catch (e) {
              console.error('Error parsing output schema', e)
            }
            setIsUpdate(true)
            setInitialValuesLoaded(true)
          } else {
            console.error('Failed to fetch tool config for update.')
          }
        } catch (error) {
          console.error('Failed to fetch tool config for update.', error)
        }
      } else {
        setInitialValuesLoaded(true)
      }
    }
    fetchToolConfig()
  }, [toolConfigId, get, setValue, toolConfigUrl])

  const handleInputSchemaChange = useCallback(
    (schema: Schema, fields: SchemaField[]) => {
      setValue('input_schema', JSON.stringify(schema, null, 2))
      setInputSchemaFields(fields)
    },
    [setValue],
  )

  const handleOutputSchemaChange = useCallback(
    (schema: Schema, fields: SchemaField[]) => {
      setValue('output_schema', JSON.stringify(schema, null, 2))
      setOutputSchemaFields(fields)
    },
    [setValue],
  )

  const getToolsConfigList = async () => {
    const toolsConfigList = await get(baseUrl)
    if (toolsConfigList && Array.isArray(toolsConfigList)) {
      dispatch(setToolConfig(toolsConfigList))
    }
  }

  const onSubmit = async (values: ToolConfigValues) => {
    try {
      const apiCall = isUpdate ? put : post
      const requestUrl = isUpdate ? toolConfigUrl : baseUrl
      const response = await apiCall<ToolConfigValues>(values, requestUrl)
      if (response) {
        toast({
          title: 'Success!',
          description: `Tool configuration ${isUpdate ? 'updated' : 'saved'} successfully.`,
        })
        getToolsConfigList()
        onClose()
      } else {
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: 'Failed to save tool configuration.',
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error saving tool configuration:', error)
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: error?.message || 'Failed to save tool configuration.',
      })
      onClose()
    }
  }

  const isLoading = loading || !initialValuesLoaded
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {toolConfigId ? 'Update Tool Configuration' : 'Create Tool Configuration'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {toolConfigId
              ? 'Modify the Tool configuration as you need.'
              : 'Add a new Tool configuration to your application.'}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />
        <ScrollArea className="flex-1 rounded-md border h-[70vh] w-full">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name and Description - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tool Name"
                            {...field}
                            disabled={isLoading}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tool description"
                            className="resize-none bg-background border-input text-foreground shadow-sm"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Input and Output Schemas below Is Safe and Requires Confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="input_schema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right flex items-center">
                          Input Schema (JSON)
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            onClick={() => setIsInputSchemaBuilderOpen(true)}
                            disabled={isLoading}
                          >
                            Build Schema
                          </Button>
                          <InfoHoverCard content="Click to build schema" />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='e.g., {"type": "object", "properties": { "input": { "type": "string" } }, "required": ["input"]}'
                            className="resize-none bg-background border-input text-foreground shadow-sm font-mono text-sm h-[100px]"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isInputSchemaBuilderOpen && (
                    <SchemaBuilder
                      open={isInputSchemaBuilderOpen}
                      onClose={() => {
                        setIsInputSchemaBuilderOpen(false)
                      }}
                      onSchemaChange={handleInputSchemaChange}
                      initialFields={inputSchemaFields}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="output_schema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right flex items-center">
                          Output Schema (JSON)
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="ml-2"
                            onClick={() => setIsOutputSchemaBuilderOpen(true)}
                            disabled={isLoading}
                          >
                            Build Schema
                          </Button>
                          <InfoHoverCard content="Click to build schema" />
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='e.g., {"type": "object", "properties": { "output": { "type": "string" } }, "required": ["output"]}'
                            className="resize-none bg-background border-input text-foreground shadow-sm font-mono text-sm h-[100px]"
                            {...field}
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {isOutputSchemaBuilderOpen && (
                    <SchemaBuilder
                      open={isOutputSchemaBuilderOpen}
                      onClose={() => {
                        setIsOutputSchemaBuilderOpen(false)
                      }}
                      onSchemaChange={handleOutputSchemaChange}
                      initialFields={outputSchemaFields}
                    />
                  )}
                </div>

                {/* is_safe and requires_confirmation - Row 2 (New Position) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="is_safe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Is Safe</FormLabel>
                          <FormDescription>
                            Indicates if the tool is safe to execute without user confirmation.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requires_confirmation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Requires Confirmation</FormLabel>
                          <FormDescription>
                            Requests user confirmation before executing the tool.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* The Rest of the Components */}
                {/* Execution Type, Auth Type in the same grid*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="execution_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Execution Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background border-input text-foreground shadow-sm">
                              <SelectValue placeholder="Select Execution Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="REST_API">REST API</SelectItem>
                            <SelectItem value="PYTHON_FUNCTION">Python Function</SelectItem>
                            <SelectItem value="JAVASCRIPT_FUNCTION">JavaScript Function</SelectItem>
                            <SelectItem value="CUSTOM">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="auth_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Authentication Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background border-input text-foreground shadow-sm">
                              <SelectValue placeholder="Select Authentication Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NONE">None</SelectItem>
                            <SelectItem value="API_KEY">API Key</SelectItem>
                            <SelectItem value="OAUTH2">OAuth2</SelectItem>
                            <SelectItem value="CUSTOM">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="execution_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right">Execution Details (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., { url: 'https://api.example.com', method: 'GET' }"
                          className="resize-none bg-background border-input text-foreground shadow-sm font-mono text-sm"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* auth details based on authentication and and sourcecode based on the selection execution*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">Source Code</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tool's Source code"
                              className="resize-none bg-background border-input text-foreground shadow-sm font-mono text-sm h-[100px]"
                              {...field}
                              disabled={
                                !(
                                  watch('execution_type') === 'JAVASCRIPT_FUNCTION' ||
                                  watch('execution_type') === 'PYTHON_FUNCTION'
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  }

                  {
                    <FormField
                      control={form.control}
                      name="auth_details"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">
                            Authentication Details (JSON)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., { api_key: 'YOUR_API_KEY' }"
                              className="resize-none bg-background border-input text-foreground shadow-sm font-mono text-sm h-[100px] "
                              {...field}
                              disabled={!(watch('auth_type') !== 'NONE')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  }
                </div>

                <div className="flex justify-end space-x-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isLoading}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : isUpdate ? 'Update Tool' : 'Create Tool'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
