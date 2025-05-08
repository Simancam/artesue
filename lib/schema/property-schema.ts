import * as z from "zod"

/**
 * Esquema para validación del formulario de propiedades
 */
export const propertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres",
  }),
  city: z.string().min(1, {
    message: "La ciudad es requerida",
  }),
  location: z.string().min(5, {
    message: "La ubicación debe tener al menos 5 caracteres",
  }),
  type: z.string().min(1, {
    message: "Debe seleccionar un tipo de propiedad",
  }),
  price: z.number().min(0, {
    message: "El precio debe ser un valor positivo",
  }),
  isForRent: z.boolean(),
  area: z.number().min(1, {
    message: "El área debe ser mayor a 0",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres",
  }),
  zoning: z.string().min(1, {
    message: "La zonificación es requerida",
  }),
  bedrooms: z.number().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  propertyCode: z.string().min(3, {
    message: "El código de propiedad debe tener al menos 3 caracteres",
  }),
  videoUrl: z.string().url({ message: "URL de video inválida" }).optional().or(z.literal("")),
  agent: z.object({
    name: z.string().min(3, {
      message: "El nombre del agente debe tener al menos 3 caracteres",
    }),
    phone: z.string().min(7, {
      message: "El teléfono debe tener al menos 7 caracteres",
    }),
    email: z.string().email({
      message: "Debe ingresar un email válido",
    }),
  }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  features: z.array(z.string()).default([]),
  utilities: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  createdAt: z
    .string()
    .min(10, { message: "La fecha debe tener formato DD/MM/AAAA" })
    .default(() => new Date().toLocaleDateString("es-CO")),
})

/**
 * Tipo generado a partir del esquema para usar en el formulario
 */
export type PropertyFormValues = z.infer<typeof propertyFormSchema>
