import { useToast } from '@/hooks/use-toast'
import { useCallback, useState } from 'react'

interface UseCopyToClipboardResult {
  isCopied: boolean
  copyToClipboard: (text: string) => Promise<boolean>
  resetCopyStatus: () => void
}

export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        toast({
          title: 'Copied!',
          description: 'Text successfully copied to clipboard.',
        })
        return true
      } catch (error: unknown) {
        console.error('Failed to copy: ', error)
        setIsCopied(false)
        toast({
          title: 'Error',
          description: `Failed to copy text: ${error}`,
          variant: 'destructive', // Use "destructive" variant for error messages
        })
        return false
      }
    },
    [toast],
  ) // Add toast to the dependency array

  const resetCopyStatus = useCallback(() => {
    setIsCopied(false)
  }, [])

  return { isCopied, copyToClipboard, resetCopyStatus }
}
