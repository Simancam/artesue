"use client"

import { useState, useEffect } from "react"
import {
  EnhancedDataTable,
  createColumn,
  createSelectColumn,
  createActionsColumn,
} from "@/components/dashboard/dataTable"
import { StatCard } from "@/components/dashboard/statCard"
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
import { PropertyForm } from "@/components/dashboard/propertyForm"

export default function DashboardPage() {
  const [estates, setEstates] = useState<IEstate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEstate, setEditingEstate] = useState<IEstate | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [estateToDelete, setEstateToDelete] = useState<IEstate | null>(null)
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    visible: boolean
    message: string
  }>({ type: "success", visible: false, message: "" })

  useEffect(() => {
    fetchEstates()
  }, [])

  const fetchEstates = async () => {
    try {
      setIsLoading(true)
      const data = await EstatesService.getAllEstates()

      // Log para depuración
      console.log("Datos originales de Firebase:", data)

      // Transformar el objeto de Firebase en un array
      let estatesArray: IEstate[] = []

      if (data && typeof data === "object") {
        if (Array.isArray(data)) {
          // Si ya es un array
          estatesArray = data
        } else {
          // Si es un objeto, verificar si tiene una propiedad que contenga los datos
          // A veces Firebase devuelve { documents: [...] } o algo similar
          if ((data as any).documents || (data as any).estates || (data as any).items || (data as any).data) {
            const items = (data as any).documents || (data as any).estates || (data as any).items || (data as any).data
            if (Array.isArray(items)) {
              estatesArray = items
            } else if (typeof items === "object") {
              // Si es un objeto de objetos, convertirlo a array
              estatesArray = Object.entries(items).map(([id, estate]) => ({
                id,
                ...(estate as Omit<IEstate, "id">),
              }))
            }
          } else {
            // Si es un objeto plano de propiedades
            estatesArray = Object.entries(data).map(([id, estate]) => {
              // Asegurarse de que estate sea un objeto
              if (typeof estate === "object" && estate !== null) {
                return {
                  id,
                  ...(estate as Omit<IEstate, "id">),
                }
              }
              // Si no es un objeto, crear uno con valores por defecto
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

      // Log para depuración
      console.log("Array transformado:", estatesArray)

      // Verificar que cada propiedad tenga los campos necesarios
      const validEstates = estatesArray.map((estate) => ({
        ...estate,
        // Asegurar que estos campos existan con valores por defecto si no están presentes
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
    } finally {
      setIsLoading(false)
    }
  }

  const totalProperties = estates.length
  const propertiesForRent = estates.filter((p) => p.isForRent).length
  const propertiesForSale = estates.filter((p) => !p.isForRent).length

  const showTemporaryAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, visible: true, message })
    setTimeout(() => setAlert((prev) => ({ ...prev, visible: false })), 3000)
  }

  const handlePropertyAdded = async (property: PropertyFormValues) => {
    try {
      // Crear una nueva propiedad
      const newProperty: Omit<IEstate, "id" | "createdAt" | "updatedAt"> = {
        ...property,
        images: property.images || [],
        videoUrl: property.videoUrl || "",
        features: property.features || [],
        description: property.description || "",
        zoning: property.zoning || "",
        utilities: property.utilities || [],
        agent: property.agent || { name: "", phone: "", email: "" },
        documents: property.documents || [],// Valor por defecto ya que el formulario no lo incluye
      }

      console.log("Nueva propiedad a añadir:", newProperty)
      const createdEstate = await EstatesService.createEstate(newProperty)
      setEstates((prev) => [...prev, createdEstate])
      setFormOpen(false)
      showTemporaryAlert("success", "Propiedad añadida correctamente")
    } catch (error) {
      console.error("Error al añadir propiedad:", error)
      showTemporaryAlert("error", "Error al añadir la propiedad")
    }
  }

  // Modifica la función handlePropertyUpdated para manejar correctamente los datos de Firebase
  const handlePropertyUpdated = async (property: PropertyFormValues) => {
    if (!editingEstate) return

    try {
      // Crear un objeto con los datos actualizados, manteniendo la estructura esperada por Firebase
      const updatedData: Partial<IEstate> = {
        ...property,
        // Asegurarse de que todos los campos estén presentes y con el formato correcto
        title: property.title,
        location: property.location,
        type: property.type,
        price: Number(property.price),
        isForRent: Boolean(property.isForRent),
        area: Number(property.area),
        description: property.description || "",
        zoning: property.zoning || "",
        bedrooms: Number(property.bedrooms || 0),
        bathrooms: Number(property.bathrooms || 0),
        propertyCode: property.propertyCode || "",
        videoUrl: property.videoUrl || "",
        agent: property.agent || { name: "", phone: "", email: "" },
        features: Array.isArray(property.features) ? property.features : [],
        utilities: Array.isArray(property.utilities) ? property.utilities : [],
        documents: Array.isArray(property.documents) ? property.documents : [],
        images: Array.isArray(property.images) ? property.images : [],
        // Mantener las coordenadas existentes o usar un valor por defecto
        // Mantener estos campos si existen
        city: property.city || editingEstate.city || "",
        createdAt: editingEstate.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Llamar al servicio para actualizar la propiedad
      const updatedEstate = await EstatesService.updateEstate(editingEstate.id, updatedData)

      // Crear un objeto completo con todos los campos necesarios para actualizar el estado local
      // Esto es importante porque Firebase puede devolver solo los campos actualizados
      const completeUpdatedEstate: IEstate = {
        ...editingEstate,
        ...updatedData,
        id: editingEstate.id,
      }

      // Actualizar el estado local con los datos actualizados
      setEstates((prev) => prev.map((estate) => (estate.id === editingEstate.id ? completeUpdatedEstate : estate)))

      setFormOpen(false)
      setEditingEstate(null)
      showTemporaryAlert("success", "Propiedad actualizada correctamente")
    } catch (error) {
      console.error("Error al actualizar propiedad:", error)
      showTemporaryAlert("error", "Error al actualizar la propiedad")
    }
  }

  // Modifica la función handleEditClick para asegurarse de que todos los datos estén presentes
  function handleEditClick(estate: IEstate) {
    try {
      // Asegurarse de que todos los campos necesarios estén presentes
      const completeEstate: IEstate = {
        ...estate,
        // Proporcionar valores por defecto para campos que podrían faltar
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
      showTemporaryAlert("error", "Error al cargar los datos de la propiedad")
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
      setEstateToDelete(null)
      showTemporaryAlert("success", "Propiedad eliminada correctamente")
    } catch (error) {
      console.error(`Error al eliminar propiedad:`, error)
      showTemporaryAlert("error", "Error al eliminar la propiedad")
    }
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setEditingEstate(null)
  }

  const columns = [
    createSelectColumn<IEstate>(),
    createColumn<IEstate>("title", "Nombre", (row) => row.title, { sortable: true }),
    createColumn<IEstate>("type", "Tipo", (row) => row.type),
    createColumn<IEstate>("status", "Estado", (row) => (row.isForRent ? "Arriendo" : "Venta"), {
      align: "center",
      cell: (value: unknown, row) => {
        const isRent = row.isForRent
        const color = isRent ? "text-green-600 bg-green-100" : "text-blue-600 bg-blue-100"
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{String(value)}</span>
      },
    }),
    createColumn<IEstate>("price", "Precio", (row) => row.price, {
      align: "right",
      cell: (_: unknown, row) => {
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Control</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {alert.visible && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
          <Alert
            className={`shadow-lg max-w-md ${
              alert.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            }`}
          >
            <AlertCircle className={`h-4 w-4 ${alert.type === "success" ? "text-green-500" : "text-red-500"}`} />
            <AlertDescription className={alert.type === "success" ? "text-green-600" : "text-red-600"}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
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

      {/* Diálogo para añadir/editar propiedad */}
      <Dialog open={formOpen} onOpenChange={handleFormClose}>
        <DialogContent className="sm:max-w-[900px] md:max-w-[1600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEstate ? "Editar Propiedad" : "Añadir Propiedad"}</DialogTitle>
            <DialogDescription>
              {editingEstate
                ? "Modifique los datos de la propiedad y guarde los cambios."
                : "Complete el formulario para añadir una nueva propiedad al sistema."}
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            initialData={editingEstate || undefined}
            onSuccess={editingEstate ? handlePropertyUpdated : handlePropertyAdded}
            onError={() => showTemporaryAlert("error", "Ha ocurrido un error. Inténtalo de nuevo.")}
          />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la propiedad "{estateToDelete?.title}"? Esta acción no se puede
              deshacer.
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