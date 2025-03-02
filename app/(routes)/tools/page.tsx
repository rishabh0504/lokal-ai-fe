'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import useFetch from '@/app/hooks/useFetch'
import { setToolConfig } from '@/app/store/slices/tool-config.reducer'
import { AppDispatch, RootState } from '@/app/store/store'
import { API_CONFIG } from '@/app/utils/config'
import { formatDateForTable } from '@/app/utils/util-service'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Loading from '@/components/ui/loading'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { NextPage } from 'next/types'
import { useDispatch, useSelector } from 'react-redux'
import { ToolConfigModal } from './components/create-edit-tool-model'
import { ToolConfig } from './dto/types'
import DeleteToolConfig from './components/delete-tools'

const ToolsConfigPage: NextPage = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [toolsConfigToBeEdited, setToolsConfigToBeEdited] = useState<string | undefined>(undefined)
  const [toolConfigIdToBeDeleted, setToolConfigIdToBeDeleted] = useState<string | undefined>(
    undefined,
  )
  const [isCreateToolConfigModelOpen, setIsCreateToolConfigModalOpen] = useState(false)

  const [isDeleteToolConfigModelOpen, setIsDeleteToolConfigModelOpen] = useState(false)
  const [refetchToolConfig, setRefetchToolConfig] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.toolConfig.root}`

  const toolConfigs = useSelector((state: RootState) => state.toolConfigs.items) || []
  const memoizedToolConfig = useMemo(() => toolConfigs, [toolConfigs])

  const { get: getToolsConfig } = useFetch<ToolConfig[]>(baseUrl)

  const getToolsConfigList = async () => {
    const toolsConfigList = await getToolsConfig(baseUrl)
    if (toolsConfigList && Array.isArray(toolsConfigList)) {
      dispatch(setToolConfig(toolsConfigList))
    }
  }

  useEffect(() => {
    const fetchToolsConfig = async () => {
      getToolsConfigList()
    }
    fetchToolsConfig()
  }, [dispatch, getToolsConfig])

  const columns: ColumnDef<ToolConfig>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className="text-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: () => <div className="text-center font-medium">Name</div>,
        cell: ({ row }) => <div className="text-center capitalize">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'description',
        header: () => <div className="text-center font-medium">Description</div>,
        cell: ({ row }) => {
          const description = String(row.getValue('description'))
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-4 lowercase overflow-hidden text-ellipsis whitespace-nowrap  group cursor-pointer text-center">
                    {description.substring(0, 10).concat('...')}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64 p-4">{description}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: () => <div className="text-center font-medium">Created Date</div>,
        cell: ({ row }) => {
          const createdAt = String(row.getValue('createdAt'))
          const formatted = formatDateForTable(createdAt)
          return <div className="text-center font-medium">{formatted}</div>
        },
      },
      {
        accessorKey: 'updatedAt',
        header: () => <div className="text-center font-medium">Updated Date</div>,
        cell: ({ row }) => {
          const updatedAt = String(row.getValue('updatedAt'))
          const formatted = formatDateForTable(updatedAt)
          return <div className="text-center font-medium">{formatted}</div>
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const toolItem = row.original

          return (
            <div className="text-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditToolsConfig(toolItem?.id)}>
                    Edit Tool
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteToolConfig(toolItem?.id)}>
                    Delete Tool
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable<ToolConfig>({
    data: memoizedToolConfig,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const { loading, get: getTools } = useFetch<ToolConfig[]>(baseUrl)

  const getToolConfig = async () => {
    const toolsConfigs = await getTools(baseUrl)
    if (toolsConfigs && Array.isArray(toolsConfigs)) {
      dispatch(setToolConfig(toolsConfigs))
    }
  }

  useEffect(() => {
    const fetchToolsConfigItems = async () => {
      if (refetchToolConfig) {
        getToolConfig()
        setRefetchToolConfig(false)
      }
    }
    fetchToolsConfigItems()
  }, [refetchToolConfig])

  useEffect(() => {
    const fetchToolsConfigItems = async () => {
      getToolConfig()
      setRefetchToolConfig(false)
    }
    fetchToolsConfigItems()
  }, [dispatch, getTools])

  const deleteToolConfig = (toolConfigId: string | undefined) => {
    if (toolConfigId) {
      setToolConfigIdToBeDeleted(toolConfigId)
      setIsDeleteToolConfigModelOpen(true)
    }
  }

  const handleDeleteToolConfigClose = () => {
    setIsDeleteToolConfigModelOpen(false)
    setToolConfigIdToBeDeleted(undefined)
    setRefetchToolConfig(true)
  }

  const handleEditToolsConfig = (toolsConfigId: string | undefined) => {
    if (toolsConfigId) {
      setToolsConfigToBeEdited(toolsConfigId)
      setIsCreateToolConfigModalOpen(true)
    }
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="ToolConfig" className="text-lg font-semibold tracking-tight text-primary">
          Tools
        </Label>
        <Button variant="outline" onClick={() => setIsCreateToolConfigModalOpen(true)}>
          Create Tool
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter Tools..."
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="text-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24">
                      <div className="flex justify-center items-center h-full">
                        <Loading />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isCreateToolConfigModelOpen && (
        <ToolConfigModal
          open={isCreateToolConfigModelOpen}
          onClose={() => {
            setIsCreateToolConfigModalOpen(false)
          }}
          toolConfigId={toolsConfigToBeEdited}
        />
      )}

      {isDeleteToolConfigModelOpen && (
        <DeleteToolConfig
          toolConfigId={toolConfigIdToBeDeleted}
          open={isDeleteToolConfigModelOpen}
          onClose={handleDeleteToolConfigClose}
        />
      )}
    </div>
  )
}

export default ToolsConfigPage
