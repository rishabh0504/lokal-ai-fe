import React, { useCallback, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactJson from 'react-json-view'

import { Button } from '@/components/ui/button' // Assuming you have Shadcn UI's button component
import { useToast } from '@/hooks/use-toast'
import { Schema } from './types/types'

interface JsonSchemaViewerProps {
  schema: Schema
  name?: string // Optional name for the root of the JSON view
  enableClipboard?: boolean // Enable or disable copy to clipboard
}

const JsonSchemaViewer: React.FC<JsonSchemaViewerProps> = ({
  schema,
  name,
  enableClipboard = true,
}) => {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = useCallback(() => {
    setCopied(true)
    toast({
      title: 'Schema Copied!',
      description: 'The JSON schema has been copied to your clipboard.',
    })

    // Reset the copied state after a short delay
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }, [toast])

  const handleExpand = useCallback(() => {
    setExpanded(!expanded)
  }, [expanded])

  return (
    <div className="border rounded-md shadow-sm bg-card text-card-foreground p-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{name || 'JSON Schema'}</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleExpand}>
            {expanded ? 'Collapse' : 'Expand'}
          </Button>

          {enableClipboard && (
            <CopyToClipboard text={JSON.stringify(schema, null, 2)} onCopy={handleCopy}>
              <Button variant="outline" size="sm" disabled={copied}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </CopyToClipboard>
          )}
        </div>
      </div>

      <ReactJson
        src={schema}
        name={name || 'schema'}
        theme="monokai"
        displayDataTypes={false}
        displayObjectSize={false}
        collapsed={!expanded}
        indentWidth={2}
        enableClipboard={false} // disable react-json-view's clipboard functionality, use our own.
      />
    </div>
  )
}

export default JsonSchemaViewer
