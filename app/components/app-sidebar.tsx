'use client'

import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { fetchAgents } from '../store/slices/agent.reducer'
import { fetchLLMs } from '../store/slices/llm.reducer'
import { AppDispatch } from '../store/store'
import { SIDEBAR_CONFIG } from '../utils/config'
import { NavMain } from './nav-main'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch<AppDispatch>()
  React.useEffect(() => {
    dispatch(fetchLLMs())
    dispatch(fetchAgents())
  }, [dispatch])
  return (
    <>
      <Sidebar collapsible="icon" {...props} className="px-2">
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
