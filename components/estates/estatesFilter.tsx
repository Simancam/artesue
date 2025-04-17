"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterValues {
  transactionType: string;
  city: string;
  minArea: string;
  maxArea: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
}

interface ProcessedFilters {
  transactionType?: string;
  city?: string;
  minArea?: number;
  maxArea?: number;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
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
];

const PROPERTY_TYPES = ["Comercial", "Residencial", "Industrial", "Agrícola", "Turístico"];

interface EstatesFilterProps {
  onFilterChange: (filters: ProcessedFilters) => void;
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
  };
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const handleInputChange = (name: keyof FilterValues, value: string) =>
    setFilters(prev => ({ ...prev, [name]: value }));

  const handleSubmitFilters = () => {
    const processed: ProcessedFilters = {
      transactionType: filters.transactionType || undefined,
      city: filters.city || undefined,
      minArea: filters.minArea ? parseInt(filters.minArea) : undefined,
      maxArea: filters.maxArea ? parseInt(filters.maxArea) : undefined,
      propertyType: filters.propertyType || undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
    };
    Object.keys(processed).forEach(k => {
      const key = k as keyof ProcessedFilters;
      if (processed[key] === undefined) delete processed[key];
    });
    onFilterChange(processed);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    onFilterChange({});
  };

  /**
   * Renderiza los campos de filtro de tipo y ciudad
   */
  const renderTypeAndCityFilters = () => (
    <>
      {/* Transaction Type */}
      <div className="space-y-2">
        <Label htmlFor="transactionType">¿Comprar o arrendar?</Label>
        <Select
          value={filters.transactionType}
          onValueChange={(value) =>
            handleInputChange("transactionType", value)
          }
        >
          <SelectTrigger id="transactionType" className="w-full">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="buy">Comprar</SelectItem>
            <SelectItem value="rent">Arrendar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">Ciudad</Label>
        <Select
          value={filters.city}
          onValueChange={(value) =>
            handleInputChange("city", value)
          }
        >
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
    </>
  )

  /**
   * Renderiza los campos de filtro de área y tipo de propiedad
   */
  const renderAreaAndPropertyTypeFilters = () => (
    <>
      {/* Area Range */}
      <div className="space-y-2">
        <Label htmlFor="area">Área (m²)</Label>
        <div className="flex space-x-2">
          <div className="relative w-1/2">
            <Input
              id="minArea"
              type="number"
              placeholder="Mínimo"
              value={filters.minArea}
              onChange={(e) => handleInputChange("minArea", e.target.value)}
            />
          </div>
          <div className="relative w-1/2">
            <Input
              id="maxArea"
              type="number"
              placeholder="Máximo"
              value={filters.maxArea}
              onChange={(e) => handleInputChange("maxArea", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <Label htmlFor="propertyType">Tipo</Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) =>
            handleInputChange("propertyType", value)
          }
        >
          <SelectTrigger id="propertyType" className="w-full">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )

  /**
   * Renderiza los campos de filtro de precio
   */
  const renderPriceFilter = () => (
    <div className="space-y-2">
      <Label htmlFor="price">Precio (COP)</Label>
      <div className="flex space-x-2">
        <div className="relative w-1/2">
          <Input
            id="minPrice"
            type="number"
            placeholder="Mínimo"
            value={filters.minPrice}
            onChange={(e) => handleInputChange("minPrice", e.target.value)}
          />
        </div>
        <div className="relative w-1/2">
          <Input
            id="maxPrice"
            type="number"
            placeholder="Máximo"
            value={filters.maxPrice}
            onChange={(e) => handleInputChange("maxPrice", e.target.value)}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-transparent">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {renderTypeAndCityFilters()}
            {renderAreaAndPropertyTypeFilters()}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
            {renderPriceFilter()}

            <div className="md:col-span-2 flex justify-end gap-2 self-end">
              <Button variant="outline" onClick={handleResetFilters}>
                Limpiar filtros
              </Button>
              <Button onClick={handleSubmitFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}