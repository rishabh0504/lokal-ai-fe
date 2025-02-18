'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useRef, useState } from 'react'
import ReactJson from 'react-json-view'
import { Schema } from './types/types'

interface JSONOutputProps {
  schema: Schema
}

export function JSONOutput({ schema }: JSONOutputProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { toast } = useToast()
  const reactJsonRef = useRef<typeof ReactJson>(null)

  const copyToClipboard = useCallback(() => {
    if (reactJsonRef.current) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(reactJsonRef.current as any).copyToClipboard()
        toast({
          title: 'Schema Copied',
          description: 'The schema has been successfully copied.',
        })
      } catch (error) {
        console.error('Failed to copy using react-json-view: ', error)
        navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
        toast({
          title: 'Schema Copied',
          description: 'The schema has been successfully copied.',
        })
      }
    } else {
      navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
      toast({
        title: 'Schema Copied',
        description: 'The schema has been successfully copied.',
      })
    }
  }, [schema, toast])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          JSON Schema
          <div>
            <Button onClick={copyToClipboard} className="mr-2">
              Copy
            </Button>
            <Button onClick={() => setIsCollapsed(!isCollapsed)}>
              {isCollapsed ? 'Expand' : 'Collapse'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tree">
          <TabsList>
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="raw">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="tree">
            <ReactJson
              src={schema}
              theme="monokai"
              collapsed={isCollapsed ? 1 : false}
              displayDataTypes={false}
              enableClipboard={true}
            />
          </TabsContent>
          <TabsContent value="raw">
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              {JSON.stringify(schema, null, 2)}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
