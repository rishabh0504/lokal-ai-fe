import { cn } from '@/lib/utils'
import { Loader as LucideLoader } from 'lucide-react'
import * as React from 'react'

interface LoaderProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string
  color?: string
  className?: string
}

export default function Loader({
  className,
  size = 24,
  color = 'currentColor',
  ...props
}: LoaderProps) {
  return (
    <LucideLoader className={cn('animate-spin', className)} size={size} color={color} {...props} />
  )
}
