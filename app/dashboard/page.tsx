"use client"

import { useState } from "react"
import { StatCard } from "@/components/dashboard/statCard"
import { DataTable } from "@/components/dashboard/dataTable"
import { Home, Tags, Building } from "lucide-react"
import estatesData from "@/data/estates-data.json"
import type React from "react"
import type { PropertyFormValues } from "@/lib/schema/property-schema"

// Definir el tipo de propiedad para una mejor tipificación
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

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const [estates, setEstates] = useState<Estate[]>(estatesData.estates)

  // Calcular estadísticas
  const totalProperties = estates.length
  const propertiesForRent = estates.filter((p) => p.isForRent).length
  const propertiesForSale = estates.filter((p) => !p.isForRent).length

  // Función para añadir una nueva propiedad
  const handlePropertyAdded = (property: PropertyFormValues) => {
    const newProperty: Estate = {
      ...property,
      id: `est-${(estates.length + 1).toString().padStart(3, "0")}`,
      images: ["/placeholder.svg?height=300&width=400"],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      documents: [],
      createdAt: new Date().toLocaleDateString("es-ES"),
    }

    setEstates([...estates, newProperty])
  }

  // Columnas para la tabla - adaptadas para el nuevo formato de datos
  const columns: {
    header: string
    accessor: keyof Estate | ((item: Estate) => React.ReactNode)
    align?: "left" | "center" | "right"
  }[] = [
    {
      header: "Nombre",
      accessor: "title",
    },
    {
      header: "Tipo",
      accessor: "type",
    },
    {
      header: "Estado",
      accessor: (item: Estate) => {
        const estado = item.isForRent ? "Arriendo" : "Venta"
        const color = item.isForRent ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{estado}</span>
      },
      align: "center",
    },
    {
      header: "Precio",
      accessor: (item: Estate) => {
        const formattedPrice = new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(item.price)

        return item.isForRent ? `${formattedPrice}/mes` : formattedPrice
      },
      align: "right",
    },
    {
      header: "Superficie",
      accessor: (item: Estate) => `${item.area} m²`,
      align: "right",
    },
    {
      header: "Ubicación",
      accessor: (item: Estate) => {
        // Mostrar solo la ciudad de la ubicación
        const city = item.location.split(",").slice(-1)[0].trim()
        return city
      },
    },
  ]

  const renderActions = () => (
    <div className="flex justify-center space-x-2">
      <button className="p-1 text-blue-600 hover:text-blue-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
      <button className="p-1 text-red-600 hover:text-red-800">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total de Propiedades" value={totalProperties} icon={<Building className="w-6 h-6" />} />
        <StatCard title="Propiedades en Arriendo" value={propertiesForRent} icon={<Home className="w-6 h-6" />} />
        <StatCard title="Propiedades en Venta" value={propertiesForSale} icon={<Tags className="w-6 h-6" />} />
      </div>

      {/* Tabla de propiedades con modal integrado */}
      <DataTable
        data={estates}
        columns={columns}
        title="Listado de Propiedades"
        buttonText="Nueva Propiedad"
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        renderActions={renderActions}
        onPropertyAdded={handlePropertyAdded}
      />
    </div>
  )
}