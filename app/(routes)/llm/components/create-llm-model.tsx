'use client'

import { LLMModelConfig, OllamaModelResponse } from '@/app/(routes)/llm/types/type'
import useFetch from '@/app/hooks/useFetch'
import { RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as z from 'zod'
import JsonEditorModal from './json-editor-modal'
import { StopSequenceMultiSelect } from './stop_sequence_component'

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  modelName: z.string({
    required_error: 'Please select a ollama model.',
  }),
  version: z.string(),
  description: z
    .string()
    .min(10, { message: 'Desciption must be 10 characters' })
    .max(1000, { message: 'Description cannot exceed 1000 characters.' }),

  temperatureMin: z.number(),
  temperatureMax: z.number(),
  temperatureDefault: z.number(),

  top_pMin: z.number(),
  top_pMax: z.number(),
  top_pDefault: z.number(),

  top_kMin: z.number(),
  top_kMax: z.number(),
  top_kDefault: z.number(),

  max_tokensMin: z.number(),
  max_tokensMax: z.number(),
  max_tokensDefault: z.number(),

  presence_penaltyMin: z.number(),
  presence_penaltyMax: z.number(),
  presence_penaltyDefault: z.number(),

  frequency_penaltyMin: z.number(),
  frequency_penaltyMax: z.number(),
  frequency_penaltyDefault: z.number(),

  repeat_penaltyMin: z.number(),
  repeat_penaltyMax: z.number(),
  repeat_penaltyDefault: z.number(),

  stop_sequences: z.array(z.string()).optional(),
  defaultPrompt: z
    .string()
    .min(100, { message: 'System Prompt must be 100 characters' })
    .max(1000, { message: 'System Prompt cannot exceed 1000 characters.' }),
})

interface CreateLLMModelProps {
  llmModelId?: string
  open: boolean
  onClose: () => void
}

const CreateLLMModel = ({ llmModelId, open, onClose }: CreateLLMModelProps) => {
  const [isUpdate, setIsUpdate] = useState(false)
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false)

  const [loadModel, setLoadModel] = useState<boolean>(false)
  const ollamaModels: OllamaModelResponse[] =
    useSelector((state: RootState) => state.ollamaModels.items) || []

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.root}`
  const llmModelUrl = llmModelId ? `${baseUrl}/${llmModelId}` : baseUrl

  const { loading, get, post, put } = useFetch<LLMModelConfig>(baseUrl)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      modelName: '',
      version: '',
      description: '',
      temperatureMin: 0,
      temperatureMax: 0,
      temperatureDefault: 0,
      top_pMin: 0,
      top_pMax: 0,
      top_pDefault: 0,
      top_kMin: 0,
      top_kMax: 0,
      top_kDefault: 0,
      max_tokensMin: 0,
      max_tokensMax: 0,
      max_tokensDefault: 0,
      presence_penaltyMin: 0,
      presence_penaltyMax: 0,
      presence_penaltyDefault: 0,
      frequency_penaltyMin: 0,
      frequency_penaltyMax: 0,
      frequency_penaltyDefault: 0,
      repeat_penaltyMin: 0,
      repeat_penaltyMax: 0,
      repeat_penaltyDefault: 0,
      stop_sequences: [],
      defaultPrompt: '',
    },
    mode: 'onChange',
  })

  const { watch } = form
  useEffect(() => {
    const fetchLLMModel = async () => {
      if (llmModelId) {
        try {
          const fetchedLLMModel = await get(llmModelUrl)

          if (fetchedLLMModel) {
            form.setValue('name', fetchedLLMModel.name)
            form.setValue('modelName', fetchedLLMModel.modelName)
            form.setValue('version', fetchedLLMModel.version)
            form.setValue('description', fetchedLLMModel.description)

            form.setValue('temperatureMin', fetchedLLMModel.temperatureMin)
            form.setValue('temperatureMax', fetchedLLMModel.temperatureMax)
            form.setValue('temperatureDefault', fetchedLLMModel.temperatureDefault)

            form.setValue('top_pMin', fetchedLLMModel.top_pMin)
            form.setValue('top_pMax', fetchedLLMModel.top_pMax)
            form.setValue('top_pDefault', fetchedLLMModel.top_pDefault)

            form.setValue('top_kMin', fetchedLLMModel.top_kMin)
            form.setValue('top_kMax', fetchedLLMModel.top_kMax)
            form.setValue('top_kDefault', fetchedLLMModel.top_kDefault)

            form.setValue('max_tokensMin', fetchedLLMModel.max_tokensMin)
            form.setValue('max_tokensMax', fetchedLLMModel.max_tokensMax)
            form.setValue('max_tokensDefault', fetchedLLMModel.max_tokensDefault)

            form.setValue('presence_penaltyMin', fetchedLLMModel.presence_penaltyMin)
            form.setValue('presence_penaltyMax', fetchedLLMModel.presence_penaltyMax)
            form.setValue('presence_penaltyDefault', fetchedLLMModel.presence_penaltyDefault)

            form.setValue('frequency_penaltyMin', fetchedLLMModel.frequency_penaltyMin)
            form.setValue('frequency_penaltyMax', fetchedLLMModel.frequency_penaltyMax)
            form.setValue('frequency_penaltyDefault', fetchedLLMModel.frequency_penaltyDefault)

            form.setValue('repeat_penaltyMin', fetchedLLMModel.repeat_penaltyMin)
            form.setValue('repeat_penaltyMax', fetchedLLMModel.repeat_penaltyMax)
            form.setValue('repeat_penaltyDefault', fetchedLLMModel.repeat_penaltyDefault)
            form.setValue('defaultPrompt', fetchedLLMModel.defaultPrompt)

            form.setValue(
              'stop_sequences',
              fetchedLLMModel.stop_sequences ? fetchedLLMModel.stop_sequences : [],
            )

            setIsUpdate(true)
            setInitialValuesLoaded(true)
          } else {
            console.error('Failed to fetch LLMModelConfig for update.')
          }
        } catch (e) {
          console.error('Failed to fetch LLMModelConfig for update.', e)
        }
      } else {
        setInitialValuesLoaded(true)
      }
    }

    fetchLLMModel()
  }, [llmModelId, get, form, llmModelUrl])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const llmModelData: any = {
        name: values.name,
        modelName: values.modelName,
        version: values.version,
        description: values.description,
        temperatureMin: values.temperatureMin,
        temperatureMax: values.temperatureMax,
        temperatureDefault: values.temperatureDefault,
        top_pMin: values.top_pMin,
        top_pMax: values.top_pMax,
        top_pDefault: values.top_pDefault,
        top_kMin: values.top_kMin,
        top_kMax: values.top_kMax,
        top_kDefault: values.top_kDefault,
        max_tokensMin: values.max_tokensMin,
        max_tokensMax: values.max_tokensMax,
        max_tokensDefault: values.max_tokensDefault,
        presence_penaltyMin: values.presence_penaltyMin,
        presence_penaltyMax: values.presence_penaltyMax,
        presence_penaltyDefault: values.presence_penaltyDefault,
        frequency_penaltyMin: values.frequency_penaltyMin,
        frequency_penaltyMax: values.frequency_penaltyMax,
        frequency_penaltyDefault: values.frequency_penaltyDefault,
        repeat_penaltyMin: values.repeat_penaltyMin,
        repeat_penaltyMax: values.repeat_penaltyMax,
        repeat_penaltyDefault: values.repeat_penaltyDefault,
        stop_sequences: values?.stop_sequences ? JSON.stringify(values.stop_sequences) : '',
        defaultPrompt: values.defaultPrompt,
      }

      const apiCall = isUpdate ? put : post
      const requestUrl = isUpdate ? llmModelUrl : baseUrl
      const response = await apiCall<Partial<LLMModelConfig>>(llmModelData, requestUrl)

      if (!response) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} LLM Model.`)
      }

      toast({
        title: `LLM Model ${isUpdate ? 'Updated' : 'Created'}`,
        description: `LLM Model ${isUpdate ? 'updated' : 'created'} successfully!`,
      })

      onClose()
    } catch (error: unknown) {
      let errorMessage = `Failed to ${isUpdate ? 'update' : 'create'} LLM Model. Please try again.`

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred:', error)
        errorMessage = 'An unexpected error occurred. Please check the console for details.'
      }

      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      })
      onClose()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLoadingModel = (loadConfig: any) => {
    if (loadConfig) {
      // loadConfig = JSON.parse(loadConfig)
      form.setValue('name', loadConfig.name)
      form.setValue('modelName', loadConfig.modelName)
      form.setValue('version', loadConfig.version)
      form.setValue('description', loadConfig.description)

      form.setValue('temperatureMin', loadConfig.temperatureMin)
      form.setValue('temperatureMax', loadConfig.temperatureMax)
      form.setValue('temperatureDefault', loadConfig.temperatureDefault)

      form.setValue('top_pMin', loadConfig.top_pMin)
      form.setValue('top_pMax', loadConfig.top_pMax)
      form.setValue('top_pDefault', loadConfig.top_pDefault)

      form.setValue('top_kMin', loadConfig.top_kMin)
      form.setValue('top_kMax', loadConfig.top_kMax)
      form.setValue('top_kDefault', loadConfig.top_kDefault)

      form.setValue('max_tokensMin', loadConfig.max_tokensMin)
      form.setValue('max_tokensMax', loadConfig.max_tokensMax)
      form.setValue('max_tokensDefault', loadConfig.max_tokensDefault)

      form.setValue('presence_penaltyMin', loadConfig.presence_penaltyMin)
      form.setValue('presence_penaltyMax', loadConfig.presence_penaltyMax)
      form.setValue('presence_penaltyDefault', loadConfig.presence_penaltyDefault)

      form.setValue('frequency_penaltyMin', loadConfig.frequency_penaltyMin)
      form.setValue('frequency_penaltyMax', loadConfig.frequency_penaltyMax)
      form.setValue('frequency_penaltyDefault', loadConfig.frequency_penaltyDefault)

      form.setValue('repeat_penaltyMin', loadConfig.repeat_penaltyMin)
      form.setValue('repeat_penaltyMax', loadConfig.repeat_penaltyMax)
      form.setValue('repeat_penaltyDefault', loadConfig.repeat_penaltyDefault)
      form.setValue('defaultPrompt', loadConfig.defaultPrompt)
      form.setValue('stop_sequences', loadConfig.stop_sequences ? loadConfig.stop_sequences : [])
    }
  }

  const selectedStopSequences = form.watch('stop_sequences') || []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {llmModelId ? 'Update LLM Model' : 'Create LLM Model'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {llmModelId
              ? 'Modify the LLM Model as you need.'
              : 'Add a new LLM Model to your application.'}
          </DialogDescription>
          <DialogDescription className="text-sm text-muted-foreground flex items-center justify-between px-10">
            <span>(Make sure the parameters are as per the model selected)</span>
            <Button
              variant={'secondary'}
              disabled={!watch('modelName')}
              className="bg-gray-300 hover:bg-gray-100"
              onClick={() => {
                setLoadModel(true)
              }}
            >
              Load Config
            </Button>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] w-full">
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LLM Model Name"
                            {...field}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Model Name</FormLabel>
                        <Select
                          disabled={isUpdate || loading || !initialValuesLoaded}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background border-input text-foreground shadow-sm">
                              <SelectValue placeholder="Select ollama Model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ollamaModels.map((model) => (
                              <SelectItem key={model.name} value={model.name}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Version</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="LLM Model Version"
                            {...field}
                            disabled={loading || !initialValuesLoaded}
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
                            placeholder="Provide a short description"
                            className="resize-none bg-background border-input text-foreground shadow-sm"
                            {...field}
                            disabled={loading || !initialValuesLoaded}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="defaultPrompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Default System Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a system prompt"
                            className="resize-none bg-background border-input text-foreground shadow-sm"
                            {...field}
                            disabled={loading || !initialValuesLoaded}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />
                <div className="space-y-2">
                  <h3 className="text-md font-semibold">Parameters</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust these parameters to fine-tune the LLM Model behavior.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="temperatureMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Temperature Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temperatureMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Temperature Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temperatureDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Temperature Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="top_pMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top P Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="top_pMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top P Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="top_pDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top P Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="top_kMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top K Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="top_kMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top K Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="top_kDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Top K Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="max_tokensMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Max Tokens Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_tokensMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Max Tokens Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_tokensDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Max Tokens Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseInt(e.target.value, 10)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="presence_penaltyMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Presence Penalty Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="presence_penaltyMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Presence Penalty Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="presence_penaltyDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Presence Penalty Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="frequency_penaltyMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Frequency Penalty Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequency_penaltyMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Frequency Penalty Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="frequency_penaltyDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Frequency Penalty Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="repeat_penaltyMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Repeat Penalty Min</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repeat_penaltyMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Repeat Penalty Max</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="repeat_penaltyDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Repeat Penalty Default</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Default"
                            value={field.value?.toString() || ''}
                            onChange={(e) => {
                              const parsedValue = parseFloat(e.target.value)
                              field.onChange(isNaN(parsedValue) ? undefined : parsedValue)
                            }}
                            disabled={loading || !initialValuesLoaded}
                            className="bg-background border-input text-foreground shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="w-full max-w-[250px]">
                    <FormField
                      control={form.control}
                      name="stop_sequences"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-right">Stop Sequences</FormLabel>
                          <FormControl>
                            <StopSequenceMultiSelect
                              value={field.value ?? []}
                              onChange={field.onChange}
                              className="max-w-[250px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full col-span-2">
                    <FormLabel>Selected Stop Sequences</FormLabel>
                    <Card className="">
                      <CardContent className="p-2">
                        {selectedStopSequences && selectedStopSequences.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedStopSequences.map((label) => (
                              <span
                                key={label}
                                className="bg-gray-200 px-2 py-1 text-xs border rounded-md"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs p-4">No stop sequences selected.</span>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading || !initialValuesLoaded}>
                    {loading || !initialValuesLoaded
                      ? 'Saving...'
                      : isUpdate
                        ? 'Update LLM Model'
                        : 'Create LLM Model'}
                  </Button>
                </div>
              </form>
            </Form>

            {loadModel && (
              <JsonEditorModal
                isOpen={loadModel}
                onClose={() => {
                  setLoadModel(false)
                }}
                onDone={handleLoadingModel}
                modelName={form.getValues('modelName')}
              />
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLLMModel
