'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import CustomIcon from '@/components/ui/custom-icons'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Chat from '../(routes)/chat/components/chat'
import useFetch from '../hooks/useFetch'
import { setSessions } from '../store/slices/session.reducer'
import { AppDispatch, RootState } from '../store/store'
import { API_CONFIG, SIDEBAR_CONFIG } from '../utils/config'
import { Items, NavItem } from '../utils/types'
export type SessionModel = {
  id: string
  title: string
  userId: string
  agentId: string
}
export function NavMain() {
  const sidebarConfigItem = SIDEBAR_CONFIG
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>()
  const chatSessions = useSelector((state: RootState) => state.sessions.items) || []

  const searchParams = useSearchParams()
  const sessionIdFromParams = searchParams.get('sessionId')

  // Fetch all the sessions======================
  const sessionsBaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.chat.session}`
  const { get: fetchSessions } = useFetch<SessionModel[]>(sessionsBaseUrl)
  const getAllSessions = async () => {
    const sessions = await fetchSessions(sessionsBaseUrl)
    if (sessions && Array.isArray(sessions)) {
      dispatch(setSessions(sessions))
    }
  }
  useEffect(() => {
    const fetchSessions = async () => {
      getAllSessions()
    }
    fetchSessions()
  }, [dispatch, fetchSessions])

  useEffect(() => {
    SIDEBAR_CONFIG.navItems = SIDEBAR_CONFIG.navItems.map((eachItem: NavItem) => {
      if (eachItem.type === 'chat_history') {
        if (Array.isArray(eachItem.items)) {
          const chatSessionList: Items[] = chatSessions.map((eachSession: SessionModel) => ({
            url: `/chat?sessionId=${eachSession.id}`,
            name: eachSession.id,
            component: Chat,
          }))

          return {
            ...eachItem,
            items: [
              {
                name: 'New Chat',
                url: '/chat',
                component: Chat,
              },
              ...chatSessionList,
            ],
          }
        }
      }
      return eachItem
    })
  }, [chatSessions])

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <Separator />
      <SidebarMenu>
        {sidebarConfigItem.navItems.map((item) => {
          const hasActiveSubItem = item.items?.some((subItem) =>
            sessionIdFromParams ? sessionIdFromParams === subItem.name : subItem.url === pathname,
          )
          const isParentActive = item.url === pathname

          return item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive || hasActiveSubItem}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild className="">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`py-5 hover:bg-gray-200 ${isParentActive ? 'bg-gray-300 text-black' : 'text-black'}`}
                  >
                    {item.iconName && <CustomIcon src={`/icons/${item?.iconName}`} />}
                    <span>
                      <b>{item.title}</b>
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = sessionIdFromParams
                        ? sessionIdFromParams === subItem.name
                        : subItem.url === pathname

                      return (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton
                            asChild
                            className={`py-5 hover:bg-gray-200 ${isSubItemActive ? 'bg-gray-300 text-black' : 'bg-gray-100 text-black'}`}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className={`py-5 hover:bg-gray-200 ${isParentActive ? 'bg-gray-300 text-black' : 'text-black'}`}
                asChild
              >
                <Link href={item.url}>
                  {item.iconName && (
                    <CustomIcon
                      src={`/icons/${item?.iconName}`}
                      className={`${isParentActive ? 'bg-white text-black ' : 'text-black '}`}
                    />
                  )}
                  <span>
                    <b>{item.title}</b>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
      <Separator />
    </SidebarGroup>
  )
}
