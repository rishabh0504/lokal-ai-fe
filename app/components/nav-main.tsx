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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CurrentAgent } from '../(routes)/agent/components/current-agent'
import { SIDEBAR_CONFIG } from '../utils/config'

export function NavMain() {
  const sidebarConfigItem = SIDEBAR_CONFIG
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <CurrentAgent />
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarConfigItem.navItems.map((item) => {
          const hasActiveSubItem = item.items?.some((subItem) => subItem.url === pathname)
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
                    className={`py-5 hover:bg-primary/20 ${isParentActive ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {item.iconName && <CustomIcon src={`/icons/${item?.iconName}`} />}
                    <span className={`text-primary ${isParentActive && 'text-primary-foreground'}`}>
                      <b>{item.title}</b>
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const isSubItemActive = subItem.url === pathname

                      return (
                        <SidebarMenuSubItem key={subItem.name}>
                          <SidebarMenuSubButton
                            asChild
                            className={`py-5 hover:bg-primary/20 ${isSubItemActive ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            <Link href={subItem.url}>
                              <span
                                className={` ${isSubItemActive ? 'text-primary-foreground' : 'text-primary'}`}
                              >
                                {subItem.name}
                              </span>
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
                className={`py-5 hover:bg-primary/20 ${isParentActive ? 'bg-primary text-primary-foreground ' : ''}`}
                asChild
              >
                <Link href={item.url}>
                  {item.iconName && <CustomIcon src={`/icons/${item?.iconName}`} />}
                  <span>
                    <b>{item.title}</b>
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
