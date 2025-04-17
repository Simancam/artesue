import estatesData from '@/data/estates-data.json';

export interface IEstate {
  id: string;
  title: string;
  location: string;
  type: string;
  price: number;
  isForRent: boolean;
  area: number;
  image: string;
  features: string[];
  description?: string;
  zoning?: string;
  utilities?: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
  documents?: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
}

const API_BASE_URL = '/api/estates';

export class EstatesService {
  static async getAllEstates(): Promise<IEstate[]> {
    return Promise.resolve(estatesData.estates);
  }

  static async getEstateById(id: string): Promise<IEstate | undefined> {
    const all = await this.getAllEstates();
    return all.find(e => e.id === id);
  }

  static async createEstate(estateData: Omit<IEstate, 'id'>): Promise<IEstate> {
    const newEstate = {
      ...estateData,
      id: `tmp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    } as IEstate;
    return Promise.resolve(newEstate);
  }

  static async updateEstate(id: string, estateData: Partial<IEstate>): Promise<IEstate> {
    const all = await this.getAllEstates();
    const existing = all.find(e => e.id === id);
    if (!existing) throw new Error(`No existe propiedad con ID ${id}`);
    return Promise.resolve({ ...existing, ...estateData });
  }

  static async deleteEstate(id: string): Promise<void> {
    const all = await this.getAllEstates();
    if (!all.some(e => e.id === id)) throw new Error(`No existe propiedad con ID ${id}`);
    return Promise.resolve();
  }

  /**
   * Simula un endpoint GET /estates?…query
   */
  static async filterEstates(filters: {
    transactionType?: string;
    city?: string;
    propertyType?: string;
    minArea?: number;
    maxArea?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<IEstate[]> {
    const all = await this.getAllEstates();
    // Normalizamos cadenas para comparar sin distinción de mayúsculas ni tildes
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-\u036f]/g, '');

    return all.filter(estate => {
      // 1) transactionType (rent vs buy)
      if (filters.transactionType) {
        const isRent = filters.transactionType === 'rent';
        if (estate.isForRent !== isRent) return false;
      }

      // 2) city: coincidencia parcial normalizada
      if (filters.city) {
        if (
          !normalize(estate.location).includes(
            normalize(filters.city)
          )
        ) return false;
      }

      // 3) propertyType
      if (filters.propertyType && estate.type !== filters.propertyType) return false;

      // 4) area
      if (filters.minArea != null && estate.area < filters.minArea) return false;
      if (filters.maxArea != null && estate.area > filters.maxArea) return false;

      // 5) price
      if (filters.minPrice != null && estate.price < filters.minPrice) return false;
      if (filters.maxPrice != null && estate.price > filters.maxPrice) return false;

      return true;
    });
  }
}