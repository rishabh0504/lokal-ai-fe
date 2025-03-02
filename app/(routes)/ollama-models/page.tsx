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
import { useMemo, useState } from 'react'

import { RootState } from '@/app/store/store'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { useSelector } from 'react-redux'
import { ModelDetails, OllamaModelResponse } from '../llm/types/type'
import InstallModal from './components/install-model-modal'
import DeleteModelModal from './components/delete-model-modal'

const OllamaModelPage: NextPage = () => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [installation, setInstallation] = useState<boolean>(false)

  const [deleteModel, setDeleteModel] = useState<string | undefined>(undefined)

  const ollamaModels: OllamaModelResponse[] =
    useSelector((state: RootState) => state.ollamaModels.items) || []

  const columns: ColumnDef<OllamaModelResponse>[] = useMemo(
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
        header: 'Model',
        cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
      },
      {
        accessorKey: 'model',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Model name
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const model = String(row.getValue('model'))
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="lowercase overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px] group cursor-pointer">
                    {model}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64">{model}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: 'details.parameter_size', // Access the nested property directly
        header: 'Parameter Size',
        cell: ({ row }) => {
          const details: ModelDetails = row.original.details // Access from row.original
          const parameterSize = details?.parameter_size || 'N/A' //Provide default value
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center font-medium overflow-hidden text-ellipsis whitespace-nowrap group cursor-pointer">
                    {parameterSize}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="w-64">{parameterSize}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const ollamModel = row.original

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setDeleteModel(ollamModel.name)
                  }}
                >
                  Uninstall Model
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  const table = useReactTable<OllamaModelResponse>({
    data: ollamaModels || [],
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

  return (
    <div className="w-full flex flex-col px-4 md:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <Label htmlFor="OllamaModels" className="text-lg font-semibold tracking-tight text-primary">
          Ollama Models
        </Label>
        <Button
          variant="outline"
          onClick={() => {
            setInstallation((prev) => !prev)
          }}
        >
          Install Models
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <Separator />
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter ollama models..."
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

          {installation && (
            <InstallModal
              isOpen={installation}
              onClose={() => {
                setInstallation(false)
              }}
            />
          )}
          {deleteModel && (
            <DeleteModelModal
              modelName={deleteModel}
              open={true}
              onClose={() => setDeleteModel(undefined)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default OllamaModelPage
