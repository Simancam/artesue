"use client"

import { useState, useEffect, useCallback } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EstatesFilter, { type EstateFilters } from "@/components/estates/estatesFilter"
import { EstateCard } from "@/components/estates/estateCard"
import { EstateGridSkeleton } from "@/components/estates/estateSkeletons"
import Banner from "@/components/banner"
import { EstatesService, type IEstate } from "@/services/estatesService"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Propiedades = () => {
  const [estates, setEstates] = useState<IEstate[]>([])
  const [filteredEstates, setFilteredEstates] = useState<IEstate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const loadEstates = async () => {
      try {
        setLoading(true)

        if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
          setError("API no configurada. No se pueden cargar propiedades.")
          setLoading(false)
          return
        }

        try {
          const data = await EstatesService.getAllEstates()

          if (data && data.length > 0) {
            setEstates(data)
            setFilteredEstates(data)
            setError(null)
          } else {
            setError("No se encontraron propiedades en la base de datos.")
          }
        } catch {
          setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.")
        }
      } catch {
        setError("Error al cargar datos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadEstates()
  }, [])

  const filterProperties = useCallback((allEstates: IEstate[], filters: EstateFilters) => {
    const hasActiveFilters = Object.values(filters).some((value) => value !== "")
    if (!hasActiveFilters) return allEstates

    const matchesNumberFilter = (value: number | undefined, filterValue: string, isMin: boolean): boolean => {
      if (!filterValue) return true
      if (value === undefined) return false
      const numValue = Number(filterValue)
      return isNaN(numValue) ? true : isMin ? value >= numValue : value <= numValue
    }

    return allEstates.filter((estate) => {
      if (filters.transactionType === "rent" && !estate.isForRent) return false
      if (filters.transactionType === "buy" && estate.isForRent) return false
      if (filters.city && estate.city !== filters.city) return false
      if (filters.propertyType && estate.type !== filters.propertyType) return false
      if (filters.propertyCode && !estate.propertyCode?.toLowerCase().includes(filters.propertyCode.toLowerCase())) return false
      if (!matchesNumberFilter(estate.area, filters.minArea, true)) return false
      if (!matchesNumberFilter(estate.area, filters.maxArea, false)) return false
      if (filters.bedrooms && estate.bedrooms !== Number(filters.bedrooms)) return false
      if (filters.bathrooms && estate.bathrooms !== Number(filters.bathrooms)) return false
      if (!matchesNumberFilter(estate.price, filters.minPrice, true)) return false
      if (!matchesNumberFilter(estate.price, filters.maxPrice, false)) return false
      return true
    })
  }, [])

  const handleFilterChange = useCallback(
    (filters: EstateFilters) => {
      setLoading(true)
      try {
        const filtered = filterProperties(estates, filters)
        setFilteredEstates(filtered)
        setCurrentPage(1)
      } catch {
        setError("Error al aplicar filtros. Mostrando todas las propiedades.")
        setFilteredEstates(estates)
      } finally {
        setLoading(false)
      }
    },
    [estates, filterProperties]
  )

  const totalPages = Math.ceil(filteredEstates.length / itemsPerPage)

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredEstates.slice(startIndex, startIndex + itemsPerPage)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i)
        pageNumbers.push(null)
        pageNumbers.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1)
        pageNumbers.push(null)
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i)
      } else {
        pageNumbers.push(1)
        pageNumbers.push(null)
        pageNumbers.push(currentPage - 1)
        pageNumbers.push(currentPage)
        pageNumbers.push(currentPage + 1)
        pageNumbers.push(null)
        pageNumbers.push(totalPages)
      }
    }
    return pageNumbers
  }

  return (
    <>
      <Navbar />
      <Banner imageUrl="/banner.jpg" height="50vh">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Explora Nuestros Lotes Disponibles
          </h1>
          <p className="mt-4 text-lg text-white drop-shadow-md">Elige el lugar perfecto para tu proyecto</p>
        </div>
      </Banner>

      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <EstatesFilter onFilterChange={handleFilterChange} />
      </div>

      <section className="py-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {filteredEstates.length === estates.length
                ? "Propiedades Disponibles"
                : `Propiedades Filtradas (${filteredEstates.length})`}
            </h2>
          </div>

          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <EstateGridSkeleton count={6} />
          ) : filteredEstates.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getCurrentPageItems().map((estate) => (
                  <EstateCard key={estate.id} estate={estate} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) handlePageChange(currentPage - 1)
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {getPageNumbers().map((pageNumber, index) =>
                        pageNumber === null ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={`page-${pageNumber}`}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNumber as number)
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage < totalPages) handlePageChange(currentPage + 1)
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-500">
                No se encontraron propiedades con los filtros aplicados
              </h3>
              <p className="mt-2 text-gray-400">Intenta ajustar los criterios de búsqueda</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Propiedades