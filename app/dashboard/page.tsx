"use client"

import { useState, useEffect } from "react"
import { EnhancedDataTable, createColumn, createSelectColumn, createActionsColumn } from "@/components/admin/dataTable"
import { StatCard } from "@/components/admin/statCard"
import { Home, Tags, Building, AlertCircle, Plus, Trash2 } from "lucide-react"
import { EstatesService, type IEstate } from "@/services/estatesService"
import type { PropertyFormValues } from "@/lib/schema/property-schema"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PropertyFormUnified } from "@/components/admin/propertyForm"
import { toast } from "sonner"

type FirebaseDataStructure = {
  documents?: unknown
  estates?: unknown
  items?: unknown
  data?: unknown
}

export default function DashboardPage() {
  const [estates, setEstates] = useState<IEstate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEstate, setEditingEstate] = useState<IEstate | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [estateToDelete, setEstateToDelete] = useState<IEstate | null>(null)

  useEffect(() => {
    fetchEstates()
  }, [])

  const fetchEstates = async () => {
    try {
      setIsLoading(true)
      const data = await EstatesService.getAllEstates()
      console.log("Datos originales de Firebase:", data)
      let estatesArray: IEstate[] = []

      if (data && typeof data === "object") {
        const firebaseData = data as FirebaseDataStructure
        if (Array.isArray(data)) {
          estatesArray = data
        } else {
          if (firebaseData.documents || firebaseData.estates || firebaseData.items || firebaseData.data) {
            const items = firebaseData.documents || firebaseData.estates || firebaseData.items || firebaseData.data
            if (Array.isArray(items)) {
              estatesArray = items
            } else if (typeof items === "object" && items !== null) {
              estatesArray = Object.entries(items).map(([id, estate]) => ({
                id,
                ...(estate as Omit<IEstate, "id">),
              }))
            }
          } else {
            estatesArray = Object.entries(firebaseData).map(([id, estate]) => {
              if (typeof estate === "object" && estate !== null) {
                return {
                  id,
                  ...(estate as Omit<IEstate, "id">),
                }
              }
              return {
                id,
                title: `Propiedad ${id}`,
                location: "Desconocida",
                type: "Desconocido",
                price: 0,
                isForRent: false,
                area: 0,
                features: [],
              }
            })
          }
        }
      }

      console.log("Array transformado:", estatesArray)
      const validEstates = estatesArray.map((estate) => ({
        ...estate,
        isForRent: typeof estate.isForRent === "boolean" ? estate.isForRent : false,
        features: Array.isArray(estate.features) ? estate.features : [],
        price: typeof estate.price === "number" ? estate.price : 0,
        area: typeof estate.area === "number" ? estate.area : 0,
      }))

      setEstates(validEstates)
      if (validEstates.length === 0) {
        setError("No se encontraron propiedades en la base de datos.")
      } else {
        setError(null)
      }
    } catch (err) {
      console.error("Error al obtener propiedades:", err)
      setEstates([])
      setError("No se pudieron cargar las propiedades. Por favor, intenta de nuevo más tarde.")
      toast.error("Error al cargar propiedades", {
        description: "No se pudieron cargar las propiedades. Por favor, intenta de nuevo más tarde.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const totalProperties = estates.length
  const propertiesForRent = estates.filter((p) => p.isForRent).length
  const propertiesForSale = estates.filter((p) => !p.isForRent).length

  const handlePropertyAdded = async (property: PropertyFormValues) => {
    try {
      const newProperty: Omit<IEstate, "id" | "createdAt" | "updatedAt"> = {
        ...property,
        images: property.images || [],
        videoUrl: property.videoUrl || "",
        features: property.features || [],
        description: property.description || "",
        zoning: property.zoning || "",
        utilities: property.utilities || [],
        agent: property.agent || { name: "", phone: "", email: "" },
        documents: property.documents || [],
      }

      console.log("Nueva propiedad a añadir:", newProperty)
      const createdEstate = await EstatesService.createEstate(newProperty)
      setEstates((prev) => [...prev, createdEstate])

      toast.success("¡Propiedad añadida!", {
        description: `La propiedad "${property.title}" se ha añadido correctamente.`,
      })
    } catch (error) {
      console.error("Error al añadir propiedad:", error)
      toast.error("Error al añadir propiedad", {
        description: "No se pudo añadir la propiedad. Por favor, intenta de nuevo.",
      })
    }
  }

  const handlePropertyUpdated = async (property: PropertyFormValues) => {
    if (!editingEstate) return
    try {
      // 1. Actualizar en el backend
      const updatedEstate = await EstatesService.updateEstate(editingEstate.id, {
        ...property,
        price: Number(property.price),
        isForRent: Boolean(property.isForRent),
        area: Number(property.area),
        // Convertir todos los campos necesarios
        bedrooms: Number(property.bedrooms || 0),
        bathrooms: Number(property.bathrooms || 0),
        features: Array.isArray(property.features) ? property.features : [],
        utilities: Array.isArray(property.utilities) ? property.utilities : [],
        images: Array.isArray(property.images) ? property.images : [],
      })

      // 2. Actualizar el estado local con la respuesta del servidor
      setEstates((prev) => prev.map((estate) => (estate.id === editingEstate.id ? updatedEstate : estate)))

      toast.success("¡Propiedad actualizada!", {
        description: `La propiedad "${property.title}" se ha actualizado correctamente.`,
      })
    } catch (error) {
      console.error("Error al actualizar propiedad:", error)
      toast.error("Error al actualizar propiedad", {
        description: "No se pudo actualizar la propiedad. Por favor, intenta de nuevo.",
      })
    }
  }

  function handleEditClick(estate: IEstate) {
    try {
      const completeEstate: IEstate = {
        ...estate,
        features: Array.isArray(estate.features) ? estate.features : [],
        utilities: Array.isArray(estate.utilities) ? estate.utilities : [],
        documents: Array.isArray(estate.documents) ? estate.documents : [],
        images: Array.isArray(estate.images) ? estate.images : [],
        agent: estate.agent || { name: "", phone: "", email: "" },
        description: estate.description || "",
        zoning: estate.zoning || "",
        bedrooms: estate.bedrooms || 0,
        bathrooms: estate.bathrooms || 0,
        propertyCode: estate.propertyCode || "",
        videoUrl: estate.videoUrl || "",
        city: estate.city || "",
      }
      setEditingEstate(completeEstate)
      setFormOpen(true)
    } catch (error) {
      console.error(`Error al obtener propiedad para editar:`, error)
      toast.error("Error al cargar propiedad", {
        description: "No se pudieron cargar los datos de la propiedad para editar.",
      })
    }
  }

  const handleDeleteClick = (estate: IEstate) => {
    setEstateToDelete(estate)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!estateToDelete) return
    try {
      await EstatesService.deleteEstate(estateToDelete.id)
      setEstates((prev) => prev.filter((e) => e.id !== estateToDelete.id))
      setDeleteDialogOpen(false)

      toast.success("¡Propiedad eliminada!", {
        description: `La propiedad "${estateToDelete.title}" se ha eliminado correctamente.`,
      })

      setEstateToDelete(null)
    } catch (error) {
      console.error(`Error al eliminar propiedad:`, error)
      toast.error("Error al eliminar propiedad", {
        description: "No se pudo eliminar la propiedad. Por favor, intenta de nuevo.",
      })
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingEstate(null)
  }

  const handleFormError = () => {
    toast.error("Error en el formulario", {
      description: "Ha ocurrido un error al procesar el formulario. Por favor, revisa los datos e intenta de nuevo.",
    })
  }

  const columns = [
    createSelectColumn<IEstate>(),
    createColumn<IEstate>("title", "Nombre", (row) => row.title, { sortable: true }),
    createColumn<IEstate>("type", "Tipo", (row) => row.type),
    createColumn<IEstate>("status", "Estado", (row) => (row.isForRent ? "Arriendo" : "Venta"), {
      align: "center",
      cell: (value: unknown, row: IEstate) => {
        const isRent = row.isForRent
        const color = isRent ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{String(value)}</span>
      },
    }),
    createColumn<IEstate>("price", "Precio", (row) => row.price, {
      align: "right",
      cell: (_: unknown, row: IEstate) => {
        const formatted = new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          maximumFractionDigits: 0,
        }).format(row.price)
        return row.isForRent ? `${formatted}/mes` : formatted
      },
    }),
    createColumn<IEstate>("area", "Superficie", (row) => row.area, {
      align: "right",
      cell: (value: unknown) => `${value} m²`,
    }),
    createColumn<IEstate>("location", "Ubicación", (row) => row.location, {
      cell: (value: unknown) => {
        const city = (value as string)?.split(",").slice(-1)[0]?.trim() || ""
        return city
      },
    }),
    createActionsColumn<IEstate>([
      { label: "Editar", onClick: (row) => handleEditClick(row) },
      { label: "Eliminar", onClick: (row) => handleDeleteClick(row) },
    ]),
  ]

  return (
    <div className="p-6 w-full mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center py-10">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Cargando...
            </span>
          </div>
          <p className="mt-2 text-gray-600">Cargando propiedades...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total de Propiedades" value={totalProperties} icon={<Building className="w-6 h-6" />} />
            <StatCard title="Propiedades en Arriendo" value={propertiesForRent} icon={<Home className="w-6 h-6" />} />
            <StatCard title="Propiedades en Venta" value={propertiesForSale} icon={<Tags className="w-6 h-6" />} />
          </div>
          {estates.length > 0 ? (
            <EnhancedDataTable<IEstate>
              data={estates}
              columns={columns}
              title="Listado de Propiedades"
              buttonText="Nueva Propiedad"
              onButtonClick={() => {
                setEditingEstate(null)
                setFormOpen(true)
              }}
              itemsPerPage={5}
              filterColumn="title"
            />
          ) : (
            <div className="bg-white p-8 rounded-lg border shadow-sm text-center">
              <Building className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay propiedades</h3>
              <p className="text-gray-500 mb-6">
                No se encontraron propiedades en la base de datos. Puedes añadir una nueva propiedad.
              </p>
              <button
                onClick={() => {
                  setEditingEstate(null)
                  setFormOpen(true)
                }}
                className="bg-amber-400 hover:bg-amber-400/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
              >
                <span>Nueva Propiedad</span>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Formulario Unificado con Dialog Custom Integrado */}
      <PropertyFormUnified
        isOpen={formOpen}
        onClose={handleFormClose}
        title={editingEstate ? "Editar Propiedad" : "Añadir Propiedad"}
        initialData={editingEstate || undefined}
        onSuccess={editingEstate ? handlePropertyUpdated : handlePropertyAdded}
        onError={handleFormError}
      />

      {/* Dialog de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la propiedad &quot;{estateToDelete?.title}&quot;? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
