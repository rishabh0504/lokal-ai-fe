'use client'
import { Agent } from '@/app/(routes)/agent/types/type'
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

interface DeleteAgentProps {
  agentId: string | undefined
  open: boolean
  onClose: () => void
}

const DeleteAgent = ({ agentId, open, onClose }: DeleteAgentProps) => {
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.root}`
  const deleteAgentURL = agentId ? `${baseUrl}/${agentId}` : baseUrl
  const { loading, del: deleteAgent } = useFetch<Agent>(deleteAgentURL)

  const handleDelete = async () => {
    try {
      await deleteAgent(deleteAgentURL)
      toast({
        title: 'Agent Deleted',
        description: 'Agent deleted successfully!',
      })
      onClose()
    } catch (error: unknown) {
      let errorMessage = 'Failed to delete agent.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        console.error('An unexpected error occurred during agent deletion:', error)
        errorMessage =
          'An unexpected error occurred during agent deletion. Please check the console for details.'
      }

      toast({
        variant: 'destructive',
        title: 'Error Deleting Agent',
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
            This action cannot be undone. This will permanently delete the agent and all related
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

export default DeleteAgent
