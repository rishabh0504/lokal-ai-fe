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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CreateAgent from '@/app/(routes)/agent/components/create-agent'
import DeleteAgent from '@/app/(routes)/agent/components/delete-agent'
import { Agent } from '@/app/(routes)/agent/types/type'
import useFetch from '@/app/hooks/useFetch'
import { setAgents } from '@/app/store/slices/agent.reducer'
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

const AgentPage: NextPage = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const agents = useSelector((state: RootState) => state.agents.items) || []

  const [agentIdToBeEdited, setAgentIdToBeEdited] = useState<string | undefined>(undefined)
  const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false)
  const [agentIdToBeDeleted, setAgentIdToBeDeleted] = useState<string | undefined>(undefined)
  const [isDeleteAgentOpen, setIsDeleteAgentOpen] = useState(false)

  const [refetchAgent, setRefetchAgent] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.agents.root}`

  const { loading, get: getAgents } = useFetch<Agent[]>(baseUrl)

  const getAgentList = async () => {
    const agents = await getAgents(baseUrl)
    if (agents && Array.isArray(agents)) {
      dispatch(setAgents(agents))
    }
  }

  useEffect(() => {
    const fetchAgents = async () => {
      if (refetchAgent) {
        getAgentList()
        setRefetchAgent(false)
      }
    }
    fetchAgents()
  }, [refetchAgent])

  const memoizedAgents = useMemo(() => agents, [agents])

  const columns: ColumnDef<Agent>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'name',
        header: 'Agent name',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'description',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Description
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const description = String(row.getValue('description'))
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="lowercase overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] group cursor-pointer">
                    {description}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64">{description}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: 'prompt',
        header: 'Prompt',
        cell: ({ row }) => {
          const prompt = String(row.getValue('prompt'))
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-right font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] group cursor-pointer">
                    {prompt}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64">{prompt}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: () => <div className="text-right">Created Date</div>,
        cell: ({ row }) => {
          const createdAt = String(row.getValue('created_at'))
          const formatted = formatDateForTable(createdAt)
          return <div className="text-right font-medium">{formatted}</div>
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const agent = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditAgent(agent.id)}>
                  Edit Agent
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteAgent(agent.id)}>
                  Delete Agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable<Agent>({
    data: memoizedAgents,
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

  const handleEditAgent = (agentId: string) => {
    setAgentIdToBeEdited(agentId)
    setIsCreateAgentOpen(true)
  }

  const handleCreateAgentClose = () => {
    setIsCreateAgentOpen(false)
    setAgentIdToBeEdited(undefined)
    setRefetchAgent(true)
  }
  const deleteAgent = (agentId: string) => {
    setAgentIdToBeDeleted(agentId)
    setIsDeleteAgentOpen(true)
  }
  const handleDeleteAgentClose = () => {
    setIsDeleteAgentOpen(false)
    setAgentIdToBeDeleted(undefined)
    setRefetchAgent(true)
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="Agent" className="text-lg font-semibold tracking-tight text-primary">
          Agents
        </Label>
        <Button variant="outline" onClick={() => setIsCreateAgentOpen(true)}>
          Create Agent
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter agent..."
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
                        <TableHead key={header.id}>
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
      {isCreateAgentOpen && (
        <CreateAgent
          agentId={agentIdToBeEdited}
          open={isCreateAgentOpen}
          onClose={handleCreateAgentClose}
        />
      )}

      {isDeleteAgentOpen && (
        <DeleteAgent
          agentId={agentIdToBeDeleted}
          open={isDeleteAgentOpen}
          onClose={handleDeleteAgentClose}
        />
      )}
    </div>
  )
}

export default AgentPage
