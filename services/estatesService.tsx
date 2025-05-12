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
  city?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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
    const res = await fetch(`${API_BASE_URL}/estates`)
    const payload = await handleResponse<any>(res)
    return Array.isArray(payload) ? payload : payload.data || []
  }

  static async getEstateById(id: string): Promise<IEstate> {
    const res = await fetch(`${API_BASE_URL}/estates/${id}`)
    return handleResponse<IEstate>(res)
  }

  static async createEstate(estateData: Omit<IEstate, "id" | "createdAt" | "updatedAt">): Promise<IEstate> {
    const res = await fetch(`${API_BASE_URL}/estates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estateData),
    })
    return handleResponse<IEstate>(res)
  }

  static async updateEstate(id: string, estateData: Partial<IEstate>): Promise<IEstate> {
    const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estateData),
    })
    return handleResponse<IEstate>(res)
  }

  static async deleteEstate(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error(`Error al eliminar propiedad: ${res.status}`)
  }

  static async filterEstates(filters: Record<string, any>): Promise<IEstate[]> {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })
    const res = await fetch(`${API_BASE_URL}/estates?${params.toString()}`)
    return handleResponse<IEstate[]>(res)
  }
}