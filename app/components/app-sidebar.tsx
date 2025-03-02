'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { ComponentProps, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Agent } from '../(routes)/agent/types/type'
import { LLMModelConfig, OllamaModelResponse } from '../(routes)/llm/types/type'
import useFetch from '../hooks/useFetch'
import { setAgents } from '../store/slices/agent.reducer'
import { setLLMs } from '../store/slices/llm.reducer'
import { setOllamaModels } from '../store/slices/ollama-models.reducer'
import { AppDispatch } from '../store/store'
import { API_CONFIG, SIDEBAR_CONFIG } from '../utils/config'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import { ToolConfig } from '../(routes)/tools/dto/types'
import { setToolConfig } from '../store/slices/tool-config.reducer'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>()

  // ==============Fetch agents Initialization===================
  const agentBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.root}`

  const { get: getAgents } = useFetch<Agent[]>(agentBaseUrl)
  useEffect(() => {
    const fetchAgents = async () => {
      const llms = await getAgents(agentBaseUrl)
      if (llms && Array.isArray(llms)) {
        dispatch(setAgents(llms))
      }
    }
    fetchAgents()
  }, [dispatch, getAgents])
  // ==============Fetch agents completed========================

  // ==============Fetch LLMConfigModels Initialization==========
  const llmConfigsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.root}`

  const { get: getLLMConfigs } = useFetch<LLMModelConfig[]>(llmConfigsEndpoint)
  useEffect(() => {
    const fetchLLMConfigs = async () => {
      const llmConfigs = await getLLMConfigs(llmConfigsEndpoint)
      if (llmConfigs && Array.isArray(llmConfigs)) {
        dispatch(setLLMs(llmConfigs))
      }
    }
    fetchLLMConfigs()
  }, [dispatch, getLLMConfigs])
  // ==============Fetch LLMConfigModels completed===============

  // ==============Fetch OllamaModels Initialization=============
  const ollamaModelsEndpoints = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.ollamaServices.root}`

  const { get: getOllamaModels } = useFetch<OllamaModelResponse[]>(ollamaModelsEndpoints)
  useEffect(() => {
    const fetchOllamaModels = async () => {
      const ollamaModels = await getOllamaModels(ollamaModelsEndpoints)
      if (ollamaModels && Array.isArray(ollamaModels)) {
        dispatch(setOllamaModels(ollamaModels))
      }
    }
    fetchOllamaModels()
  }, [dispatch, getLLMConfigs])
  // ==============Fetch OllamaModels completed==================

  // ==============Fetch Tools Initialization=============
  const toolsEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.toolConfig.root}`

  const { get: getTools } = useFetch<ToolConfig[]>(toolsEndpoint)
  useEffect(() => {
    const fetchTools = async () => {
      const toolsLists = await getTools(toolsEndpoint)
      if (toolsLists && Array.isArray(toolsLists)) {
        dispatch(setToolConfig(toolsLists))
      }
    }
    fetchTools()
  }, [dispatch, getTools])
  // ==============Fetch Tools completed==================
  return (
    <>
      <Sidebar collapsible="icon" {...props} className="p-2">
        <Link href="/" passHref>
          <SidebarHeader>
            <TeamSwitcher teams={SIDEBAR_CONFIG.teams} />
          </SidebarHeader>
        </Link>
        <SidebarContent>
          <NavMain />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  )
}
