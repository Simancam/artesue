"use client"

import { Calendar, MapPin, Phone, User, Video, Home, Droplets, Tag, Check, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { IEstate } from "@/services/estatesService"
import { EstateCarousel } from "./estatesCarousel"

interface IEstateDetailsComponentProps {
  estate: IEstate
}

export function EstateDetails({ estate }: IEstateDetailsComponentProps) {
  const defaultUtilities = ["Agua", "Electricidad", "Alcantarillado", "Internet"]
  const defaultDocuments = ["Escritura", "Plano catastral", "Certificado de libertad"]
  const defaultFeatures = [
    "Esquinero",
    "Plano",
    "Acceso pavimentado",
    "Cerca a vía principal",
    "Servicios completos",
    "Zona comercial",
    "Transporte público cercano",
    "Vista panorámica",
  ]

  const getImages = (): string[] => {
    if (estate.images && estate.images.length > 0) return estate.images
    if (estate.image) return [estate.image]
    return [`/placeholder.svg?height=400&width=700&text=${encodeURIComponent(estate.type || "Propiedad")}`]
  }

  const getWhatsAppUrl = () => {
    const phoneNumber = (estate.agent?.phone || "+573001234567")
      .replace(/[^\d+]/g, '')
      .replace(/^0+/, '')
    
    const message = encodeURIComponent(
      `Hola, estoy interesado en la propiedad con código: ${estate.propertyCode || "N/A"}`
    )

    return `https://wa.me/${phoneNumber}?text=${message}`
  }

  return (
    <div className="w-full mx-auto">
      {/* Encabezado */}
      <div className="mb-5 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{estate.title || "Sin título"}</h1>
          <Badge className="text-xs sm:text-sm self-start sm:self-auto px-2 py-1 sm:px-3 sm:py-1">
            {estate.isForRent ? "En Renta" : "En Venta"}
          </Badge>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center text-muted-foreground">
          <MapPin className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="text-sm sm:text-base md:text-lg">{estate.location || "Ubicación no disponible"}</span>
        </div>
      </div>

      {/* Sección principal */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-8 sm:mb-12">
        <div className="w-full lg:w-3/5">
          <EstateCarousel
            images={getImages()}
            showBadge={false}
            isForRent={estate.isForRent}
            className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden"
            imageContainerClassName="h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
          />
        </div>

        <div className="w-full lg:w-2/5 mt-4 lg:mt-0">
          <div className="bg-slate-50 rounded-lg p-4 sm:p-6 h-full">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Información General</h2>
              <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Precio</p>
                  <p className="text-xl sm:text-2xl font-bold">
                    ${(estate.price || 0).toLocaleString()} COP
                    {estate.isForRent && (
                      <span className="text-xs sm:text-sm font-normal text-muted-foreground"> /mes</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tipo</p>
                  <p className="text-base sm:text-xl">{estate.type || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Área</p>
                  <p className="text-base sm:text-xl">{estate.area || 0} m²</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Zonificación</p>
                  <p className="text-base sm:text-xl">{estate.zoning || "Residencial"}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-6" />

            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Características</h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col items-center">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Habitaciones</p>
                  <p className="text-base sm:text-xl font-medium">{estate.bedrooms || 0}</p>
                </div>
                <div className="flex flex-col items-center">
                  <Droplets className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Baños</p>
                  <p className="text-base sm:text-xl font-medium">{estate.bathrooms || 0}</p>
                </div>
                <div className="flex flex-col items-center">
                  <Tag className="h-6 w-6 sm:h-8 sm:w-8 text-primary mb-1 sm:mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground">Código</p>
                  <p className="text-base sm:text-xl font-medium">{estate.propertyCode || "N/A"}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-6" />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                size="default" 
                className="text-sm sm:text-base h-10 sm:h-12 flex-1"
                asChild
              >
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar Ahora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="mb-6 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Descripción</h2>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <p className="text-sm sm:text-base md:text-lg leading-relaxed">
            {estate.description ||
              "Excelente lote ubicado en una zona estratégica con gran potencial de desarrollo. Ideal para proyectos residenciales o comerciales. Cuenta con todos los servicios básicos y excelente accesibilidad."}
          </p>
          {estate.createdAt && (
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
              <Calendar className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span>Publicado: {estate.createdAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Características */}
      <div className="mb-6 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Características</h2>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {(estate.features || defaultFeatures).map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video */}
      {estate.videoUrl && (
        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 sm:h-6 sm:w-6" />
            Video de la Propiedad
          </h2>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="w-full overflow-hidden rounded-lg">
              <div className="aspect-video w-full">
                <iframe
                  src={estate.videoUrl}
                  title="Video de la propiedad"
                  className="h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Servicios */}
      <div className="mb-6 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Servicios</h2>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {(estate.utilities || defaultUtilities).map((utility, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-2 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-primary flex-shrink-0" />
                <span className="text-sm sm:text-base">{utility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documentos */}
      {estate.documents && estate.documents.length > 0 && (
        <div className="mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Documentos</h2>
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {(estate.documents || defaultDocuments).map((doc, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-sm sm:text-base py-1 sm:py-2 h-auto"
                  asChild
                >
                  <a href="#">{doc}</a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Información de contacto */}
      <div className="mb-6 sm:mb-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Información de Contacto</h2>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-medium">{estate.agent?.name || "Carlos Rodríguez"}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">Agente Inmobiliario</p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center">
                  <Phone className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">{estate.agent?.phone || "+57 300 123 4567"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span className="text-sm sm:text-base">Oficina Central, Calle 123 #45-67</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
              <div className="bg-slate-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                <div className="flex items-start">
                  <Info className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm">
                    Contáctanos para obtener más información sobre esta propiedad o para programar una visita.
                  </p>
                </div>
              </div>
              <div className="flex flex-col grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <Button 
                  size="default" 
                  className="text-sm sm:text-base h-10 sm:h-12"
                  asChild
                >
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contactar Ahora
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}