"use client"

import React, { useState } from "react"
import { EnhancedDataTable, createColumn, createSelectColumn, createActionsColumn } from "@/components/dashboard/dataTable"
import { StatCard } from "@/components/dashboard/statCard"
import { Home, Tags, Building } from "lucide-react"
import estatesData from "@/data/estates-data.json"
import type { PropertyFormValues } from "@/lib/schema/property-schema"

interface Estate {
  id: string
  title: string
  location: string
  type: string
  price: number
  isForRent: boolean
  area: number
  images: string[]
  videoUrl: string
  features: string[]
  description: string
  zoning: string
  utilities: string[]
  agent: {
    name: string
    phone: string
    email: string
  }
  documents: string[]
  coordinates: {
    lat: number
    lng: number
  }
  createdAt: string
}

export default function DashboardPage() {
  const [estates, setEstates] = useState<Estate[]>(estatesData.estates)

  const totalProperties = estates.length
  const propertiesForRent = estates.filter((p) => p.isForRent).length
  const propertiesForSale = estates.filter((p) => !p.isForRent).length

  const handlePropertyAdded = (property: PropertyFormValues) => {
    const newProperty: Estate = {
      ...property,
      id: `est-${(estates.length + 1).toString().padStart(3, "0")}`,
      images: ["/placeholder.svg?height=300&width=400"],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      features: [],
      description: "",
      zoning: "",
      utilities: [],
      agent: { name: "", phone: "", email: "" },
      documents: [],
      coordinates: { lat: 0, lng: 0 },
      createdAt: new Date().toLocaleDateString("es-ES"),
    }

    setEstates((prev) => [...prev, newProperty])
  }

  const columns = [
    createSelectColumn<Estate>(),
    createColumn<Estate>("title", "Nombre", (row) => row.title, { sortable: true }),
    createColumn<Estate>("type", "Tipo", (row) => row.type),
    createColumn<Estate>("status", "Estado", (row) => row.isForRent ? "Arriendo" : "Venta", {
      align: "center",
      cell: (value: unknown, row) => {
        const isRent = row.isForRent
        const color = isRent ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{String(value)}</span>
      }
    }),
    createColumn<Estate>("price", "Precio", (row) => row.price, {
      align: "right",
      cell: (_: unknown, row) => {
        const formatted = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(row.price)
        return row.isForRent ? `${formatted}/mes` : formatted
      }
    }),
    createColumn<Estate>("area", "Superficie", (row) => row.area, {
      align: "right",
      cell: (value: unknown) => `${value} m²`
    }),
    createColumn<Estate>("location", "Ubicación", (row) => row.location, {
      cell: (value: unknown) => {
        const city = (value as string).split(",").slice(-1)[0].trim()
        return city
      }
    }),
    createActionsColumn<Estate>([
      { label: "Editar", onClick: (row) => console.log("Editar", row) },
      { label: "Eliminar", onClick: (row) => console.log("Eliminar", row) }
    ])
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Propiedades" value={totalProperties} icon={<Building className="w-6 h-6" />} />
        <StatCard title="Propiedades en Arriendo" value={propertiesForRent} icon={<Home className="w-6 h-6" />} />
        <StatCard title="Propiedades en Venta" value={propertiesForSale} icon={<Tags className="w-6 h-6" />} />
      </div>

      <EnhancedDataTable<Estate>
        data={estates}
        columns={columns}
        title="Listado de Propiedades"
        buttonText="Nueva Propiedad"
        onPropertyAdded={handlePropertyAdded}
        itemsPerPage={5}
        filterColumn="title"
      />
    </div>
  )
}
