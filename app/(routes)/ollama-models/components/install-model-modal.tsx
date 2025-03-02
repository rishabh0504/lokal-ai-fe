import useFetch from '@/app/hooks/useFetch'
import { API_CONFIG } from '@/app/utils/config'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'

interface InstallModalProps {
  isOpen: boolean
  onClose: () => void
}

const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [modelName, setModelName] = useState<string>('')
  const { toast } = useToast()
  const modelInstallationEndPoint = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.ollamaServices.installModel}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { post: modelInstallation } = useFetch<any>(modelInstallationEndPoint)

  const handleInstallation = async () => {
    if (!modelName) {
      return
    }
    try {
      const modelInstallationUrl = modelInstallationEndPoint.replace('{modelName}', modelName)
      const response = await modelInstallation({}, modelInstallationUrl)
      if (response) {
        toast({
          title: 'Success!',
          description: `${modelName} installation in progress!`,
        })
      }
      onClose()
    } catch (error: unknown) {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: `${modelName} installation in failed! Please try after some time`,
      })
      console.error(error)
    }
  }

  const cancelInstallation = () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Install Models</DialogTitle>
          <div className="flex items-center justify-between">
            <DialogDescription>
              <b>Note</b>: Insert Ollama exact model name to get installed.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4 h-full">
          <Input
            value={modelName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setModelName(e.target.value)
            }}
            className="resize-none flex-grow  bg-gray-100"
            placeholder={`Enter ollama model e.g. qwen2.5:0.5b`}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={cancelInstallation}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleInstallation}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InstallModal
