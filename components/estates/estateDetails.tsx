"use client";

import { Calendar, MapPin, Phone, User, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { IEstate } from "./services/estatesService";
import { EstateCarousel } from "./estatesCarousel";

interface IEstateDetailsProps {
  estate: IEstate;
}

/**
 * Componente que muestra los detalles completos de una propiedad inmobiliaria
 * organizado en diferentes pestañas
 */
export function EstateDetails({ estate }: IEstateDetailsProps) {
  // Valores por defecto para propiedades opcionales
  const defaultUtilities = [
    "Agua",
    "Electricidad",
    "Alcantarillado",
    "Internet",
  ];
  const defaultDocuments = [
    "Escritura",
    "Plano catastral",
    "Certificado de libertad",
  ];
  const defaultFeatures = [
    "Esquinero",
    "Plano",
    "Acceso pavimentado",
    "Cerca a vía principal",
    "Servicios completos",
    "Zona comercial",
    "Transporte público cercano",
    "Vista panorámica",
  ];

  /**
   * Obtiene las imágenes para el carrusel, manteniendo compatibilidad con la estructura anterior
   */
  const getImages = (): string[] => {
    if (estate.images && estate.images.length > 0) {
      return estate.images;
    }
    if (estate.image) {
      return [estate.image];
    }
    return [
      `/placeholder.svg?height=400&width=700&text=${encodeURIComponent(
        estate.type
      )}`,
    ];
  };

  /**
   * Renderiza la información básica de la propiedad
   */
  const renderPropertyOverview = () => (
    <>
      <div>
        <h2 className="text-2xl font-bold">{estate.title}</h2>
        <div className="mt-1 flex items-center text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>{estate.location}</span>
        </div>
      </div>

      {/* Carrusel de imágenes */}
      <EstateCarousel
        images={getImages()}
        showBadge={true}
        isForRent={estate.isForRent}
        className="w-full h-[400px]"
        imageContainerClassName="h-[400px]" // altura grande para detalle
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Precio</p>
          <p className="text-lg font-bold">
            ${estate.price.toLocaleString()}
            {estate.isForRent && (
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                /mes
              </span>
            )}
          </p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Tipo</p>
          <p className="text-lg font-medium">{estate.type}</p>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Área</p>
          <div className="flex items-center text-lg font-medium">
            <span>{estate.area} m²</span>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <p className="text-sm text-muted-foreground">Zonificación</p>
          <p className="text-lg font-medium">
            {estate.zoning || "Residencial"}
          </p>
        </div>
      </div>
    </>
  );

  /**
   * Renderiza la pestaña de detalles
   */
  const renderDetailsTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">Descripción</h3>
        <p className="mt-2 text-muted-foreground">
          {estate.description ||
            "Excelente lote ubicado en una zona estratégica con gran potencial de desarrollo. Ideal para proyectos residenciales o comerciales. Cuenta con todos los servicios básicos y excelente accesibilidad."}
        </p>
      </div>

      {/* Video de la propiedad */}
      {estate.videoUrl && (
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video de la Propiedad
          </h3>
          <div className="mt-2 aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={estate.videoUrl}
              title="Video de la propiedad"
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

      {estate.utilities && (
        <div>
          <h3 className="text-lg font-bold">Servicios</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(estate.utilities || defaultUtilities).map((utility, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-primary" />
                <span>{utility}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {estate.documents && (
        <div>
          <h3 className="text-lg font-bold">Documentos</h3>
          <div className="mt-2 space-y-2">
            {(estate.documents || defaultDocuments).map((doc, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <a href="#">{doc}</a>
              </Button>
            ))}
          </div>
        </div>
      )}

      {estate.createdAt && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Publicado: {estate.createdAt}</span>
        </div>
      )}
    </div>
  );

  /**
   * Renderiza la pestaña de características
   */
  const renderFeaturesTab = () => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {(estate.features || defaultFeatures).map((feature, index) => (
        <Badge
          key={index}
          variant="outline"
          className="justify-start py-1.5 h-9 w-full text-center flex items-center px-3"
        >
          {feature}
        </Badge>
      ))}
    </div>
  );

  /**
   * Renderiza la pestaña de contacto
   */
  const renderContactTab = () => (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">
              {estate.agent?.name || "Carlos Rodríguez"}
            </h3>
            <p className="text-sm text-muted-foreground">Agente Inmobiliario</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{estate.agent?.phone || "+57 300 123 4567"}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Oficina Central, Calle 123 #45-67</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Button className="w-full">Contactar Ahora</Button>
        <Button variant="outline" className="w-full">
          Agendar Visita
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid gap-6">
      {renderPropertyOverview()}

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          {renderDetailsTab()}
        </TabsContent>

        <TabsContent value="features" className="mt-4">
          {renderFeaturesTab()}
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          {renderContactTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}