// services/estatesService.ts
export interface IEstate {
  id: string
  title: string
  location: string
  type: string
  price: number
  isForRent: boolean
  area: number
  image?: string
  images?: string[]
  videoUrl?: string
  features: string[]
  description?: string
  zoning?: string
  utilities?: string[]
  agent?: {
    name: string
    phone: string
    email: string
  }
  documents?: string[]

  bedrooms?: number
  bathrooms?: number
  propertyCode?: string
  createdAt?: string
  updatedAt?: string
  city?: string // Asegurando que ciudad esté incluida
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(errorBody.message || `HTTP error! status: ${res.status}`)
  }
  return res.json()
}

export class EstatesService {
  static async getAllEstates(): Promise<IEstate[]> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida")
  }
  console.log("Fetching estates from:", `${API_BASE_URL}/estates`)
  const res = await fetch(`${API_BASE_URL}/estates`)
  const payload = await handleResponse<any>(res)
  console.log("Raw payload:", payload)
  return Array.isArray(payload) ? payload : payload.data || []
}


  static async getEstateById(id: string): Promise<IEstate> {
    try {
      const res = await fetch(`${API_BASE_URL}/estates/${id}`)
      return handleResponse<IEstate>(res)
    } catch (error) {
      console.error(`Error al obtener propiedad con ID ${id}:`, error)
      throw error
    }
  }

  
  static async createEstate(estateData: Omit<IEstate, "id" | "createdAt" | "updatedAt">): Promise<IEstate> {
    try {
      const res = await fetch(`${API_BASE_URL}/estates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estateData),
      })
      return handleResponse<IEstate>(res)
    } catch (error) {
      console.error("Error al crear propiedad:", error)
      throw error
    }
  }

  static async updateEstate(id: string, estateData: Partial<IEstate>): Promise<IEstate> {
    try {
      const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estateData),
      })
      return handleResponse<IEstate>(res)
    } catch (error) {
      console.error(`Error al actualizar propiedad con ID ${id}:`, error)
      throw error
    }
  }

  static async deleteEstate(id: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error(`Error al eliminar propiedad: ${res.status}`)
    } catch (error) {
      console.error(`Error al eliminar propiedad con ID ${id}:`, error)
      throw error
    }
  }

  /**
   * Filtra estates pasando los parámetros que desees:
   * transactionType: "rent" | "buy",
   * city, propertyType, minArea, maxArea, minPrice, maxPrice,
   * minBedrooms, maxBedrooms, minBathrooms, maxBathrooms,
   * propertyCode
   */
  static async filterEstates(filters: Record<string, any>): Promise<IEstate[]> {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString())
        }
      })
      const res = await fetch(`${API_BASE_URL}/estates?${params.toString()}`)
      return handleResponse<IEstate[]>(res)
    } catch (error) {
      console.error("Error al filtrar propiedades:", error)
      throw error
    }
  }
}