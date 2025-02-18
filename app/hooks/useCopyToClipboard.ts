import { useCallback, useState } from 'react'

interface UseCopyToClipboardResult {
  isCopied: boolean
  copyToClipboard: (text: string) => Promise<boolean>
  resetCopyStatus: () => void
}

export const useCopyToClipboard = (): UseCopyToClipboardResult => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      return true
    } catch (err) {
      console.error('Failed to copy: ', err)
      setIsCopied(false)
      return false
    }
  }, [])

  const resetCopyStatus = useCallback(() => {
    setIsCopied(false)
  }, [])

  return { isCopied, copyToClipboard, resetCopyStatus }
}
