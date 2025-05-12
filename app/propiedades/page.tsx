"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import EstatesFilter from "@/components/estates/estatesFilter"
import { EstateCard } from "@/components/estates/estateCard"
import Banner from "@/components/banner"
import { EstatesService, type IEstate } from "@/services/estatesService"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { EstateDetails } from "@/components/estates/estateDetails"

interface ProcessedFilters {
  transactionType?: string
  city?: string
  minArea?: number
  maxArea?: number
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  isForRent?: boolean
  propertyCode?: string
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
}

// Datos de ejemplo para mostrar mientras se carga o si hay error
const mockEstates: IEstate[] = [
  {
    id: "mock-1",
    title: "Propiedad de Ejemplo 1",
    location: "Av. Principal 123",
    type: "Casa",
    price: 250000,
    isForRent: false,
    area: 120,
    features: ["Terraza", "Jardín", "Estacionamiento"],
    bedrooms: 3,
    bathrooms: 2,
    propertyCode: "PROP001",
    city: "Ciudad Ejemplo",
  },
  {
    id: "mock-2",
    title: "Departamento en Renta",
    location: "Calle Secundaria 456",
    type: "Departamento",
    price: 1200,
    isForRent: true,
    area: 75,
    features: ["Amueblado", "Seguridad 24h", "Gimnasio"],
    bedrooms: 2,
    bathrooms: 1,
    propertyCode: "PROP002",
    city: "Ciudad Ejemplo",
  },
]

