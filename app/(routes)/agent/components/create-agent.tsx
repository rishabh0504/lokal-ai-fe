'use client'

import { Agent } from '@/app/(routes)/agent/types/type'
import { LLMModelConfig } from '@/app/(routes)/llm/types/type'
import { InfoCard } from '@/app/components/info-card'
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
import { MultiSelect } from '@/components/ui/multi-select'
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
import { ToolConfig } from '../../tools/dto/types'

interface CreateAgentProps {
  agentId?: string
  open: boolean
  onClose: () => void
}

interface Option {
  value: string
  label: string
}

const getUpdatedParameters = (llmModel: Partial<LLMModelConfig>): StringKeyStringValueType => {
  const updatedValue: StringKeyStringValueType = {}

  Object.keys(LLM_AGENT_PARAMETERS).forEach((key: string) => {
    const keyMin = `${key}Min` as keyof LLMModelConfig
    const keyMax = `${key}Max` as keyof LLMModelConfig
    const keyDefault = `${key}Default` as keyof LLMModelConfig

    let information: string = LLM_AGENT_PARAMETERS[key]

    const minValue = llmModel[keyMin]
    const maxValue = llmModel[keyMax]
    const defaultValue = llmModel[keyDefault]

    information = information.replace(`{${key}Min}`, minValue !== undefined ? String(minValue) : '')
    information = information.replace(`{${key}Max}`, maxValue !== undefined ? String(maxValue) : '')
    information = information.replace(
      `{${key}Default}`,
      defaultValue !== undefined ? String(defaultValue) : '',
    )

    updatedValue[key] = information
  })

  return updatedValue
}
const CreateAgent = ({ agentId, open, onClose }: CreateAgentProps) => {
  const [selectedTools, setSelectedFrameworks] = useState<string[]>([])
  const handleFrameworkChange = (newValues: string[]) => {
    setSelectedFrameworks(newValues)
  }
  const [isUpdate, setIsUpdate] = useState(false)
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false)
  const [selectedLLM, setSelectedLLM] = useState<LLMModelConfig | null>(null)

  const llms = useSelector((state: RootState) => state.llms.items) || []
  const tools = useSelector((state: RootState) => state.toolConfigs.items) || []

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
        .max(1000, { message: 'Description cannot exceed 1000 characters.' }),

      prompt: z
        .string()
        .min(100, { message: 'System Prompt must be 100 characters' })
        .max(1000, { message: 'System Prompt cannot exceed 1000 characters.' }),
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
    return llms.map((each: LLMModelConfig) => ({ label: each.name, value: each.id }))
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
        toolIds: selectedTools,
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
        if (!agentId) {
          setValue('prompt', foundLLMModel.defaultPrompt)
        }
      }
    }
  }, [llmModelId, setValue, llms])

  const foundLLMModel: Partial<LLMModelConfig> = llms.find((llm) => llm.id === llmModelId) || {}

  const UPDATED_LLM_AGENT_PARAMETERS: StringKeyStringValueType = getUpdatedParameters(foundLLMModel)

  const toolOptions =
    tools.map((each: ToolConfig) => ({ label: each?.name || '', value: each?.id || '' })) || []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[950px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {agentId ? 'Update Agent' : 'Create Agent'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {agentId ? 'Modify the agent as you need.' : 'Add a new agent to your application.'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[70vh] w-full">
          <h1 className="text-2xl font-semibold mb-4">Framework Selection</h1>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Agent Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Agent Name"
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
                    name="llmModelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Model</FormLabel>
                        {initialValuesLoaded ? (
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                            }}
                            defaultValue={field.value}
                            disabled={isUpdate || loading}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background border-input text-foreground shadow-sm">
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
                          <div className="text-muted-foreground">Loading...</div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <FormLabel className="text-right">Select tool</FormLabel>
                    <MultiSelect<Option>
                      options={toolOptions}
                      value={selectedTools}
                      onChange={handleFrameworkChange}
                      placeholder="Select your favorite tools..."
                      label="Select tools"
                      className="w-full"
                    />
                  </div>
                  <div className="w-full">
                    <FormLabel className="text-right">Selected tool</FormLabel>

                    {selectedTools.length > 0 ? (
                      <div className="">
                        <InfoCard
                          content={toolOptions
                            .filter((option) => selectedTools.includes(option.value))
                            .map((option) => option.label)
                            .join(', ')}
                        />
                      </div>
                    ) : (
                      <InfoCard content={'No tool selected'} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
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
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">System Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a system Prompt"
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
                  <h3 className="text-md font-semibold">LLM Parameters</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust these parameters to fine-tune the agent behavior.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Temperature
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['temperature']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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
                        <FormLabel className="text-right">
                          Top P
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['top_p']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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
                        <FormLabel className="text-right">
                          Top K
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['top_k']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="max_tokens"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Max Tokens
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['max_tokens']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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
                        <FormLabel className="text-right">
                          Presence Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['presence_penalty']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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
                        <FormLabel className="text-right">
                          Frequency Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['frequency_penalty']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="repeat_penalty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">
                          Repeat Penalty
                          {llmModelId && (
                            <InfoHoverCard
                              content={
                                UPDATED_LLM_AGENT_PARAMETERS &&
                                UPDATED_LLM_AGENT_PARAMETERS['repeat_penalty']
                              }
                            />
                          )}
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
                            className="bg-background border-input text-foreground shadow-sm"
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

                <div className="flex justify-end">
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAgent
