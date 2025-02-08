'use client'

import { LLMModel } from '@/app/(routes)/llm/types/type'
import useFetch from '@/app/hooks/useFetch'
import { fetchLLMs } from '@/app/store/slices/llm.reducer'
import { AppDispatch } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import * as z from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name cannot exceed 50 characters.' }),
  modelName: z
    .string()
    .min(2, { message: 'Model Name must be at least 2 characters.' })
    .max(50, { message: 'Model Name cannot exceed 50 characters.' }),
  version: z.string(),
  description: z
    .string()
    .min(10, { message: 'Desciption must be 10 characters' })
    .max(50, { message: 'Description cannot exceed 50 characters.' }),

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

  stop_sequences: z.string(),
  defaultPrompt: z
    .string()
    .min(100, { message: 'Default prompt must be 100 characters' })
    .max(200, { message: 'Default prompt cannot exceed 200 characters.' }),
})

interface CreateLLMModelProps {
  llmModelId?: string
  open: boolean
  onClose: () => void
}

const CreateLLMModel = ({ llmModelId, open, onClose }: CreateLLMModelProps) => {
  const [isUpdate, setIsUpdate] = useState(false)
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.get}`
  const llmModelUrl = llmModelId ? `${baseUrl}/${llmModelId}` : baseUrl

  const { loading, get, post, put } = useFetch<LLMModel>(baseUrl)

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
      stop_sequences: '',
      defaultPrompt: '',
    },
    mode: 'onChange',
  })

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
              fetchedLLMModel.stop_sequences
                ? JSON.stringify(fetchedLLMModel.stop_sequences)
                : '[]',
            )

            setIsUpdate(true)
            setInitialValuesLoaded(true)
          } else {
            console.error('Failed to fetch LLMModel for update.')
          }
        } catch (e) {
          console.error('Failed to fetch LLMModel for update.', e)
        }
      } else {
        setInitialValuesLoaded(true)
      }
    }

    fetchLLMModel()
  }, [llmModelId, get, form, llmModelUrl])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let stopSequencesArray: string[] | undefined

      if (values.stop_sequences) {
        try {
          stopSequencesArray = JSON.parse(values.stop_sequences) as string[]
          if (
            !Array.isArray(stopSequencesArray) ||
            !stopSequencesArray.every((item) => typeof item === 'string')
          ) {
            throw new Error('stop_sequences must be a JSON array of strings.')
          }
        } catch (e) {
          console.error('Failed to parse stop_sequences JSON: ', e)
          throw new Error(
            'Invalid JSON format for stop_sequences. Please use a JSON array of strings.',
          )
        }
      }
      const llmModelData: Partial<LLMModel> = {
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
        stop_sequences: stopSequencesArray,
        defaultPrompt: values.defaultPrompt,
      }

      const apiCall = isUpdate ? put : post
      const requestUrl = isUpdate ? llmModelUrl : baseUrl
      const response = await apiCall<Partial<LLMModel>>(llmModelData, requestUrl)

      if (!response) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} LLM Model.`)
      }

      toast({
        title: `LLM Model ${isUpdate ? 'Updated' : 'Created'}`,
        description: `LLM Model ${isUpdate ? 'updated' : 'created'} successfully!`,
      })

      dispatch(fetchLLMs())
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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{llmModelId ? 'Update LLM Model' : 'Create LLM Model'}</DialogTitle>
          <DialogDescription>
            {llmModelId
              ? 'Modify the LLM Model as you need.'
              : 'Add a new LLM Model to your application.'}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />

        <ScrollArea className="h-[60vh] w-full m-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LLM Model Name"
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
                  name="modelName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ollama Model Name"
                          {...field}
                          disabled={isUpdate || loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="version"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Version</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LLM Model Version"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a short description"
                          className="resize-none"
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
                      <FormLabel>Default System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a short description"
                          className="resize-none w-full"
                          {...field}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-2" />
              <h3 className="text-lg font-semibold">Parameters</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="temperatureMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Temperature Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Temperature Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="top_pMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top P Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Top P Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Top P Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="top_kMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top K Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Top K Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Top K Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="max_tokensMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Max Tokens Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Max Tokens Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseInt(e.target.value, 10)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="presence_penaltyMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presence Penalty Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Presence Penalty Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Presence Penalty Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="frequency_penaltyMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency Penalty Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Frequency Penalty Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Frequency Penalty Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="repeat_penaltyMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Penalty Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Repeat Penalty Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
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
                      <FormLabel>Repeat Penalty Default</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Default"
                          value={
                            field.value === null || field.value === undefined
                              ? ''
                              : field.value.toString()
                          }
                          onChange={(e) => {
                            const parsedValue = parseFloat(e.target.value)
                            field.onChange(isNaN(parsedValue) ? 0 : parsedValue)
                          }}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="stop_sequences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Sequences (JSON Array of Strings)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='JSON Array of strings, example: ["\\n\\n", "."]'
                        {...field}
                        disabled={loading || !initialValuesLoaded}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row-reverse mx-2">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLLMModel
