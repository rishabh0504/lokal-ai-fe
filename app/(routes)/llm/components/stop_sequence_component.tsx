import { MultiSelect } from '@/components/ui/multi-select'

interface StopSequenceMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  className?: string
}

export function StopSequenceMultiSelect({
  value,
  onChange,
  className,
}: StopSequenceMultiSelectProps) {
  const stopSequenceOptions = [
    { value: '\\n', label: 'Newline (\\n)' },
    { value: '.', label: 'Period (.)' },
    { value: '?', label: 'Question Mark (?)' },
    { value: '!', label: 'Exclamation Mark (!)' },
    { value: ';', label: 'Semicolon (;)' },
    { value: '</s>', label: '<s/> (End of Sentence)' },
    { value: '<|file_separator|>', label: '<|file_separator|>' },
    { value: '<|endoftext|>', label: '<|endoftext|>' },
  ]

  return (
    <MultiSelect
      options={stopSequenceOptions}
      value={value}
      onChange={onChange}
      placeholder="Select stop sequences..."
      className={className}
      label="Stop Sequences"
    />
  )
}
