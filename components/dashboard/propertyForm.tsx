"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyFormSchema, type PropertyFormValues } from "@/lib/schema/property-schema"
import { X } from "lucide-react"
import type { IEstate } from "@/services/estatesService"

// Constantes para los selectores
const PROPERTY_TYPES = ["Comercial", "Residencial", "Industrial", "Agrícola", "Turístico"]
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

interface PropertyFormProps {
  onSuccess: (data: PropertyFormValues) => void
  onError: () => void
  initialData?: IEstate // Cambiado a IEstate para manejar edición
}

export function PropertyForm({ onSuccess, onError, initialData }: PropertyFormProps) {
  const [features, setFeatures] = useState<string[]>(initialData?.features || [])
  const [utilities, setUtilities] = useState<string[]>(initialData?.utilities || [])
  const [documents, setDocuments] = useState<string[]>(initialData?.documents || [])
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [currentFeature, setCurrentFeature] = useState("")
  const [currentUtility, setCurrentUtility] = useState("")
  const [currentDocument, setCurrentDocument] = useState("")
  const [currentImage, setCurrentImage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preparar los valores iniciales para el formulario
  const defaultValues = initialData
    ? {
        id: initialData.id,
        title: initialData.title || "",
        city: initialData.city || "",
        location: initialData.location || "",
        type: initialData.type || "",
        price: initialData.price || 0,
        isForRent: initialData.isForRent || false,
        area: initialData.area || 0,
        description: initialData.description || "",
        zoning: initialData.zoning || "Residencial",
        bedrooms: initialData.bedrooms || 0,
        bathrooms: initialData.bathrooms || 0,
        propertyCode:
          initialData.propertyCode ||
          `PROP-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
        videoUrl: initialData.videoUrl || "",
        agent: initialData.agent || { name: "", phone: "", email: "" },
        features: initialData.features || [],
        utilities: initialData.utilities || [],
        documents: initialData.documents || [],
        images: initialData.images || [],
        createdAt: initialData.createdAt || new Date().toLocaleDateString("es-CO"),
      }
    : {
        id: undefined,
        title: "",
        city: "",
        location: "",
        type: "",
        price: 0,
        isForRent: false,
        area: 0,
        description: "",
        zoning: "Residencial",
        bedrooms: 0,
        bathrooms: 0,
        propertyCode: `PROP-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        videoUrl: "",
        agent: { name: "", phone: "", email: "" },
        features: [],
        utilities: [],
        documents: [],
        images: [],
        createdAt: new Date().toLocaleDateString("es-CO"),
      }

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  })

  // Añade un efecto para asegurarse de que el formulario se actualice cuando cambia initialData
  useEffect(() => {
    if (initialData) {
      console.log("Datos iniciales recibidos:", initialData)

      // Asegurarse de que todos los arrays estén definidos
      const safeFeatures = Array.isArray(initialData.features) ? initialData.features : []
      const safeUtilities = Array.isArray(initialData.utilities) ? initialData.utilities : []
      const safeDocuments = Array.isArray(initialData.documents) ? initialData.documents : []
      const safeImages = Array.isArray(initialData.images) ? initialData.images : []

      // Actualizar los estados locales
      setFeatures(safeFeatures)
      setUtilities(safeUtilities)
      setDocuments(safeDocuments)
      setImages(safeImages)

      // Crear un objeto con valores por defecto para campos que podrían faltar
      const formData = {
        id: initialData.id,
        title: initialData.title || "",
        city: initialData.city || "",
        location: initialData.location || "",
        type: initialData.type || "",
        price: typeof initialData.price === "number" ? initialData.price : 0,
        isForRent: Boolean(initialData.isForRent),
        area: typeof initialData.area === "number" ? initialData.area : 0,
        description: initialData.description || "",
        zoning: initialData.zoning || "Residencial",
        bedrooms: typeof initialData.bedrooms === "number" ? initialData.bedrooms : 0,
        bathrooms: typeof initialData.bathrooms === "number" ? initialData.bathrooms : 0,
        propertyCode:
          initialData.propertyCode ||
          `PROP-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
        videoUrl: initialData.videoUrl || "",
        agent: initialData.agent || { name: "", phone: "", email: "" },
        features: safeFeatures,
        utilities: safeUtilities,
        documents: safeDocuments,
        images: safeImages,
        createdAt: initialData.createdAt || new Date().toLocaleDateString("es-CO"),
      }

      console.log("Reseteando formulario con:", formData)

      // Resetear el formulario con los datos procesados
      form.reset(formData)
    }
  }, [initialData, form])

  const addTag = (
    current: string,
    setCurrent: (val: string) => void,
    list: string[],
    setList: (items: string[]) => void,
    name: keyof PropertyFormValues,
  ) => {
    const trimmed = current.trim()
    if (trimmed && !list.includes(trimmed)) {
      const updated = [...list, trimmed]
      setList(updated)
      form.setValue(name, updated)
      setCurrent("")
    }
  }

  const removeTag = (
    item: string,
    list: string[],
    setList: (items: string[]) => void,
    name: keyof PropertyFormValues,
  ) => {
    const updated = list.filter((i) => i !== item)
    setList(updated)
    form.setValue(name, updated)
  }

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true)

      // Asegurar que los arrays estén correctamente establecidos
      data.features = features.length > 0 ? features : []
      data.utilities = utilities.length > 0 ? utilities : []
      data.documents = documents.length > 0 ? documents : []
      data.images = images.length > 0 ? images : []

      // Verificar campos obligatorios
      if (!data.title || data.title.trim() === "") {
        throw new Error("El título es obligatorio")
      }
      if (!data.location || data.location.trim() === "") {
        throw new Error("La dirección es obligatoria")
      }

      // Llamar a la función de éxito con los datos procesados
      await onSuccess(data)
    } catch (err) {
      console.error("Error en el formulario:", err)
      // Mostrar el error específico al usuario
      if (err instanceof Error) {
        alert(`Error: ${err.message}`)
      } else {
        alert("Error desconocido al procesar la solicitud.")
      }
      onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6 border p-4 rounded-md">
          <h2 className="text-xl font-bold">Información Básica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Lote Comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (m²) *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar ciudad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLOMBIAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Calle 123 #45-67, Barrio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zoning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zonificación *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Video *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Habitaciones</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baños</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isForRent"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>Disponible para arriendo</FormLabel>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción *</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h2 className="text-xl font-bold">Imágenes</h2>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="URL de la imagen"
                value={currentImage}
                onChange={(e) => setCurrentImage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(currentImage, setCurrentImage, images, setImages, "images")
                  }
                }}
              />
              <Button type="button" onClick={() => addTag(currentImage, setCurrentImage, images, setImages, "images")}>
                Añadir
              </Button>
            </div>

            <div className="border p-2 rounded-md min-h-[100px]">
              {images.length > 0 ? (
                <ul className="space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className="flex justify-between items-center p-1 border-b">
                      <span className="truncate">{img}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(img, images, setImages, "images")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center p-4">Sin imágenes</p>
              )}
            </div>
          </div>
        </div>

        <div className="border p-4 rounded-md space-y-4">
          <h2 className="text-xl font-bold">Características y Servicios</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Características</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir característica"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(currentFeature, setCurrentFeature, features, setFeatures, "features")
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag(currentFeature, setCurrentFeature, features, setFeatures, "features")}
                >
                  Añadir
                </Button>
              </div>

              <div className="border p-2 rounded-md min-h-[100px]">
                {features.length > 0 ? (
                  <ul className="space-y-1">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex justify-between items-center p-1 border-b">
                        <span>{feature}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(feature, features, setFeatures, "features")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center p-4">Sin características</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Servicios</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir servicio"
                  value={currentUtility}
                  onChange={(e) => setCurrentUtility(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag(currentUtility, setCurrentUtility, utilities, setUtilities, "utilities")
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => addTag(currentUtility, setCurrentUtility, utilities, setUtilities, "utilities")}
                >
                  Añadir
                </Button>
              </div>

              <div className="border p-2 rounded-md min-h-[100px]">
                {utilities.length > 0 ? (
                  <ul className="space-y-1">
                    {utilities.map((utility, idx) => (
                      <li key={idx} className="flex justify-between items-center p-1 border-b">
                        <span>{utility}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(utility, utilities, setUtilities, "utilities")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-center p-4">Sin servicios</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Documentos</label>
            <div className="flex gap-2">
              <Input
                placeholder="Añadir documento"
                value={currentDocument}
                onChange={(e) => setCurrentDocument(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(currentDocument, setCurrentDocument, documents, setDocuments, "documents")
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addTag(currentDocument, setCurrentDocument, documents, setDocuments, "documents")}
              >
                Añadir
              </Button>
            </div>

            <div className="border p-2 rounded-md min-h-[100px]">
              {documents.length > 0 ? (
                <ul className="space-y-1">
                  {documents.map((doc, idx) => (
                    <li key={idx} className="flex justify-between items-center p-1 border-b">
                      <span>{doc}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(doc, documents, setDocuments, "documents")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-center p-4">Sin documentos</p>
              )}
            </div>
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h2 className="text-xl font-bold mb-4">Información del Agente</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="agent.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Carlos Rodríguez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agent.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: +57 300 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agent.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: agente@ejemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-black" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : initialData ? "Actualizar Propiedad" : "Guardar Propiedad"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
