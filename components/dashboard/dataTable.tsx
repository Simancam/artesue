"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, CheckCircle, AlertCircle, ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PropertyForm } from "./propertyForm"
import type { PropertyFormValues } from "@/lib/schema/property-schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const TableActionButton = ({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    onClick={onClick}
    className="bg-amber-400 hover:bg-amber-400/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
  >
    <span>{children}</span>
    <Plus className="h-4 w-4" />
  </button>
)

const StatusAlert = ({
  alert,
}: {
  alert: { type: "success" | "error"; visible: boolean; message: string }
}) =>
  alert.visible && (
    <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
      <Alert
        className={`shadow-lg max-w-md ${
          alert.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
        }`}
      >
        {alert.type === "success" ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-500" />
        )}
        <AlertTitle className={alert.type === "success" ? "text-green-700" : "text-red-700"}>
          {alert.type === "success" ? "Propiedad añadida" : "Error"}
        </AlertTitle>
        <AlertDescription className={alert.type === "success" ? "text-green-600" : "text-red-600"}>
          {alert.message}
        </AlertDescription>
      </Alert>
    </div>
  )

export type EnhancedColumn<T> = ColumnDef<T>

export interface EnhancedDataTableProps<T> {
  data: T[]
  columns: EnhancedColumn<T>[]
  title: string
  buttonText?: string
  onButtonClick?: () => void
  buttonHref?: string
  filterColumn?: string
  filterPlaceholder?: string
  onPropertyAdded?: (property: PropertyFormValues) => void
  itemsPerPage?: number
}

export function EnhancedDataTable<T>({
  data,
  columns,
  title,
  buttonText = "Nuevo",
  onButtonClick,
  buttonHref,
  filterColumn,
  filterPlaceholder = "Filtrar...",
  onPropertyAdded,
  itemsPerPage = 5,
}: EnhancedDataTableProps<T>) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    visible: boolean
    message: string
  }>({ type: "success", visible: false, message: "" })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: itemsPerPage,
      },
    },
  })

  const handleLegacyButtonClick = () => {
    if (buttonHref) router.push(buttonHref)
    else if (onButtonClick) onButtonClick()
    else setOpen(true)
  }

  const showTemporaryAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, visible: true, message })
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
  }

  const handleSuccess = (data: PropertyFormValues) => {
    showTemporaryAlert("success", "La propiedad ha sido añadida correctamente.")
    setOpen(false)
    if (onPropertyAdded) onPropertyAdded(data)
  }

  const handleError = () => {
    showTemporaryAlert("error", "Ha ocurrido un error al añadir la propiedad. Inténtalo de nuevo.")
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {buttonText && <TableActionButton onClick={handleLegacyButtonClick}>{buttonText}</TableActionButton>}
        </div>

        <div className="bg-white p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            {filterColumn && (
              <Input
                placeholder={filterPlaceholder}
                value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn(filterColumn)?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            )}

            <div className="flex gap-2 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    Columnas <ChevronDown className="h-4 w-4" />
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
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-50 border-b">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="py-3 px-4 font-semibold text-gray-700">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 px-4 text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No hay resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex-1 text-sm text-gray-500">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
                  seleccionada(s).
                </span>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-500">
                Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-4 py-2 text-sm"
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-4 py-2 text-sm"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] md:max-w-[1600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Propiedad</DialogTitle>
            <DialogDescription>Complete el formulario para añadir una nueva propiedad al sistema.</DialogDescription>
          </DialogHeader>
          <PropertyForm onSuccess={handleSuccess} onError={handleError} />
        </DialogContent>
      </Dialog>

      <StatusAlert alert={alert} />
    </>
  )
}
export function createColumn<T>(
  id: string,
  header: string,
  accessorFn: (row: T) => unknown, // ✅ Cambiado 'any' por 'unknown'
  options?: {
    sortable?: boolean
    align?: "left" | "center" | "right"
    cell?: (value: ReturnType<typeof accessorFn>, row: T) => React.ReactNode // ✅ Tipado dinámico del valor
    enableHiding?: boolean
  },
): EnhancedColumn<T> {
  const defaultOptions = {
    sortable: false,
    align: "left" as const,
    enableHiding: true,
    cell: undefined,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  const column: EnhancedColumn<T> = {
    id,
    accessorFn,
    enableHiding: mergedOptions.enableHiding,
  }

  if (mergedOptions.sortable) {
    column.header = ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-semibold flex items-center gap-1"
      >
        {header}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    )
  } else {
    column.header = header
  }

  if (mergedOptions.cell) {
    column.cell = ({ row }) => {
      const value = accessorFn(row.original)
      return mergedOptions.cell!(value as ReturnType<typeof accessorFn>, row.original) // ✅ cast explícito si es necesario
    }
  }

  column.meta = {
    align: mergedOptions.align,
  }

  return column
}

export function createSelectColumn<T>(): EnhancedColumn<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

// Asegúrate de que la función createActionsColumn pase correctamente los datos de la fila al hacer clic en "Editar"

export function createActionsColumn<T>(
  actions: Array<{
    label: string
    onClick: (row: T) => void
    separator?: boolean
    isHeader?: boolean
  }>,
): EnhancedColumn<T> {
  return {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, index) => {
              if (action.isHeader) {
                return <DropdownMenuLabel key={index}>{action.label}</DropdownMenuLabel>
              }

              return (
                <React.Fragment key={index}>
                  {action.separator && <DropdownMenuSeparator />}
                  <DropdownMenuItem onClick={() => action.onClick(item)}>{action.label}</DropdownMenuItem>
                </React.Fragment>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  }
}
