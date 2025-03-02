'use client'
import { useCopyToClipboard } from '@/app/hooks/useCopyToClipboard'
import { LLM_CONFIG_FOR_MODELS } from '@/app/utils/common.constant'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import DEFAULT_JSON from '@app/utils/model.json'
import React, { useEffect, useState } from 'react'

interface JsonEditorModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialJson?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: (json: any) => void
  modelName: string
}

const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  isOpen,
  onClose,
  initialJson,
  onDone,
  modelName,
}) => {
  const [jsonText, setJsonText] = useState<string>('')
  const [isValidJson, setIsValidJson] = useState<boolean>(true)
  const { toast } = useToast()
  const { copyToClipboard } = useCopyToClipboard()

  useEffect(() => {
    if (initialJson) {
      try {
        setJsonText(JSON.stringify(initialJson, null, 2))
        setIsValidJson(true)
      } catch (error: unknown) {
        setJsonText('')
        setIsValidJson(false)
        console.error(error)
      }
    } else {
      setJsonText('')
      setIsValidJson(true)
    }
  }, [initialJson])

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value
    setJsonText(newText)
    try {
      JSON.parse(newText)
      setIsValidJson(true)
    } catch (error: unknown) {
      setIsValidJson(false)
      console.error(error)
    }
  }

  const handleDone = () => {
    if (isValidJson) {
      try {
        onDone(JSON.parse(jsonText))
        onClose()
        toast({
          title: 'Success!',
          description: 'JSON data saved successfully.',
        })
      } catch (error) {
        console.error('Unexpected error parsing JSON after validation:', error)
        setIsValidJson(false)
        toast({
          variant: 'destructive',
          title: 'Error!',
          description: 'Unexpected error parsing JSON. Please check the format.',
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: 'JSON is invalid. Please correct it before submitting.',
      })
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const copyPrompt = async () => {
    let prompt = LLM_CONFIG_FOR_MODELS.replace('{modelName}', modelName)
    prompt = await prompt.replace('{FORMAT}', JSON.stringify(DEFAULT_JSON, null, 2))
    await copyToClipboard(prompt)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit JSON</DialogTitle>
          <div className="flex items-center justify-between">
            <DialogDescription>
              <b>Note</b>: Copy the prompt to get the configuration from any ai tools to configure
              the default values of the llms
            </DialogDescription>
            <Button type="button" variant="secondary" onClick={copyPrompt}>
              Copy Prompt
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] w-full">
          <div className="flex flex-col gap-4 py-4 h-full">
            <Textarea
              value={jsonText}
              onChange={handleTextareaChange}
              className="resize-none flex-grow h-[50vh] bg-gray-100"
              placeholder={`${JSON.stringify(DEFAULT_JSON, null, 2)}`}
            />
            {!isValidJson && <p className="text-red-500 text-sm">Invalid JSON format.</p>}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!isValidJson} onClick={handleDone}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default JsonEditorModal
