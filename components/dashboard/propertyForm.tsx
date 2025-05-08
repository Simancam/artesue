"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyFormSchema, type PropertyFormValues } from "@/lib/schema/property-schema"
import { X, Plus, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

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

const TagInput = ({
  value,
  onChange,
  onAdd,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
  placeholder: string
}) => (
  <div className="flex mt-2 mb-2">
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mr-2"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault()
          onAdd()
        }
      }}
    />
    <Button type="button" variant="outline" size="sm" onClick={onAdd}>
      <Plus className="h-4 w-4" />
    </Button>
  </div>
)

const TagList = ({
  items,
  onRemove,
  emptyMessage,
}: {
  items: string[]
  onRemove: (item: string) => void
  emptyMessage: string
}) => (
  <div className="flex flex-wrap gap-2 mt-2 min-h-[180px] max-h-[180px] overflow-y-auto p-3 border rounded-md bg-white">
    {items.length > 0 ? (
      items.map((item, idx) => (
        <Badge key={idx} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
          {item}
          <button type="button" onClick={() => onRemove(item)} className="ml-1 text-gray-500 hover:text-gray-700">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))
    ) : (
      <span className="text-gray-400 text-sm flex items-center justify-center h-full w-full">{emptyMessage}</span>
    )}
  </div>
)

interface PropertyFormProps {
  onSuccess: (data: PropertyFormValues) => void
  onError: () => void
}

export function PropertyForm({ onSuccess, onError }: PropertyFormProps) {
  const [features, setFeatures] = useState<string[]>([])
  const [utilities, setUtilities] = useState<string[]>([])
  const [documents, setDocuments] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [currentFeature, setCurrentFeature] = useState("")
  const [currentUtility, setCurrentUtility] = useState("")
  const [currentDocument, setCurrentDocument] = useState("")
  const [currentImage, setCurrentImage] = useState("")

  const form = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
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
      coordinates: { lat: 0, lng: 0 }, // Mantenemos el objeto pero no lo usaremos
      features: [],
      utilities: [],
      documents: [],
      images: [],
      createdAt: new Date().toLocaleDateString("es-CO"),
    },
  })

  const handleTagAdd = (
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

  const handleTagRemove = (
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
      // Asegurar que los arrays estén correctamente establecidos
      data.features = features
      data.utilities = utilities
      data.documents = documents
      data.images = images

      if (!data.id) {
        data.id = `est-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`
      }
      console.log("Enviando:", data)
      onSuccess(data)
    } catch (err) {
      console.error(err)
      onError()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<PropertyFormValues>)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6 w-3/4 mx-auto">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="media">Multimedia</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="agent">Agente</TabsTrigger>
          </TabsList>

          <div className="h-[520px] overflow-auto border rounded-md p-6 bg-gray-50/50">
            {/* BASIC TAB */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Título <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Tipo <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROPERTY_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel>
                        Zonificación <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Comercial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Precio <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Área (m²) <span className="text-red-500">*</span>
                      </FormLabel>
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
                    <FormItem className="flex space-x-3 border p-4 rounded-md">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div>
                        <FormLabel>Disponible para arriendo</FormLabel>
                        <FormDescription>Marque si aplica</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  name="propertyCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Código <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ciudad <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar ciudad" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLOMBIAN_CITIES.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Dirección <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Calle 123 #45-67, Barrio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Descripción <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} className="min-h-[80px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL de Video</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Embed de YouTube u otro</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="DD/MM/AAAA" />
                      </FormControl>
                      <FormDescription>Formato DD/MM/AAAA</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* MEDIA TAB */}
            <TabsContent value="media">
              <Card>
                <CardContent className="pt-6">
                  <FormLabel>Imágenes</FormLabel>
                  <FormDescription>URLs de imágenes para la galería de la propiedad</FormDescription>
                  <TagInput
                    value={currentImage}
                    onChange={setCurrentImage}
                    onAdd={() => handleTagAdd(currentImage, setCurrentImage, images, setImages, "images")}
                    placeholder="Añadir URL"
                  />
                  <TagList
                    items={images}
                    onRemove={(item) => handleTagRemove(item, images, setImages, "images")}
                    emptyMessage="Sin imágenes"
                  />

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                      {images.slice(0, 6).map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-md overflow-hidden border">
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Vista previa ${idx + 1}`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                `/placeholder.svg?height=150&width=250&text=${encodeURIComponent("Imagen no disponible")}`
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* DETAILS TAB */}
            <TabsContent value="details">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <FormLabel>Características</FormLabel>
                    <FormDescription>Agregue características destacadas de la propiedad</FormDescription>
                    <TagInput
                      value={currentFeature}
                      onChange={setCurrentFeature}
                      onAdd={() => handleTagAdd(currentFeature, setCurrentFeature, features, setFeatures, "features")}
                      placeholder="Añadir característica"
                    />
                    <TagList
                      items={features}
                      onRemove={(item) => handleTagRemove(item, features, setFeatures, "features")}
                      emptyMessage="Sin características"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <FormLabel>Servicios</FormLabel>
                    <FormDescription>Agregue los servicios disponibles (agua, luz, etc.)</FormDescription>
                    <TagInput
                      value={currentUtility}
                      onChange={setCurrentUtility}
                      onAdd={() =>
                        handleTagAdd(currentUtility, setCurrentUtility, utilities, setUtilities, "utilities")
                      }
                      placeholder="Añadir servicio"
                    />
                    <TagList
                      items={utilities}
                      onRemove={(item) => handleTagRemove(item, utilities, setUtilities, "utilities")}
                      emptyMessage="Sin servicios"
                    />
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="pt-6">
                    <FormLabel>Documentos</FormLabel>
                    <FormDescription>Agregue los documentos disponibles para la propiedad</FormDescription>
                    <TagInput
                      value={currentDocument}
                      onChange={setCurrentDocument}
                      onAdd={() =>
                        handleTagAdd(currentDocument, setCurrentDocument, documents, setDocuments, "documents")
                      }
                      placeholder="Añadir doc"
                    />
                    <TagList
                      items={documents}
                      onRemove={(item) => handleTagRemove(item, documents, setDocuments, "documents")}
                      emptyMessage="Sin documentos"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AGENT TAB */}
            <TabsContent value="agent">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="agent.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nombre <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Teléfono <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: agente@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>

            {/* Eliminamos la pestaña de ubicación y movemos los campos relevantes a la pestaña básica */}
          </div>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6">
          <Button variant="outline" type="button" onClick={() => onError()} className="px-8">
            Cancelar
          </Button>
          <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-white font-medium px-8">
            Guardar Propiedad
          </Button>
        </div>
      </form>
    </Form>
  )
}
