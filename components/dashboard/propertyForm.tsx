"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { propertyFormSchema, type PropertyFormValues } from "@/lib/schema/property-schema"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

const TagInput = ({ 
  value, 
  onChange, 
  onAdd, 
  placeholder 
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
  emptyMessage 
}: { 
  items: string[]
  onRemove: (item: string) => void
  emptyMessage: string 
}) => (
  <div className="flex flex-wrap gap-2 mt-2 min-h-[200px] max-h-[200px] overflow-y-auto p-2 border rounded-md">
    {items.map((item, index) => (
      <Badge key={index} variant="secondary" className="flex items-center gap-1">
        {item}
        <button
          type="button"
          onClick={() => onRemove(item)}
          className="ml-1 text-gray-500 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    ))}
    {items.length === 0 && <span className="text-gray-400 text-sm">{emptyMessage}</span>}
  </div>
)

interface PropertyFormProps {
  onSuccess: (data: PropertyFormValues) => void
  onError: () => void
}

export function PropertyForm({ onSuccess, onError }: PropertyFormProps) {
  const [features, setFeatures] = useState<string[]>([])
  const [utilities, setUtilities] = useState<string[]>([])
  const [currentFeature, setCurrentFeature] = useState("")
  const [currentUtility, setCurrentUtility] = useState("")

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      location: "",
      type: "",
      price: 0,
      isForRent: false,
      area: 0,
      description: "",
      zoning: "",
      agent: { name: "", phone: "", email: "" },
      coordinates: { lat: 0, lng: 0 },
      features: [],
      utilities: [],
    },
  })

  const handleTagAdd = (
    current: string,
    setCurrent: (value: string) => void,
    items: string[],
    setItems: (items: string[]) => void,
    formField: "features" | "utilities"
  ) => {
    if (current.trim() && !items.includes(current.trim())) {
      const newItems = [...items, current.trim()]
      setItems(newItems)
      form.setValue(formField, newItems)
      setCurrent("")
    }
  }

  const handleTagRemove = (
    item: string,
    items: string[],
    setItems: (items: string[]) => void,
    formField: "features" | "utilities"
  ) => {
    const newItems = items.filter((i) => i !== item)
    setItems(newItems)
    form.setValue(formField, newItems)
  }

  const addFeature = () => handleTagAdd(
    currentFeature, 
    setCurrentFeature, 
    features, 
    setFeatures, 
    "features"
  )
  
  const removeFeature = (feature: string) => handleTagRemove(
    feature, 
    features, 
    setFeatures, 
    "features"
  )
  
  const addUtility = () => handleTagAdd(
    currentUtility, 
    setCurrentUtility, 
    utilities, 
    setUtilities, 
    "utilities"
  )
  
  const removeUtility = (utility: string) => handleTagRemove(
    utility, 
    utilities, 
    setUtilities, 
    "utilities"
  )

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      console.log("Datos enviados:", data)
      onSuccess(data)
    } catch (error) {
      console.error("Error al enviar el formulario:", error)
      onError()
    }
  }

  const BasicInfoTab = () => (
    <TabsContent value="basic" className="space-y-4 h-full">
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
                <Input placeholder="Ej: Lote Comercial en Zona Norte" {...field} />
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
                Tipo de Propiedad <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Residencial">Residencial</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Agrícola">Agrícola</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="Ej: Comercial, Residencial, Industrial" {...field} />
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
                <Input
                  type="number"
                  placeholder="Ej: 250000000"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
              <FormLabel>
                Área (m²) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Ej: 1200"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isForRent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 h-full">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Disponible para arriendo</FormLabel>
                <FormDescription className="text-xs">Marque si es para arriendo</FormDescription>
              </div>
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
              <Textarea placeholder="Describa la propiedad en detalle" className="min-h-[80px]" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </TabsContent>
  )

  const DetailsTab = () => (
    <TabsContent value="details" className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <FormLabel className="text-base font-medium">Características</FormLabel>
            <TagInput 
              value={currentFeature}
              onChange={setCurrentFeature}
              onAdd={addFeature}
              placeholder="Añadir característica"
            />
            <TagList
              items={features}
              onRemove={removeFeature}
              emptyMessage="No hay características añadidas"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormLabel className="text-base font-medium">Servicios</FormLabel>
            <TagInput 
              value={currentUtility}
              onChange={setCurrentUtility}
              onAdd={addUtility}
              placeholder="Añadir servicio"
            />
            <TagList
              items={utilities}
              onRemove={removeUtility}
              emptyMessage="No hay servicios añadidos"
            />
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  )

  const AgentTab = () => (
    <TabsContent value="agent" className="h-full pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="agent.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nombre <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nombre del agente" {...field} />
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
                <Input placeholder="+57 300 123 4567" {...field} />
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
                <Input placeholder="agente@inmobiliaria.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  )

  const LocationTab = () => (
    <TabsContent value="location" className="h-full pt-4">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Dirección <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Ej: Av. Principal 123, Zona Norte, Bogotá" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="coordinates.lat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Latitud <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="Ej: 4.6686"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coordinates.lng"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Longitud <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.0001"
                  placeholder="Ej: -74.0521"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Información Básica</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="agent">Agente</TabsTrigger>
            <TabsTrigger value="location">Ubicación</TabsTrigger>
          </TabsList>

          <div className="h-[400px] overflow-y-auto border rounded-md p-4">
            <BasicInfoTab />
            <DetailsTab />
            <AgentTab />
            <LocationTab />
          </div>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" className="bg-amber-400 hover:bg-amber-400/90 text-white">
            Guardar Propiedad
          </Button>
        </div>
      </form>
    </Form>
  )
}