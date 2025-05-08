import estatesData from "@/data/estates-data.json"

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
  coordinates?: {
    lat: number
    lng: number
  }
  // Nuevas propiedades añadidas
  bedrooms?: number
  bathrooms?: number
  propertyCode?: string
  createdAt?: string
}

//const API_BASE_URL = "/api/estates"

export class EstatesService {
  static async getAllEstates(): Promise<IEstate[]> {
    // Aseguramos compatibilidad con el nuevo formato de datos
    const estates = estatesData.estates.map((estate) => {
      // Si la propiedad tiene una imagen pero no un array de imágenes,
      // creamos el array con esa única imagen para compatibilidad
      if (!estate.images || estate.images.length === 0) {
        return {
          ...estate,
          images: ["/default-image.jpg"],
        }
      }
      return estate
    })

    return Promise.resolve(estates)
  }

  static async getEstateById(id: string): Promise<IEstate | undefined> {
    const all = await this.getAllEstates()
    return all.find((e) => e.id === id)
  }

  static async createEstate(estateData: Omit<IEstate, "id">): Promise<IEstate> {
    // Aseguramos que si se proporciona una imagen pero no imágenes,
    // se cree el array de imágenes con esa única imagen
    const dataWithImages = { ...estateData }
    if (dataWithImages.image && !dataWithImages.images) {
      dataWithImages.images = [dataWithImages.image]
    }

    const newEstate = {
      ...dataWithImages,
      id: `tmp-${Date.now()}`,
      // Si no se proporciona código de propiedad, generamos uno
      propertyCode: dataWithImages.propertyCode || `PROP-${Date.now().toString().substring(7)}`,
      createdAt: new Date().toISOString(),
    } as IEstate

    return Promise.resolve(newEstate)
  }

  static async updateEstate(id: string, estateData: Partial<IEstate>): Promise<IEstate> {
    const all = await this.getAllEstates()
    const existing = all.find((e) => e.id === id)
    if (!existing) throw new Error(`No existe propiedad con ID ${id}`)

    // Manejo especial para la actualización de imágenes
    const updatedData = { ...estateData }

    // Si se actualiza la imagen pero no las imágenes, actualizamos también el array
    if (updatedData.image && !updatedData.images) {
      updatedData.images = [updatedData.image]
    }

    // Si se actualizan las imágenes pero no la imagen, actualizamos la imagen principal
    if (updatedData.images?.length && !updatedData.image) {
      updatedData.image = updatedData.images[0]
    }

    return Promise.resolve({ ...existing, ...updatedData })
  }

  static async deleteEstate(id: string): Promise<void> {
    const all = await this.getAllEstates()
    if (!all.some((e) => e.id === id)) throw new Error(`No existe propiedad con ID ${id}`)
    return Promise.resolve()
  }

  /**
   * Simula un endpoint GET /estates?…query
   */
  static async filterEstates(filters: {
    transactionType?: string
    city?: string
    propertyType?: string
    minArea?: number
    maxArea?: number
    minPrice?: number
    maxPrice?: number
    minBedrooms?: number
    maxBedrooms?: number
    minBathrooms?: number
    maxBathrooms?: number
    propertyCode?: string
  }): Promise<IEstate[]> {
    const all = await this.getAllEstates()
    // Normalizamos cadenas para comparar sin distinción de mayúsculas ni tildes
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-\u036f]/g, "")

    return all.filter((estate) => {
      // 1) transactionType (rent vs buy)
      if (filters.transactionType) {
        const isRent = filters.transactionType === "rent"
        if (estate.isForRent !== isRent) return false
      }

      // 2) city: coincidencia parcial normalizada
      if (filters.city) {
        if (!normalize(estate.location).includes(normalize(filters.city))) return false
      }

      // 3) propertyType
      if (filters.propertyType && estate.type !== filters.propertyType) return false

      // 4) area
      if (filters.minArea != null && estate.area < filters.minArea) return false
      if (filters.maxArea != null && estate.area > filters.maxArea) return false

      // 5) price
      if (filters.minPrice != null && estate.price < filters.minPrice) return false
      if (filters.maxPrice != null && estate.price > filters.maxPrice) return false
      
      // 6) nuevos filtros: habitaciones
      if (filters.minBedrooms != null && (estate.bedrooms === undefined || estate.bedrooms < filters.minBedrooms)) return false
      if (filters.maxBedrooms != null && (estate.bedrooms === undefined || estate.bedrooms > filters.maxBedrooms)) return false
      
      // 7) nuevos filtros: baños
      if (filters.minBathrooms != null && (estate.bathrooms === undefined || estate.bathrooms < filters.minBathrooms)) return false
      if (filters.maxBathrooms != null && (estate.bathrooms === undefined || estate.bathrooms > filters.maxBathrooms)) return false
      
      // 8) código de propiedad (búsqueda exacta)
      if (filters.propertyCode && estate.propertyCode !== filters.propertyCode) return false

      return true
    })
  }
}