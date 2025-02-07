'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { setActiveAgent } from '@/app/store/slices/agent.reducer'
import { AppDispatch, RootState } from '@/app/store/store'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Agent } from '../types/type'

export function CurrentAgent() {
  const dispatch = useDispatch<AppDispatch>()

  const [open, setOpen] = useState(false)
  const agents = (useSelector((state: RootState) => state.agents.items) as Agent[]) || []
  const activeAgent = useSelector((state: RootState) => state.agents.activeAgent) as Agent
  const [value, setValue] = useState<string>(activeAgent?.id || '')

  useEffect(() => {
    if (value) {
      const agent = agents.find((agent) => agent.id === value)
      if (agent) {
        dispatch(setActiveAgent(agent))
      }
    }
  }, [value])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-sm"
        >
          {value ? agents.find((agent) => agent.id === value)?.name : 'Select Agent'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search agent..." className="h-9" />
          <CommandList>
            <CommandEmpty>Create New Agent</CommandEmpty>
            <CommandGroup>
              {agents.map((agent) => (
                <CommandItem
                  key={agent.id}
                  value={agent.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {agent.name}
                  <Check
                    className={cn('ml-auto', value === agent.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
