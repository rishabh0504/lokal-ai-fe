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
import { ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { NAVITEM_TYPES } from '../utils/common.constant'
import { SIDEBAR_CONFIG } from '../utils/config'
import { NavItem } from '../utils/types'

export function NavMain() {
  const { items: llms } = useSelector((state: RootState) => state.llms)
  const { items: agents } = useSelector((state: RootState) => state.agents)

  console.log(agents)
  const sidebarConfigItem = SIDEBAR_CONFIG
  sidebarConfigItem.navItems.forEach((eachItem: NavItem) => {
    if (eachItem.type === NAVITEM_TYPES.LLM_TYPE) {
      eachItem.items = llms
    }
    if (eachItem.type === NAVITEM_TYPES.AGENT_TYPE) {
      eachItem.items = agents
    }
  })
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarConfigItem.navItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild className="bg-gray-100">
                <SidebarMenuButton tooltip={item.title} className="py-5">
                  {item.iconName && <CustomIcon src={`/icons/${item?.iconName}`} />}
                  <span>
                    <b>{item.title}</b>
                  </span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.name}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
