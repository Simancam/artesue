"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface EstateCarouselProps {
  images: string[];
  showBadge?: boolean;
  isForRent?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "auto";
  showIndicators?: boolean;
  imageContainerClassName?: string;
}

export function EstateCarousel({
  images,
  showBadge = false,
  isForRent = false,
  className = "",
  aspectRatio = "video",
  showIndicators = true,
  imageContainerClassName = "h-48", 
}: EstateCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const aspectRatioClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : "";

  const imageUrls =
    images && images.length > 0
      ? images
      : ["/placeholder.svg?height=400&width=700"];

  return (
    <div className={`relative ${className} group`}>
      <Carousel
        className="w-full h-full"
        onSelect={(event: React.SyntheticEvent) =>
          setCurrentIndex((event.target as any).dataset.index)
        }
      >
        <CarouselContent className="h-full">
          {imageUrls.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div
                className={`${imageContainerClassName} w-full overflow-hidden`}
              >
                <img
                  src={
                    image.startsWith("/estates/")
                      ? `/placeholder.svg?height=400&width=700&text=${encodeURIComponent(
                          "Imagen " + (index + 1)
                        )}`
                      : image
                  }
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8  border-gray-200/50 shadow-sm opacity-100 transition-opacity duration-200" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/40 border border-gray-200/50 shadow-sm opacity-100 transition-opacity duration-200" />
      </Carousel>

      {showBadge && (
        <Badge
          className={`absolute right-2 top-2 z-10 ${
            isForRent
              ? "bg-black text-white"
              : "bg-amber-400 text-white"
          }`}
          variant="secondary"
        >
          {isForRent ? "En Arriendo" : "En Venta"}
        </Badge>
      )}

      {showIndicators && imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
          {imageUrls.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
