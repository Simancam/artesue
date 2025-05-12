"use client"
import { useState, useEffect } from "react"
import type { JSX } from "react"
import { Eye, MapPin, Ruler, Home, Droplets, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { EstateDetails } from "./estateDetails"
import { EstateCarousel } from "./estatesCarousel"
import { EstatesService, type IEstate } from "@/services/estatesService"

/**
 * Component that displays a grid of estate cards
 */
export function EstateGrid() {
  const [estates, setEstates] = useState<IEstate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstates = async () => {
      try {
        setIsLoading(true)
        const data = await EstatesService.getAllEstates()

        // Transform Firebase data into an array if needed
        let estatesArray: IEstate[] = []

        if (data && typeof data === "object") {
          if (Array.isArray(data)) {
            estatesArray = data
          } else {
            // Handle different possible Firebase response structures
            if ((data as any).documents || (data as any).estates || (data as any).items || (data as any).data) {
              const items =
                (data as any).documents || (data as any).estates || (data as any).items || (data as any).data
              if (Array.isArray(items)) {
                estatesArray = items
              } else if (typeof items === "object") {
                estatesArray = Object.entries(items).map(([id, estate]) => ({
                  id,
                  ...(estate as Omit<IEstate, "id">),
                }))
              }
            } else {
              // If it's a plain object of properties
              estatesArray = Object.entries(data).map(([id, estate]) => {
                if (typeof estate === "object" && estate !== null) {
                  return {
                    id,
                    ...(estate as Omit<IEstate, "id">),
                  }
                }
                // Default values if not an object
                return {
                  id,
                  title: `Property ${id}`,
                  location: "Unknown",
                  type: "Unknown",
                  price: 0,
                  isForRent: false,
                  area: 0,
                  features: [],
                }
              })
            }
          }
        }

        // Ensure each property has the necessary fields
        const validEstates = estatesArray.map((estate) => ({
          ...estate,
          isForRent: typeof estate.isForRent === "boolean" ? estate.isForRent : false,
          features: Array.isArray(estate.features) ? estate.features : [],
          price: typeof estate.price === "number" ? estate.price : 0,
          area: typeof estate.area === "number" ? estate.area : 0,
        }))

        setEstates(validEstates)

        if (validEstates.length === 0) {
          setError("No properties found in the database.")
        } else {
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching properties:", err)
        setError("Could not load properties. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEstates()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-700">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {estates.map((estate) => (
        <EstateCard key={estate.id} estate={estate} />
      ))}
    </div>
  )
}

interface IEstateCardProps {
  estate: IEstate
}

/**
 * Component that displays a card with summary information about a real estate property
 */
export function EstateCard({ estate }: IEstateCardProps) {
  /**
   * Gets images for the carousel, maintaining compatibility with the previous structure
   */
  const getImages = (): string[] => {
    if (estate.images && estate.images.length > 0) {
      return estate.images
    }
    if (estate.image) {
      return [estate.image]
    }
    return [`/placeholder.svg?height=192&width=384&text=${encodeURIComponent(estate.type)}`]
  }

  /**
   * Renders feature badges with a maximum visible limit
   */
  const renderFeatureBadges = (features: string[], maxVisible = 3) => (
    <div className="flex flex-wrap gap-1">
      {features.slice(0, maxVisible).map((feature, index) => (
        <Badge key={index} variant="outline">
          {feature}
        </Badge>
      ))}
      {features.length > maxVisible && <Badge variant="outline">+{features.length - maxVisible}</Badge>}
    </div>
  )

  /**
   * Formats the price with thousands separators and additional text if it's a rental
   */
  const formatPrice = (price: number, isRent: boolean): JSX.Element => (
    <p className="text-xl font-bold">
      ${price.toLocaleString()}
      {isRent && <span className="text-sm font-normal text-muted-foreground"> /month</span>}
    </p>
  )

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
      {/* Image carousel section with transaction type badge */}
      <EstateCarousel images={getImages()} showBadge={true} isForRent={estate.isForRent} className="h-48 w-full" />

      {/* Header with title and location */}
      <div className="flex flex-col space-y-1.5 p-4 pb-0">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold leading-none tracking-tight line-clamp-1">{estate.title}</h3>
          <Badge variant="outline" className="text-xs">
            <Tag className="h-3 w-3 mr-1" /> {estate.propertyCode}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{estate.location}</span>
        </div>
      </div>

      {/* Main content with basic details and price */}
      <div className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground">{estate.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Area</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Ruler className="mr-1 h-4 w-4" />
              <span>{estate.area} m²</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium">Bedrooms</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Home className="mr-1 h-4 w-4" />
              <span>{estate.bedrooms}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Bathrooms</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Droplets className="mr-1 h-4 w-4" />
              <span>{estate.bathrooms}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm font-medium">Price</p>
            {formatPrice(estate.price, estate.isForRent)}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[700px]">
              <DialogTitle>Property Details</DialogTitle>
              <EstateDetails estate={estate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Card footer with feature badges */}
      <div className="flex justify-between p-4 pt-0 mt-auto">{renderFeatureBadges(estate.features)}</div>
    </div>
  )
}