const Propiedades = () => {
  const [estates, setEstates] = useState<IEstate[]>([])
  const [filteredEstates, setFilteredEstates] = useState<IEstate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEstate, setSelectedEstate] = useState<IEstate | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)

  // Función para cargar los datos iniciales
  useEffect(() => {
    const loadEstates = async () => {
      try {
        setLoading(true)

        // Verificamos si la variable de entorno está definida
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
          console.warn("NEXT_PUBLIC_API_BASE_URL no está definida. Usando datos de prueba.")
          setEstates(mockEstates)
          setFilteredEstates(mockEstates)
          setUseMockData(true)
          setError("API no configurada. Mostrando datos de ejemplo.")
          return
        }

        // Intentamos obtener los datos reales usando el servicio
        console.log("Intentando cargar datos reales desde la API...")
        const data = await EstatesService.getAllEstates()
        console.log("Datos recibidos de la API:", data)

        // Si hay datos reales, los usamos
        if (data && data.length > 0) {
          console.log("Datos reales cargados correctamente:", data)
          setEstates(data)
          setFilteredEstates(data)
          setUseMockData(false)
          setError(null)
        } else {
          // Si no hay datos reales, usamos los datos de prueba
          console.warn("No se obtuvieron datos reales. Usando datos de prueba.")
          setEstates(mockEstates)
          setFilteredEstates(mockEstates)
          setUseMockData(true)
          setError("No se encontraron propiedades en la base de datos. Mostrando ejemplos.")
        }
      } catch (e) {
        console.error("Error al cargar propiedades:", e)
        setEstates(mockEstates)
        setFilteredEstates(mockEstates)
        setUseMockData(true)
        setError("Error al cargar datos reales. Mostrando ejemplos.")
      } finally {
        setLoading(false)
      }
    }

    loadEstates()
  }, [])

  const handleFilterChange = async (filters: ProcessedFilters) => {
    try {
      setLoading(true)

      // Si estamos usando datos de ejemplo, filtramos en cliente
      if (useMockData) {
        let filtered = [...estates]

        // Aplicamos cada filtro si está presente
        if (filters.isForRent !== undefined) {
          filtered = filtered.filter((estate) => estate.isForRent === filters.isForRent)
        }

        if (filters.city) {
          filtered = filtered.filter((estate) => estate.city?.toLowerCase().includes(filters.city!.toLowerCase()))
        }

        if (filters.propertyType) {
          filtered = filtered.filter((estate) => estate.type?.toLowerCase() === filters.propertyType!.toLowerCase())
        }

        if (filters.propertyCode) {
          filtered = filtered.filter((estate) =>
            estate.propertyCode?.toLowerCase().includes(filters.propertyCode!.toLowerCase()),
          )
        }

        if (filters.minArea) {
          filtered = filtered.filter((estate) => estate.area >= filters.minArea!)
        }

        if (filters.maxArea) {
          filtered = filtered.filter((estate) => estate.area <= filters.maxArea!)
        }

        if (filters.minBedrooms) {
          filtered = filtered.filter((estate) => (estate.bedrooms || 0) >= filters.minBedrooms!)
        }

        if (filters.maxBedrooms) {
          filtered = filtered.filter((estate) => (estate.bedrooms || 0) <= filters.maxBedrooms!)
        }

        if (filters.minBathrooms) {
          filtered = filtered.filter((estate) => (estate.bathrooms || 0) >= filters.minBathrooms!)
        }

        if (filters.maxBathrooms) {
          filtered = filtered.filter((estate) => (estate.bathrooms || 0) <= filters.maxBathrooms!)
        }

        if (filters.minPrice) {
          filtered = filtered.filter((estate) => estate.price >= filters.minPrice!)
        }

        if (filters.maxPrice) {
          filtered = filtered.filter((estate) => estate.price <= filters.maxPrice!)
        }

        setFilteredEstates(filtered)
      } else {
        // Si usamos datos reales, usamos el servicio para filtrar
        try {
          // Convertimos transactionType a isForRent para la API
          const apiFilters = { ...filters }
          if (filters.transactionType) {
            apiFilters.isForRent = filters.transactionType === "rent"
            delete apiFilters.transactionType
          }

          const filteredData = await EstatesService.filterEstates(apiFilters)
          setFilteredEstates(filteredData)
        } catch (error) {
          console.error("Error al filtrar propiedades con la API:", error)

          // Si falla la API, filtramos en cliente como respaldo
          let filtered = [...estates]

          // Aplicamos los mismos filtros que arriba
          if (filters.isForRent !== undefined) {
            filtered = filtered.filter((estate) => estate.isForRent === filters.isForRent)
          } else if (filters.transactionType) {
            const isRent = filters.transactionType === "rent"
            filtered = filtered.filter((estate) => estate.isForRent === isRent)
          }

          // Resto de filtros igual que arriba...
          if (filters.city) {
            filtered = filtered.filter((estate) => estate.city?.toLowerCase().includes(filters.city!.toLowerCase()))
          }

          // Aplicamos el resto de filtros...

          setFilteredEstates(filtered)
        }
      }
    } catch (error) {
      console.error("Error al aplicar filtros:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEstateClick = async (id: string) => {
    try {
      setDetailsLoading(true)

      let estateDetails: IEstate | null = null

      // Si usamos datos de ejemplo, buscamos en el array local
      if (useMockData) {
        estateDetails = estates.find((estate) => estate.id === id) || null
      } else {
        // Si usamos datos reales, usamos el servicio
        try {
          estateDetails = await EstatesService.getEstateById(id)
        } catch (error) {
          console.error(`Error al obtener detalles de la API para ID ${id}:`, error)
          // Si falla, buscamos en el array local como respaldo
          estateDetails = estates.find((estate) => estate.id === id) || null
        }
      }

      if (estateDetails) {
        setSelectedEstate(estateDetails)
      } else {
        console.error("No se encontraron detalles para la propiedad")
      }
    } catch (error) {
      console.error("Error al cargar detalles de la propiedad:", error)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => {
    setSelectedEstate(null)
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

            {useMockData && (
              <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Usando datos de ejemplo
              </div>
            )}
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
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEstates.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEstates.map((estate) => (
                <EstateCard key={estate.id} estate={estate} />
              ))}
            </div>
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

      {selectedEstate && (
        <Dialog open={!!selectedEstate} onOpenChange={(open) => !open && closeDetails()}>
          <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[700px]">
            <DialogTitle>Detalles de la Propiedad</DialogTitle>
            <EstateDetails estate={selectedEstate} />
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </>
  )
}

export default Propiedades
