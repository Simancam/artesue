"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EstatesService } from "@/services/estatesService"

// Interfaz simplificada para los filtros
export interface EstateFilters {
  transactionType: string
  city: string
  minArea: string
  maxArea: string
  propertyType: string
  minPrice: string
  maxPrice: string
  bedrooms: string
  bathrooms: string
  propertyCode: string
}

// Lista de tipos de propiedad para el dropdown
const PROPERTY_TYPES = ["Comercial", "Residencial", "Industrial", "Agrícola", "Turístico"]

// Props para el componente EstatesFilter
interface EstatesFilterProps {
  onFilterChange: (filters: EstateFilters) => void
}

export default function EstatesFilter({ onFilterChange }: EstatesFilterProps) {
  // Estado inicial de los filtros
  const initialFilters: EstateFilters = {
    transactionType: "",
    city: "",
    minArea: "",
    maxArea: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    propertyCode: "",
  }

  // Estado para almacenar los valores actuales de los filtros
  const [filters, setFilters] = useState<EstateFilters>(initialFilters)

  // Estado para almacenar las ciudades disponibles
  const [availableCities, setAvailableCities] = useState<string[]>([])

  // Estado para controlar la carga de ciudades
  const [loadingCities, setLoadingCities] = useState(true)

  // Cargar las ciudades disponibles desde la API
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true)

        // Intentar cargar todas las propiedades para extraer las ciudades
        const estates = await EstatesService.getAllEstates()

        if (estates && estates.length > 0) {
          // Extraer ciudades únicas de las propiedades
          const cities = [...new Set(estates.map((estate) => estate.city).filter((city): city is string => Boolean(city)))]

          // Ordenar alfabéticamente
          cities.sort()

          setAvailableCities(cities)
        } else {
          setAvailableCities([])
        }
      } catch {
        setAvailableCities([])
      } finally {
        setLoadingCities(false)
      }
    }

    loadCities()
  }, [])

  // Manejador para cambios en los inputs
  const handleInputChange = (name: keyof EstateFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Manejador para aplicar los filtros
  const handleSubmitFilters = () => {
    // Notificar al componente padre con los filtros actuales
    onFilterChange(filters)
  }

  // Manejador para resetear los filtros
  const handleResetFilters = () => {
    // Primero actualizamos el estado local
    setFilters(initialFilters)
    // Luego notificamos al componente padre
    setTimeout(() => {
      onFilterChange(initialFilters)
    }, 0)
  }

  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Buscar Propiedades</h2>

          {/* Primera fila: Tipo de transacción, Ciudad, Tipo de propiedad, Código de propiedad */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Tipo de transacción */}
            <div className="space-y-2">
              <Label htmlFor="transactionType" className="text-gray-700">
                Tipo de transacción
              </Label>
              <Select
                value={filters.transactionType}
                onValueChange={(value) => handleInputChange("transactionType", value)}
              >
                <SelectTrigger id="transactionType" className="w-full">
                  <SelectValue placeholder="Comprar o arrendar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Comprar</SelectItem>
                  <SelectItem value="rent">Arrendar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ciudad */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700">
                Ciudad
              </Label>
              <Select
                value={filters.city}
                onValueChange={(value) => handleInputChange("city", value)}
                disabled={loadingCities || availableCities.length === 0}
              >
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder={loadingCities ? "Cargando ciudades..." : "Seleccionar ciudad"} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>Ciudades Disponibles</SelectLabel>
                    {availableCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de propiedad */}
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-gray-700">
                Tipo de propiedad
              </Label>
              <Select value={filters.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger id="propertyType" className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Código de propiedad */}
            <div className="space-y-2">
              <Label htmlFor="propertyCode" className="text-gray-700">
                Código de propiedad
              </Label>
              <Input
                id="propertyCode"
                type="text"
                placeholder="Ej: PROP-12345"
                value={filters.propertyCode}
                onChange={(e) => handleInputChange("propertyCode", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Segunda fila: Área, Habitaciones, Baños, Precio */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Rango de área */}
            <div className="space-y-2">
              <Label htmlFor="area" className="text-gray-700">
                Área (m²)
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="minArea"
                  type="number"
                  placeholder="Mín"
                  value={filters.minArea}
                  onChange={(e) => handleInputChange("minArea", e.target.value)}
                  className="w-1/2"
                />
                <Input
                  id="maxArea"
                  type="number"
                  placeholder="Máx"
                  value={filters.maxArea}
                  onChange={(e) => handleInputChange("maxArea", e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>

            {/* Habitaciones */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-gray-700">
                Habitaciones
              </Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="Número"
                value={filters.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Baños */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-gray-700">
                Baños
              </Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="Número"
                value={filters.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Rango de precio */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700">
                Precio (COP)
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="Mín"
                  value={filters.minPrice}
                  onChange={(e) => handleInputChange("minPrice", e.target.value)}
                  className="w-1/2"
                />
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="Máx"
                  value={filters.maxPrice}
                  onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleResetFilters} className="px-6">
              Limpiar filtros
            </Button>
            <Button onClick={handleSubmitFilters} className="px-6 bg-amber-400 hover:bg-amber-500">
              Aplicar filtros
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
