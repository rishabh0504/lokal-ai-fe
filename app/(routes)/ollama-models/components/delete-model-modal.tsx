'use client'
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
import { OllamaModelResponse } from '../../llm/types/type'

interface DeleteModelModalProps {
  modelName: string
  open: boolean
  onClose: () => void
}

const DeleteModelModal = ({ modelName, open, onClose }: DeleteModelModalProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.ollamaServices.removeModel}`
  const { loading, del: deleteModel } = useFetch<OllamaModelResponse>(baseUrl)

  const handleDelete = async () => {
    try {
      const finalEndpoint = baseUrl.replace('{modelName}', modelName)
      await deleteModel(finalEndpoint)
      toast({
        title: `Model Removal Status`,
        description: 'Model uninstallation status in progress!',
      })
      onClose()
    } catch (error: unknown) {
      let errorMessage = `Failed to remove model ${modelName}.`

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred during model deletion:', error)
        errorMessage =
          'An unexpected error occurred during model deletion. Please check the console for details.'
      }

      toast({
        variant: 'destructive',
        title: 'Error Deleting Model',
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
            This action cannot be undone. This will permanently remove the model and all related
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

export default DeleteModelModal
