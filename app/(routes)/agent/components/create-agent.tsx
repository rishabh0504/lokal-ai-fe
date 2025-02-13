'use client'

import { Agent } from '@/app/(routes)/agent/types/type'
import { LLMModel } from '@/app/(routes)/llm/types/type'
import InfoHoverCard from '@/app/components/info-card-hover'
import useFetch from '@/app/hooks/useFetch'
import { RootState } from '@/app/store/store'
import { LLM_AGENT_PARAMETERS } from '@/app/utils/common.constant'
import { API_CONFIG } from '@/app/utils/config'
import { StringKeyStringValueType } from '@/app/utils/types'
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
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as z from 'zod'

interface CreateAgentProps {
  agentId?: string
  open: boolean
  onClose: () => void
}

const getUpdatedParameters = (llmModel: Partial<LLMModel>): StringKeyStringValueType => {
  const updatedValue: StringKeyStringValueType = {}
  Object.keys(LLM_AGENT_PARAMETERS).forEach((key: string) => {
    let information: string = LLM_AGENT_PARAMETERS[key]
    information = information.replace(
      `{${key}Min}`,
      llmModel[`${key}Min` as keyof LLMModel] !== undefined
        ? String(llmModel[`${key}Min` as keyof LLMModel])
        : '',
    )
    information = information.replace(
      `{${key}Max}`,
      llmModel[`${key}Max` as keyof LLMModel] !== undefined
        ? String(llmModel[`${key}Max` as keyof LLMModel])
        : '',
    )
    information = information.replace(
      `{${key}Default}`,
      llmModel[`${key}Default` as keyof LLMModel] !== undefined
        ? String(llmModel[`${key}Default` as keyof LLMModel])
        : '',
    )
    updatedValue[key] = information
  })
  return updatedValue
}
const CreateAgent = ({ agentId, open, onClose }: CreateAgentProps) => {
  const [isUpdate, setIsUpdate] = useState(false)
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState<LLMModel | null>(null)

  const llms = useSelector((state: RootState) => state.llms.items) || []

  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.root}`
  const agentUrl = agentId ? `${baseUrl}/${agentId}` : baseUrl

  const { loading, get, post, put } = useFetch<Agent>(baseUrl)

  const formSchema = useMemo(() => {
    return z.object({
      name: z
        .string()
        .min(2, { message: 'Agent name must be at least 2 characters.' })
        .max(50, { message: 'Agent name cannot exceed 50 characters.' }),
      llmModelId: z.string().min(1, { message: 'Please select a model.' }),
      temperature: z
        .number()
        .min(selectedLLM?.temperatureMin || 0)
        .max(selectedLLM?.temperatureMax || 1),
      top_p: z
        .number()
        .min(selectedLLM?.top_pMin || 0)
        .max(selectedLLM?.top_pMax || 1),
      top_k: z
        .number()
        .min(selectedLLM?.top_kMin || 0)
        .max(selectedLLM?.top_kMax || 100),
      max_tokens: z
        .number()
        .min(selectedLLM?.max_tokensMin || 1)
        .max(selectedLLM?.max_tokensMax || 4096),
      presence_penalty: z
        .number()
        .min(selectedLLM?.presence_penaltyMin || -2)
        .max(selectedLLM?.presence_penaltyMax || 2),
      frequency_penalty: z
        .number()
        .min(selectedLLM?.frequency_penaltyMin || -2)
        .max(selectedLLM?.frequency_penaltyMax || 2),
      repeat_penalty: z
        .number()
        .min(selectedLLM?.repeat_penaltyMin || 1)
        .max(selectedLLM?.repeat_penaltyMax || 2),
      description: z
        .string()
        .min(10, { message: 'Desciption must be 10 characters' })
        .max(100, { message: 'Description cannot exceed 100 characters.' }),

      prompt: z
        .string()
        .min(100, { message: 'System Prompt must be 100 characters' })
        .max(200, { message: 'System Prompt cannot exceed 200 characters.' }),
    })
  }, [selectedLLM])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      llmModelId: '',
      description: '',
      temperature: 0,
      top_p: 0,
      top_k: 0,
      max_tokens: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
      repeat_penalty: 0,
      prompt: '',
    },
    mode: 'onChange',
  })

  const modelOptions = useMemo(() => {
    return llms.map((each: LLMModel) => ({ label: each.name, value: each.id }))
  }, [llms])

  useEffect(() => {
    const fetchAgent = async () => {
      if (agentId) {
        try {
          const fetchedAgent = await get(agentUrl)
          if (fetchedAgent) {
            form.setValue('name', fetchedAgent.name)
            form.setValue('llmModelId', fetchedAgent.llmModelId)
            form.setValue(
              'temperature',
              fetchedAgent.temperature !== undefined ? Number(fetchedAgent.temperature) : 0,
            )
            form.setValue(
              'top_p',
              fetchedAgent.top_p !== undefined ? Number(fetchedAgent.top_p) : 0,
            )
            form.setValue(
              'top_k',
              fetchedAgent.top_k !== undefined ? Number(fetchedAgent.top_k) : 0,
            )
            form.setValue(
              'max_tokens',
              fetchedAgent.max_tokens !== undefined ? Number(fetchedAgent.max_tokens) : 0,
            )
            form.setValue(
              'presence_penalty',
              fetchedAgent.presence_penalty !== undefined
                ? Number(fetchedAgent.presence_penalty)
                : 0,
            )
            form.setValue(
              'frequency_penalty',
              fetchedAgent.frequency_penalty !== undefined
                ? Number(fetchedAgent.frequency_penalty)
                : 0,
            )
            form.setValue(
              'repeat_penalty',
              fetchedAgent.repeat_penalty !== undefined ? Number(fetchedAgent.repeat_penalty) : 0,
            )
            form.setValue('description', fetchedAgent.description)
            form.setValue('prompt', fetchedAgent.prompt)

            setIsUpdate(true)
            setInitialValuesLoaded(true)
          } else {
            console.error('Failed to fetch agent for update.')
          }
        } catch (error) {
          console.error('Failed to fetch agent for update.', error)
        }
      } else {
        setInitialValuesLoaded(true)
      }
    }

    fetchAgent()
  }, [agentId, get, form, agentUrl])

  useEffect(() => {
    if (form.watch('llmModelId')) {
      const foundLLM = llms.find((llm) => llm.id === form.watch('llmModelId'))
      setSelectedLLM(foundLLM || null)
    }
  }, [llms, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const agentData: Partial<Agent> = {
        name: values.name,
        llmModelId: values.llmModelId,
        temperature: values.temperature,
        top_p: values.top_p,
        top_k: values.top_k,
        max_tokens: values.max_tokens,
        presence_penalty: values.presence_penalty,
        frequency_penalty: values.frequency_penalty,
        repeat_penalty: values.repeat_penalty,
        description: values.description,
        prompt: values.prompt,
      }

      const apiCall = isUpdate ? put : post
      const requestUrl = isUpdate ? agentUrl : baseUrl
      const response = await apiCall<Partial<Agent>>(agentData, requestUrl)

      if (!response) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} agent.`)
      }

      toast({
        title: `Agent ${isUpdate ? 'Updated' : 'Created'}`,
        description: `Agent ${isUpdate ? 'updated' : 'created'} successfully!`,
      })
      onClose()
    } catch (error: unknown) {
      let errorMessage = `Failed to ${isUpdate ? 'update' : 'create'} agent. Please try again.`
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

  const { setValue, watch } = form
  const llmModelId = watch('llmModelId')
  useEffect(() => {
    if (llmModelId) {
      const foundLLMModel = llms.find((llm) => llm.id === llmModelId)
      if (foundLLMModel) {
        setValue('temperature', foundLLMModel.temperatureDefault)
        setValue('top_p', foundLLMModel.top_pDefault)
        setValue('top_k', foundLLMModel.top_kDefault)
        setValue('max_tokens', foundLLMModel.max_tokensDefault)
        setValue('presence_penalty', foundLLMModel.presence_penaltyDefault)
        setValue('frequency_penalty', foundLLMModel.frequency_penaltyDefault)
        setValue('repeat_penalty', foundLLMModel.repeat_penaltyDefault)
        setValue('description', foundLLMModel.description)
        setValue('prompt', foundLLMModel.defaultPrompt)
      }
    }
  }, [llmModelId, setValue])

  const foundLLMModel: Partial<LLMModel> = llms.find((llm) => llm.id === llmModelId) || {}

  const UPDATED_LLM_AGENT_PARAMETERS: StringKeyStringValueType = getUpdatedParameters(foundLLMModel)
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>{agentId ? 'Update Agent' : 'Create Agent'}</DialogTitle>
          <DialogDescription>
            {agentId ? 'Modify the agent as you need.' : 'Add a new agent to your application.'}
          </DialogDescription>
        </DialogHeader>
        <Separator className="my-2" />

        <ScrollArea className="h-[70vh] w-full p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agent Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Agent Name"
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
                  name="llmModelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      {initialValuesLoaded ? (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                          }}
                          defaultValue={field.value}
                          disabled={isUpdate || loading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {modelOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div>Loading...</div>
                      )}
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
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>System Prompt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a system Prompt"
                          className="resize-none"
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
              <h3 className="text-lg font-semibold">LLM Parameters</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Temperature
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['temperature']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Temperature"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.temperatureMin} - {selectedLLM.temperatureMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="top_p"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Top P
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['top_p']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Top P"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.top_pMin} - {selectedLLM.top_pMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="top_k"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Top K
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['top_k']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Top K"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.top_kMin} - {selectedLLM.top_kMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Max Tokens
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['max_tokens']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Max Tokens"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.max_tokensMin} - {selectedLLM.max_tokensMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="presence_penalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Presence Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['presence_penalty']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Presence Penalty"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.presence_penaltyMin} -{' '}
                          {selectedLLM.presence_penaltyMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frequency_penalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Frequency Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['frequency_penalty']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Frequency Penalty"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.frequency_penaltyMin} -{' '}
                          {selectedLLM.frequency_penaltyMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="repeat_penalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex">
                          Repeat Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['repeat_penalty']
                              }
                            />
                          )}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Repeat Penalty"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value)
                            field.onChange(isNaN(value) ? null : value)
                          }}
                          value={field.value === null ? '' : field.value}
                          disabled={loading || !initialValuesLoaded}
                        />
                      </FormControl>
                      <FormMessage />
                      {selectedLLM && (
                        <p className="text-sm text-muted-foreground">
                          Range: {selectedLLM.repeat_penaltyMin} - {selectedLLM.repeat_penaltyMax}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-row-reverse">
                <Button type="submit" disabled={loading || !initialValuesLoaded}>
                  {loading || !initialValuesLoaded
                    ? 'Saving...'
                    : isUpdate
                      ? 'Update Agent'
                      : 'Create Agent'}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAgent
