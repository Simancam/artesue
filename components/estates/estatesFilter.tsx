"use client"

import { useState } from "react"
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

interface FilterValues {
  transactionType: string
  city: string
  minArea: string
  maxArea: string
  propertyType: string
  minPrice: string
  maxPrice: string
  // Nuevos campos
  minBedrooms: string
  maxBedrooms: string
  minBathrooms: string
  maxBathrooms: string
  propertyCode: string
}

interface ProcessedFilters {
  transactionType?: string
  city?: string
  minArea?: number
  maxArea?: number
  propertyType?: string
  minPrice?: number
  maxPrice?: number
  // Nuevos campos
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  propertyCode?: string
}

const COLOMBIAN_CITIES = [
  "Bogotá D.C.",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Pereira",
  "Santa Marta",
  "Cúcuta",
  "Ibagué",
  "Manizales",
  "Villavicencio",
]

const PROPERTY_TYPES = ["Comercial", "Residencial", "Industrial", "Agrícola", "Turístico"]

interface EstatesFilterProps {
  onFilterChange: (filters: ProcessedFilters) => void
}

export default function EstatesFilter({ onFilterChange }: EstatesFilterProps) {
  const initialFilters: FilterValues = {
    transactionType: "",
    city: "",
    minArea: "",
    maxArea: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    // Inicialización de nuevos campos
    minBedrooms: "",
    maxBedrooms: "",
    minBathrooms: "",
    maxBathrooms: "",
    propertyCode: "",
  }
  const [filters, setFilters] = useState<FilterValues>(initialFilters)

  const handleInputChange = (name: keyof FilterValues, value: string) =>
    setFilters((prev) => ({ ...prev, [name]: value }))

  const handleSubmitFilters = () => {
    const processed: ProcessedFilters = {
      transactionType: filters.transactionType || undefined,
      city: filters.city || undefined,
      minArea: filters.minArea ? Number.parseInt(filters.minArea) : undefined,
      maxArea: filters.maxArea ? Number.parseInt(filters.maxArea) : undefined,
      propertyType: filters.propertyType || undefined,
      minPrice: filters.minPrice ? Number.parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number.parseInt(filters.maxPrice) : undefined,
      // Procesamiento de nuevos campos
      minBedrooms: filters.minBedrooms ? Number.parseInt(filters.minBedrooms) : undefined,
      maxBedrooms: filters.maxBedrooms ? Number.parseInt(filters.maxBedrooms) : undefined,
      minBathrooms: filters.minBathrooms ? Number.parseInt(filters.minBathrooms) : undefined,
      maxBathrooms: filters.maxBathrooms ? Number.parseInt(filters.maxBathrooms) : undefined,
      propertyCode: filters.propertyCode || undefined,
    }
    Object.keys(processed).forEach((k) => {
      const key = k as keyof ProcessedFilters
      if (processed[key] === undefined) delete processed[key]
    })
    onFilterChange(processed)
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
    onFilterChange({})
  }

  return (
    <div className="w-full py-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Buscar Propiedades</h2>

          {/* Primera fila: Tipo de transacción, Ciudad, Tipo de propiedad, Código */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {/* Transaction Type */}
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

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700">
                Ciudad
              </Label>
              <Select value={filters.city} onValueChange={(value) => handleInputChange("city", value)}>
                <SelectTrigger id="city" className="w-full">
                  <SelectValue placeholder="Seleccionar ciudad" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectGroup>
                    <SelectLabel>Ciudades Principales</SelectLabel>
                    {COLOMBIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Property Type */}
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

            {/* Property Code */}
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
            {/* Area Range */}
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

            {/* Bedrooms Range */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-gray-700">
                Habitaciones
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="minBedrooms"
                  type="number"
                  placeholder="Mín"
                  value={filters.minBedrooms}
                  onChange={(e) => handleInputChange("minBedrooms", e.target.value)}
                  className="w-1/2"
                />
                <Input
                  id="maxBedrooms"
                  type="number"
                  placeholder="Máx"
                  value={filters.maxBedrooms}
                  onChange={(e) => handleInputChange("maxBedrooms", e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>

            {/* Bathrooms Range */}
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-gray-700">
                Baños
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="minBathrooms"
                  type="number"
                  placeholder="Mín"
                  value={filters.minBathrooms}
                  onChange={(e) => handleInputChange("minBathrooms", e.target.value)}
                  className="w-1/2"
                />
                <Input
                  id="maxBathrooms"
                  type="number"
                  placeholder="Máx"
                  value={filters.maxBathrooms}
                  onChange={(e) => handleInputChange("maxBathrooms", e.target.value)}
                  className="w-1/2"
                />
              </div>
            </div>

            {/* Price Range */}
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
