"use client"

import React from "react"
import { JSX } from "react"
import { Eye, MapPin, Ruler } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { EstateDetails } from "./estateDetails"
import { IEstate } from "./services/estatesService"

interface IEstateCardProps {
  estate: IEstate;
}

/**
 * Componente de tarjeta para mostrar información resumida de una propiedad inmobiliaria
 */
export function EstateCard({ estate }: IEstateCardProps) {
  /**
   * Procesa la URL de la imagen para manejar diferentes formatos de ruta
   */
  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('/estates/')) {
      return `/placeholder.svg?height=192&width=384&text=${encodeURIComponent(estate.type)}`;
    }
    return imageUrl;
  };

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
      {features.length > maxVisible && (
        <Badge variant="outline">+{features.length - maxVisible}</Badge>
      )}
    </div>
  );

  /**
   * Formatea el precio con separadores de miles y texto adicional si es renta
   */
  const formatPrice = (price: number, isRent: boolean): JSX.Element => (
    <p className="text-xl font-bold">
      ${price.toLocaleString()}
      {isRent && <span className="text-sm font-normal text-muted-foreground"> /mes</span>}
    </p>
  );

  return (
    <Card className="overflow-hidden">
      {/* Sección de imagen y badge de tipo de transacción */}
      <div className="relative h-48 w-full">
        <img
          src={getImageUrl(estate.image)}
          alt={estate.title}
          className="h-full w-full object-cover"
        />
        <Badge 
          className="absolute right-2 top-2" 
          variant={estate.isForRent ? "secondary" : "default"}
        >
          {estate.isForRent ? "En Arriendo" : "En Venta"}
        </Badge>
      </div>

      {/* Encabezado con título y ubicación */}
      <CardHeader className="p-4">
        <CardTitle className="line-clamp-1 text-xl">{estate.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span className="line-clamp-1">{estate.location}</span>
        </div>
      </CardHeader>

      {/* Contenido principal con detalles básicos y precio */}
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-2 gap-2">
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
              <DialogTitle>Detalles de la Propiedad</DialogTitle>
              <EstateDetails estate={estate} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>

      {/* Pie de tarjeta con badges de características */}
      <CardFooter className="flex justify-between p-4 pt-0">
        {renderFeatureBadges(estate.features)}
      </CardFooter>
    </Card>
  )
}