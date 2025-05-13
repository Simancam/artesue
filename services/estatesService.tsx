// services/estatesService.ts

// Interface for a single estate object, matching your definition
export interface IEstate {
  id: string;
  title: string;
  location: string;
  type: string; // In Firestore, this might be 'propertyType' from filters
  price: number;
  isForRent: boolean; // This field exists in IEstate. Frontend also generates it.
  area: number;
  image?: string;
  images?: string[];
  videoUrl?: string;
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
  bedrooms?: number;
  bathrooms?: number;
  propertyCode?: string; // In Firestore, this might be 'code' from filters
  createdAt?: string;
  updatedAt?: string;
  city?: string;
}

// API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Handles the response from the fetch API.
 * @param res The Response object from fetch.
 * @returns A promise that resolves to the JSON response.
 * @throws Error if the response is not ok.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: any = {};
    try {
      errorBody = await res.json();
    } catch (e) {
      // If response is not JSON or empty
    }
    throw new Error(errorBody.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

/**
 * Defines the structure of the filter parameters that the EstatesFilter component produces.
 * This should align with the 'ProcessedFilters' interface in your frontend component.
 */
export interface EstateFilterParams {
  transactionType?: string; // e.g., 'buy', 'rent'
  isForRent?: boolean;      // Derived in frontend. Backend can use this or transactionType.
  city?: string;
  minArea?: number;
  maxArea?: number;
  propertyType?: string;    // e.g., 'Comercial', 'Residencial'. Maps to 'type' in your backend example.
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;        // Exact number of bedrooms
  bathrooms?: number;       // Exact number of bathrooms
  propertyCode?: string;    // Maps to 'code' in your backend example.
}

export class EstatesService {
  /**
   * Fetches all estates.
   */
  static async getAllEstates(): Promise<IEstate[]> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const res = await fetch(`${API_BASE_URL}/estates`);
    // Assuming backend might wrap array in a 'data' property for this general endpoint
    const payload = await handleResponse<any>(res);
    return Array.isArray(payload) ? payload : payload.data || [];
  }

  /**
   * Fetches a single estate by its ID.
   * @param id The ID of the estate to fetch.
   */
  static async getEstateById(id: string): Promise<IEstate> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const res = await fetch(`${API_BASE_URL}/estates/${id}`);
    return handleResponse<IEstate>(res);
  }

  /**
   * Creates a new estate.
   * @param estateData Data for the new estate.
   */
  static async createEstate(estateData: Omit<IEstate, "id" | "createdAt" | "updatedAt">): Promise<IEstate> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const res = await fetch(`${API_BASE_URL}/estates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estateData),
    });
    return handleResponse<IEstate>(res);
  }

  /**
   * Updates an existing estate.
   * @param id The ID of the estate to update.
   * @param estateData Partial data to update the estate with.
   */
  static async updateEstate(id: string, estateData: Partial<IEstate>): Promise<IEstate> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(estateData),
    });
    return handleResponse<IEstate>(res);
  }

  /**
   * Deletes an estate by its ID.
   * @param id The ID of the estate to delete.
   */
  static async deleteEstate(id: string): Promise<void> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      // Try to parse error message if available
      let errorMsg = `Error al eliminar propiedad: ${res.status}`;
      try {
        const errorBody = await res.json();
        if (errorBody.message) errorMsg = errorBody.message;
      } catch (e) { /* Ignore if body isn't json */ }
      throw new Error(errorMsg);
    }
    // No content expected on successful delete
  }

  /**
   * Fetches estates based on the provided filter criteria.
   * The backend API (e.g., /api/estates or /api/estates/filter) should be set up
   * to parse these query parameters and build a Firestore query similar to your getFiltered example.
   * @param filters An object containing the filter criteria from the EstatesFilter component.
   */
  static async filterEstates(filters: EstateFilterParams): Promise<IEstate[]> {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL no está definida");
    }
    const query = new URLSearchParams(filters as Record<string, string>).toString()
    console.log("Query de filtros enviado a la API:", query)

    const params = new URLSearchParams();

    // Iterate over the filter keys and append them to URLSearchParams if they have a valid value.
    // This ensures that only active filters are sent to the backend.
    (Object.keys(filters) as Array<keyof EstateFilterParams>).forEach((key) => {
      const value = filters[key];

      // Append if value is not undefined or null.
      // For strings, also ensure it's not an empty or whitespace-only string.
      // Numbers (like 0) and booleans (like false) will be converted to strings and appended.
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && value.trim() === "") {
          // Do not append empty or whitespace-only strings
        } else {
          params.append(key, String(value)); // Converts numbers and booleans to their string representations
        }
      }
    });

    const queryString = params.toString();
    // Construct the URL. If queryString is empty, no '?' is added.
    // This assumes your backend filters estates via query parameters on the /estates endpoint.
    // If you have a specific endpoint like /estates/filter, adjust the URL accordingly.
    const fetchURL = `${API_BASE_URL}/estates${queryString ? `?${queryString}` : ''}`;

    // You can log the URL for debugging purposes if needed:
    // console.log("Fetching filtered estates from URL:", fetchURL);

    const res = await fetch(fetchURL);
    
    
    // This assumes your backend returns a direct array of IEstate objects when filtering.
    // If your backend wraps the filtered results in a 'data' object (like getAllEstates might),
    // you would use:
    // const payload = await handleResponse<any>(res);
    // return Array.isArray(payload) ? payload : payload.data || [];
    // Based on your original filterEstates, it seems a direct array is expected.
    return handleResponse<IEstate[]>(res);
  }
}
