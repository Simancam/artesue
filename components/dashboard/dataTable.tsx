"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PropertyForm } from "./propertyForm"
import type { PropertyFormValues } from "@/lib/schema/property-schema"

// Componentes auxiliares para mejorar la legibilidad
const TableActionButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="bg-amber-400 hover:bg-amber-400/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
  >
    <span>{children}</span>
    <Plus className="h-4 w-4" />
  </button>
)

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const getPageNumbers = () => {
    const pageNumbers = []
    pageNumbers.push(1)
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 2)
    
    if (rangeStart > 2) pageNumbers.push("...")
    for (let i = rangeStart; i <= rangeEnd; i++) pageNumbers.push(i)
    if (rangeEnd < totalPages - 1) pageNumbers.push("...")
    if (totalPages > 1) pageNumbers.push(totalPages)
    
    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center py-5 border-t">
      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-all ${
                currentPage === page ? "bg-amber-400 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="text-gray-400 px-1">
              {page}
            </span>
          )
        )}
      </div>
    </div>
  )
}

const StatusAlert = ({ 
  alert 
}: { 
  alert: { type: "success" | "error"; visible: boolean; message: string } 
}) => (
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
)

interface DataTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessor: keyof T | ((item: T) => React.ReactNode)
    align?: "left" | "center" | "right"
  }[]
  title: string
  buttonText?: string
  onButtonClick?: () => void
  buttonHref?: string
  currentPage: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  renderActions?: (item: T) => React.ReactNode
  onPropertyAdded?: (property: PropertyFormValues) => void
}

export function DataTable<T>({
  data,
  columns,
  title,
  buttonText = "Nuevo",
  onButtonClick,
  buttonHref,
  currentPage,
  onPageChange,
  itemsPerPage = 4,
  renderActions,
  onPropertyAdded,
}: DataTableProps<T>) {
  const router = useRouter()
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const [open, setOpen] = useState(false)
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    visible: boolean
    message: string
  }>({ type: "success", visible: false, message: "" })

  const handleLegacyButtonClick = () => {
    if (buttonHref) router.push(buttonHref)
    else if (onButtonClick) onButtonClick()
    else setOpen(true)
  }

  const showTemporaryAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, visible: true, message })
    setTimeout(() => setAlert(prev => ({ ...prev, visible: false })), 3000)
  }

  const handleSuccess = (data: PropertyFormValues) => {
    showTemporaryAlert("success", "La propiedad ha sido añadida correctamente.")
    setOpen(false)
    if (onPropertyAdded) onPropertyAdded(data)
  }

  const handleError = () => {
    showTemporaryAlert("error", "Ha ocurrido un error al añadir la propiedad. Inténtalo de nuevo.")
  }

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center": return "text-center"
      case "right": return "text-right"
      default: return "text-left"
    }
  }

  return (
    <>
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {buttonText && <TableActionButton onClick={handleLegacyButtonClick}>{buttonText}</TableActionButton>}
        </div>
        
        <div className="bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`py-3 px-4 font-semibold text-gray-700 ${getAlignClass(column.align)}`}
                  >
                    {column.header}
                  </TableHead>
                ))}
                {renderActions && (
                  <TableHead className="py-3 px-4 text-center font-semibold text-gray-700">Acciones</TableHead>
                )}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {currentData.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-gray-50 transition-colors border-b last:border-b-0">
                  {columns.map((column, colIndex) => {
                    const value = typeof column.accessor === "function" 
                      ? column.accessor(item) 
                      : item[column.accessor as keyof T]

                    return (
                      <TableCell
                        key={colIndex}
                        className={`py-3 px-4 ${column.accessor === "nombre" ? "font-medium text-gray-900" : "text-gray-700"} ${getAlignClass(column.align)}`}
                      >
                        {value as React.ReactNode}
                      </TableCell>
                    )
                  })}
                  {renderActions && <TableCell className="py-3 px-4 text-center">{renderActions(item)}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />}
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