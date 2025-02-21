'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface MultiSelectProps<T extends { value: string; label: string }> {
  options: T[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  label?: string //Added label
}

export function MultiSelect<T extends { value: string; label: string }>({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  className,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false)

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => value.includes(option.value))
  }, [options, value])

  const handleSelect = (newValue: string) => {
    if (value.includes(newValue)) {
      onChange(value.filter((v) => v !== newValue))
    } else {
      onChange([...value, newValue])
    }
  }

  return (
    <FormItem>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-[300px] justify-between overflow-hidden  text-ellipsis whitespace-nowrap',
              value.length > 0 ? 'data-[placeholder=false]:text-current' : 'text-muted-foreground',
              className,
            )}
          >
            <span className="truncate">
              {selectedOptions.length > 0
                ? selectedOptions.map((option) => option.label).join(', ')
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search items..." className="h-9" />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      handleSelect(option.value)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value.includes(option.value) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  )
}
