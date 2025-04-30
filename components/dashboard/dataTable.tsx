"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

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
}: DataTableProps<T>) {
  const router = useRouter()
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data.slice(startIndex, endIndex)

  const handleButtonClick = () => {
    if (buttonHref) {
      router.push(buttonHref)
    } else if (onButtonClick) {
      onButtonClick()
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    pageNumbers.push(1)
    const rangeStart = Math.max(2, currentPage - 1)
    const rangeEnd = Math.min(totalPages - 1, currentPage + 2)
    if (rangeStart > 2) {
      pageNumbers.push("...")
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i)
    }

    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("...")
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      default:
        return "text-left"
    }
  }

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <div className="bg-white px-6 py-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {buttonText && (
          <button
            onClick={handleButtonClick}
            className="bg-amber-400 hover:bg-amber-400/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span>{buttonText}</span>
            <Plus className="h-4 w-4" />
          </button>
        )}
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
                  const value =
                    typeof column.accessor === "function" ? column.accessor(item) : item[column.accessor as keyof T]

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

        {totalPages > 0 && (
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
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}