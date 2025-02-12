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

import CreateLLMModel from '@/app/(routes)/llm/components/create-llm-model'
import DeleteLLMModel from '@/app/(routes)/llm/components/delete-llm-model'
import { LLMModel } from '@/app/(routes)/llm/types/type'
import useFetch from '@/app/hooks/useFetch'
import { setLLMs } from '@/app/store/slices/llm.reducer'
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
import type { NextPage } from 'next/types'
import { useDispatch, useSelector } from 'react-redux'

const LLMModelPage: NextPage = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const [llmModelIdToBeEdited, setLLMModelIdToBeEdited] = useState<string | undefined>(undefined)
  const [isCreateLLMModelOpen, setIsCreateLLMModelOpen] = useState(false)
  const [llmModelIdToBeDeleted, setLLMModelIdToBeDeleted] = useState<string | undefined>(undefined)
  const [isDeleteLLMModelOpen, setIsDeleteLLMModelOpen] = useState(false)
  const [refetchLLms, setRefetchLLms] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_POINT}/${API_CONFIG.llms.get}`

  const llmModels = useSelector((state: RootState) => state.llms.items) || []
  const memoizedLLMModels = useMemo(() => llmModels, [llmModels])

  const columns: ColumnDef<LLMModel>[] = useMemo(
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
        header: 'Name',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'modelName',
        header: 'Model Name',
        cell: ({ row }) => <div className="lowercase">{row.getValue('modelName')}</div>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <div>{row.getValue('description')}</div>,
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
          const llmModel = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditLLMModel(llmModel.id)}>
                  Edit LLM Model
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteLLMModel(llmModel.id)}>
                  Delete LLM Model
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable<LLMModel>({
    data: memoizedLLMModels,
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

  const { loading, get: getLLMs } = useFetch<LLMModel[]>(baseUrl)

  const getLargeLanguageModel = async () => {
    const llms = await getLLMs(baseUrl)
    if (llms && Array.isArray(llms)) {
      dispatch(setLLMs(llms))
    }
  }
  useEffect(() => {
    const fetchLLMs = async () => {
      if (refetchLLms) {
        getLargeLanguageModel()
        setRefetchLLms(false)
      }
    }
    fetchLLMs()
  }, [refetchLLms])

  useEffect(() => {
    const fetchLLMs = async () => {
      getLargeLanguageModel()
      setRefetchLLms(false)
    }
    fetchLLMs()
  }, [dispatch, getLLMs])

  const handleEditLLMModel = (llmModelId: string) => {
    setLLMModelIdToBeEdited(llmModelId)
    setIsCreateLLMModelOpen(true)
  }

  const handleCreateLLMModelClose = () => {
    setIsCreateLLMModelOpen(false)
    setLLMModelIdToBeEdited(undefined)
    setRefetchLLms(true)
  }

  const deleteLLMModel = (llmModelId: string) => {
    setLLMModelIdToBeDeleted(llmModelId)
    setIsDeleteLLMModelOpen(true)
  }

  const handleDeleteLLMModelClose = () => {
    setIsDeleteLLMModelOpen(false)
    setLLMModelIdToBeDeleted(undefined)
    setRefetchLLms(true)
  }

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="LLMModel" className="text-lg font-semibold tracking-tight text-primary">
          LLM Models
        </Label>
        <Button variant="outline" onClick={() => setIsCreateLLMModelOpen(true)}>
          Create LLM Model
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter LLM Model..."
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Loading />
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
      {isCreateLLMModelOpen && (
        <CreateLLMModel
          llmModelId={llmModelIdToBeEdited}
          open={isCreateLLMModelOpen}
          onClose={handleCreateLLMModelClose}
        />
      )}

      {isDeleteLLMModelOpen && (
        <DeleteLLMModel
          llmModelId={llmModelIdToBeDeleted}
          open={isDeleteLLMModelOpen}
          onClose={handleDeleteLLMModelClose}
        />
      )}
    </div>
  )
}

export default LLMModelPage
