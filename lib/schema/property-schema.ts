import { z } from "zod"

export const propertyFormSchema = z.object({
  title: z.string().min(5, {
    message: "El título debe tener al menos 5 caracteres.",
  }),
  location: z.string().min(5, {
    message: "La ubicación debe tener al menos 5 caracteres.",
  }),
  type: z.string().min(1, {
    message: "Debe seleccionar un tipo de propiedad.",
  }),
  price: z.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  isForRent: z.boolean(),
  area: z.number().positive({
    message: "El área debe ser un número positivo.",
  }),
  features: z.array(z.string()),
  description: z.string().min(20, {
    message: "La descripción debe tener al menos 20 caracteres.",
  }),
  zoning: z.string().min(1, {
    message: "La zonificación es requerida.",
  }),
  utilities: z.array(z.string()),
  agent: z.object({
    name: z.string().min(3, {
      message: "El nombre del agente debe tener al menos 3 caracteres.",
    }),
    phone: z.string().min(7, {
      message: "El teléfono debe tener al menos 7 caracteres.",
    }),
    email: z.string().email({
      message: "Debe ingresar un email válido.",
    }),
  }),
  coordinates: z.object({
    lat: z.number().refine((val) => val !== 0, {
      message: "La latitud es requerida.",
    }),
    lng: z.number().refine((val) => val !== 0, {
      message: "La longitud es requerida.",
    }),
  }),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>
