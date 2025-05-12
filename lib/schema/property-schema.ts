// Cambiar el esquema para hacer todos los campos obligatorios y eliminar coordenadas
import { z } from "zod"

// Esquema para la validación del formulario de propiedades
export const propertyFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  location: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  type: z.string().min(1, "El tipo de propiedad es obligatorio"),
  price: z.number().min(1, "El precio debe ser mayor que 0"),
  isForRent: z.boolean().default(false),
  area: z.number().min(1, "El área debe ser mayor que 0"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  zoning: z.string().min(1, "La zonificación es obligatoria"),
  bedrooms: z.number().min(0, "El número de habitaciones es obligatorio"),
  bathrooms: z.number().min(0, "El número de baños es obligatorio"),
  propertyCode: z.string().min(1, "El código de propiedad es obligatorio"),
  videoUrl: z.string().url("La URL del video debe ser válida").min(1, "La URL del video es obligatoria"),
  agent: z.object({
    name: z.string().min(3, "El nombre del agente es obligatorio"),
    phone: z.string().min(7, "El teléfono del agente es obligatorio"),
    email: z.string().email("El email del agente debe ser válido"),
  }),
  // Se eliminó el campo coordinates
  features: z.array(z.string()).min(1, "Debe incluir al menos una característica"),
  utilities: z.array(z.string()).min(1, "Debe incluir al menos un servicio"),
  documents: z.array(z.string()).min(1, "Debe incluir al menos un documento"),
  images: z.array(z.string()).min(1, "Debe incluir al menos una imagen"),
  createdAt: z.string().optional(),
})

// Tipo derivado del esquema
export type PropertyFormValues = z.infer<typeof propertyFormSchema>
