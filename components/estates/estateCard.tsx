"use client"
import type { JSX } from "react"
import { Eye, MapPin, Ruler, Home, Droplets, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { EstateDetails } from "./estateDetails"
import type { IEstate } from "../../services/estatesService"
import { EstateCarousel } from "./estatesCarousel"

interface IEstateCardProps {
  estate: IEstate
}

/**
 * Componente de tarjeta para mostrar información resumida de una propiedad inmobiliaria
 */
export function EstateCard({ estate }: IEstateCardProps) {
  /**
   * Obtiene las imágenes para el carrusel, manteniendo compatibilidad con la estructura anterior
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
   * Renderiza los badges de características con un límite máximo visible
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
   * Formatea el precio con separadores de miles y texto adicional si es renta
   */
  const formatPrice = (price: number, isRent: boolean): JSX.Element => (
    <p className="text-xl font-bold">
      ${price.toLocaleString()}
      {isRent && <span className="text-sm font-normal text-muted-foreground"> /mes</span>}
    </p>
  )

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
      {/* Sección de carrusel de imágenes con badge de tipo de transacción */}
      <EstateCarousel images={getImages()} showBadge={true} isForRent={estate.isForRent} className="h-48 w-full" />

      {/* Encabezado con título y ubicación */}
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

      {/* Contenido principal con detalles básicos y precio */}
      <div className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <p className="text-sm font-medium">Tipo</p>
            <p className="text-sm text-muted-foreground">{estate.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Área</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Ruler className="mr-1 h-4 w-4" />
              <span>{estate.area} m²</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium">Habitaciones</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Home className="mr-1 h-4 w-4" />
              <span>{estate.bedrooms}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Baños</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Droplets className="mr-1 h-4 w-4" />
              <span>{estate.bathrooms}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-sm font-medium">Precio</p>
            {formatPrice(estate.price, estate.isForRent)}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[700px]">
              <DialogTitle>Artesue</DialogTitle>
              <EstateDetails estate={estate} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pie de tarjeta con badges de características */}
      <div className="flex justify-between p-4 pt-0 mt-auto">{renderFeatureBadges(estate.features)}</div>
    </div>
  )
}