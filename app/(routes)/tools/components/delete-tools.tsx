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
import { ToolConfig } from '../dto/types'

interface DeleteToolConfigProps {
  toolConfigId: string | undefined
  open: boolean
  onClose: () => void
}

const DeleteToolConfig = ({ toolConfigId, open, onClose }: DeleteToolConfigProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.toolConfig.root}`
  const deleteToolConfigURL = toolConfigId ? `${baseUrl}/${toolConfigId}` : baseUrl
  const { loading, del: deleteToolConfig } = useFetch<ToolConfig>(deleteToolConfigURL)

  const handleDelete = async () => {
    try {
      await deleteToolConfig(deleteToolConfigURL)
      toast({
        title: 'ToolConfig Deleted',
        description: 'ToolConfig deleted successfully!',
      })
      onClose()
    } catch (error: unknown) {
      let errorMessage = 'Failed to delete tool config.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred during tool config deletion:', error)
        errorMessage =
          'An unexpected error occurred during tool config deletion. Please check the console for details.'
      }

      toast({
        variant: 'destructive',
        title: 'Error Deleting ToolConfig',
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
            This action cannot be undone. This will permanently delete the tool config and all
            related data.
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

export default DeleteToolConfig
