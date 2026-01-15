"use client"

import type React from "react"

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
import { X, Plus, MapPin, Home, User } from "lucide-react"
import type { IEstate } from "@/services/estatesService"
import Image from "next/image"

// ==================== CONSTANTES ====================
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

// ==================== INTERFACES ====================
interface PropertyFormProps {
  onSuccess: (data: PropertyFormValues) => void
  onError: () => void
  initialData?: IEstate
  isOpen: boolean
  onClose: () => void
  title: string
}

// ==================== FUNCIONES AUXILIARES ====================
// Función para simular subida a Firebase
// const uploadToFirebase = async (file: File): Promise<string> => {
//   await new Promise((resolve) => setTimeout(resolve, 1500))

//   // En producción, reemplaza con tu lógica de Firebase:
//   /*
//   import { storage } from '@/lib/firebase'
//   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

//   const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`)
//   const snapshot = await uploadBytes(storageRef, file)
//   const downloadURL = await getDownloadURL(snapshot.ref)
//   return downloadURL
//   */

//   return `https://firebasestorage.googleapis.com/v0/b/your-project/o/properties%2F${Date.now()}_${file.name}?alt=media`
// }

// ==================== COMPONENTE PRINCIPAL ====================
export function PropertyFormUnified({ onSuccess, onError, initialData, isOpen, onClose, title }: PropertyFormProps) {
  // ==================== ESTADOS ====================
  const [features, setFeatures] = useState<string[]>(initialData?.features || [])
  const [utilities, setUtilities] = useState<string[]>(initialData?.utilities || [])
  const [documents, setDocuments] = useState<string[]>(initialData?.documents || [])
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [currentFeature, setCurrentFeature] = useState("")
  const [currentUtility, setCurrentUtility] = useState("")
  const [currentDocument, setCurrentDocument] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  // const [uploading, setUploading] = useState(false)
  // const [uploadProgress, setUploadProgress] = useState("")

  // const fileInputRef = useRef<HTMLInputElement>(null)

  // ==================== CONFIGURACIÓN DEL FORMULARIO ====================
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

  // ==================== EFECTOS ====================
  // Control del dialog
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Manejo de tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Actualización de datos iniciales
  useEffect(() => {
    if (initialData) {
      const safeFeatures = Array.isArray(initialData.features) ? initialData.features : []
      const safeUtilities = Array.isArray(initialData.utilities) ? initialData.utilities : []
      const safeDocuments = Array.isArray(initialData.documents) ? initialData.documents : []
      const safeImages = Array.isArray(initialData.images) ? initialData.images : []

      setFeatures(safeFeatures)
      setUtilities(safeUtilities)
      setDocuments(safeDocuments)
      setImages(safeImages)

      const formData = {
        ...defaultValues,
        features: safeFeatures,
        utilities: safeUtilities,
        documents: safeDocuments,
        images: safeImages,
      }

      form.reset(formData)
    }
  }, [initialData, form])

  // ==================== FUNCIONES AUXILIARES ====================
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

  // Manejo de subida de imágenes
  // const handleFileUpload = async (files: FileList | null) => {
  //   if (!files || files.length === 0) return

  //   setUploading(true)
  //   const newImages: string[] = []

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i]
  //     if (file.type.startsWith("image/")) {
  //       try {
  //         setUploadProgress(`Subiendo imagen ${i + 1} de ${files.length}...`)
  //         const url = await uploadToFirebase(file)
  //         newImages.push(url)
  //       } catch (error) {
  //         console.error("Error uploading image:", error)
  //       }
  //     }
  //   }

  //   const updatedImages = [...images, ...newImages]
  //   setImages(updatedImages)
  //   form.setValue("images", updatedImages)
  //   setUploading(false)
  //   setUploadProgress("")
  // }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    form.setValue("images", newImages)
  }

  const addImageUrl = () => {
    const trimmed = currentImageUrl.trim()
    if (trimmed && !images.includes(trimmed)) {
      const updated = [...images, trimmed]
      setImages(updated)
      form.setValue("images", updated)
      setCurrentImageUrl("")
    }
  }

  // Envío del formulario
  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true)
      data.features = features
      data.utilities = utilities
      data.documents = documents
      data.images = images

      if (!data.title?.trim()) throw new Error("El título es obligatorio")
      if (!data.location?.trim()) throw new Error("La dirección es obligatoria")

      await onSuccess(data)
      onClose()
    } catch (err) {
      console.error("Error en el formulario:", err)
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

  // ==================== COMPONENTES INTERNOS ====================
  const TagInput = ({
    label,
    placeholder,
    current,
    setCurrent,
    list,
    setList,
    name,
    colorClass,
  }: {
    label: string
    placeholder: string
    current: string
    setCurrent: (val: string) => void
    list: string[]
    setList: (items: string[]) => void
    name: keyof PropertyFormValues
    colorClass: string
  }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrent(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        addTag(current, setCurrent, list, setList, name)
      }
    }

    const handleAddClick = () => {
      addTag(current, setCurrent, list, setList, name)
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">{label}</label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={current}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="h-9 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddClick}
            className="h-9 px-3 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="bg-white rounded-lg p-2 min-h-[80px] max-h-32 overflow-y-auto border border-blue-200">
          {list.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {list.map((item, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 ${colorClass} px-2 py-1 rounded-full text-xs`}
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTag(item, list, setList, name)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-blue-400 text-sm text-center py-4">Sin {label.toLowerCase()}</p>
          )}
        </div>
      </div>
    )
  }

  // ==================== RENDER ====================
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ==================== INFORMACIÓN BÁSICA ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Información Básica</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Título *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Lote Comercial" {...field} className="h-9" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tipo *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-9">
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
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Precio *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="h-9"
                          />
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
                        <FormLabel className="text-sm font-medium">Área (m²) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="h-9"
                          />
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
                        <FormLabel className="text-sm font-medium">Habitaciones</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="h-9"
                          />
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
                        <FormLabel className="text-sm font-medium">Baños</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <FormField
                    control={form.control}
                    name="zoning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Zonificación *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Comercial" {...field} className="h-9" />
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
                        <FormLabel className="text-sm font-medium">Código *</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">URL del Video</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: https://www.youtube.com/watch?v=..." {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="isForRent"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-medium">Disponible para arriendo</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ==================== UBICACIÓN ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Ubicación</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Ciudad *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-9">
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
                        <FormLabel className="text-sm font-medium">Dirección *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Calle 123 #45-67, Barrio" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ==================== DESCRIPCIÓN ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Descripción *</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ==================== IMÁGENES ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Imágenes</h3>

                <div className="space-y-4">
                  {/* Input para añadir URL de imagen */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-800">URLs de Imágenes</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={currentImageUrl}
                        onChange={(e) => setCurrentImageUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addImageUrl()
                          }
                        }}
                        className="h-9 text-sm"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addImageUrl}
                        className="h-9 px-3 border-blue-200 text-blue-700 hover:bg-blue-50 bg-transparent"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Preview de imágenes */}
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-blue-200">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Imagen ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=200&width=200&text=Error"
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-25">
                      {/* <ImageIcon className="h-12 w-12 text-blue-400 mx-auto mb-2" /> */}
                      <p className="text-blue-600 text-sm">No hay imágenes añadidas</p>
                      <p className="text-blue-400 text-xs mt-1">Añade URLs de imágenes</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ==================== CARACTERÍSTICAS Y SERVICIOS ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Características y Servicios</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TagInput
                    label="Características"
                    placeholder="Añadir característica"
                    current={currentFeature}
                    setCurrent={setCurrentFeature}
                    list={features}
                    setList={setFeatures}
                    name="features"
                    colorClass="bg-blue-100 text-blue-800"
                  />

                  <TagInput
                    label="Servicios"
                    placeholder="Añadir servicio"
                    current={currentUtility}
                    setCurrent={setCurrentUtility}
                    list={utilities}
                    setList={setUtilities}
                    name="utilities"
                    colorClass="bg-blue-100 text-blue-800"
                  />
                </div>

                <div className="mt-4">
                  <TagInput
                    label="Documentos"
                    placeholder="Añadir documento"
                    current={currentDocument}
                    setCurrent={setCurrentDocument}
                    list={documents}
                    setList={setDocuments}
                    name="documents"
                    colorClass="bg-blue-100 text-blue-800"
                  />
                </div>
              </div>

              {/* ==================== INFORMACIÓN DEL AGENTE ==================== */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Información del Agente</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="agent.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Carlos Rodríguez" {...field} className="h-9" />
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
                        <FormLabel className="text-sm font-medium">Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: +57 300 123 4567" {...field} className="h-9" />
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
                        <FormLabel className="text-sm font-medium">Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: agente@ejemplo.com" {...field} className="h-9" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* ==================== BOTONES DE ACCIÓN ==================== */}
              <div className="flex justify-end pt-4 border-t">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : initialData ? "Actualizar Propiedad" : "Guardar Propiedad"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
