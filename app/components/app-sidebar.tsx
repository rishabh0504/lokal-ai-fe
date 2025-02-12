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
import useFetch from '../hooks/useFetch'
import { setAgents } from '../store/slices/agent.reducer'
import { AppDispatch } from '../store/store'
import { API_CONFIG, SIDEBAR_CONFIG } from '../utils/config'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>()
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.get}`

  const { get: getAgents } = useFetch<Agent[]>(baseUrl)
  useEffect(() => {
    const fetchAgents = async () => {
      const llms = await getAgents(baseUrl)
      if (llms && Array.isArray(llms)) {
        dispatch(setAgents(llms))
      }
    }
    fetchAgents()
  }, [dispatch, getAgents])
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
