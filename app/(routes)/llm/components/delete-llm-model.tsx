'use client'

import { LLMModel } from '@/app/(routes)/llm/types/type'
import useFetch from '@/app/hooks/useFetch'
import { API_CONFIG } from '@/app/utils/config'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'

interface DeleteLLMModelProps {
  llmModelId: string | undefined
  open: boolean
  onClose: () => void
}

const DeleteLLMModel = ({ llmModelId, open, onClose }: DeleteLLMModelProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.root}`
  const deleteLLMModelURL = llmModelId ? `${baseUrl}/${llmModelId}` : baseUrl
  const { loading, del: deleteLLMModel } = useFetch<LLMModel>(deleteLLMModelURL)

  const handleDelete = async () => {
    try {
      if (deleteLLMModelURL && deleteLLMModel) {
        await deleteLLMModel(deleteLLMModelURL)
        onClose()
      } else {
        console.error('deleteLLMModelURL or deleteLLMModel is undefined.')
        alert('Failed to delete LLM Model: Invalid URL or delete function.')
        onClose()
      }
    } catch (error: unknown) {
      let errorMessage = 'Failed to delete LLM Model.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred during LLM Model deletion:', error)
        errorMessage =
          'An unexpected error occurred during LLM Model deletion. Please check the console for details.'
      }
      toast({
        variant: 'destructive',
        title: 'Error Deleting LLM Model',
        description: errorMessage,
      })
      onClose()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the LLM Model and all related
            data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteLLMModel
