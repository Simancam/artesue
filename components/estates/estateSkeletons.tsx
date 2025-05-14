"use client"

import { Skeleton } from "@/components/ui/skeleton"

/**
 * Componente que muestra un esqueleto de carga para las tarjetas de propiedades
 */
export function EstateCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
      {/* Skeleton de imagen */}
      <Skeleton className="h-48 w-full" />

      {/* Skeleton del encabezado */}
      <div className="flex flex-col space-y-1.5 p-4 pb-0">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {/* Skeleton del contenido principal */}
      <div className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-slate-200 my-4" />

        <div className="flex items-baseline justify-between">
          <div>
            <Skeleton className="h-4 w-12 mb-1" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Skeleton del pie de la tarjeta */}
      <div className="flex gap-1 p-4 pt-0 mt-auto">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

/**
 * Componente que muestra múltiples tarjetas skeleton en formato grid
 */
export function EstateGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <EstateCardSkeleton key={index} />
        ))}
    </div>
  )
}

/**
 * Componente que muestra un esqueleto de carga para la vista detallada de una propiedad
 */
export function EstateDetailsSkeleton() {
  return (
    <div className="w-full mx-auto">
      {/* Skeleton del encabezado */}
      <div className="mb-5 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <Skeleton className="h-8 sm:h-10 w-2/3" />
          <Skeleton className="h-6 w-24 self-start" />
        </div>
        <div className="mt-2 sm:mt-3 flex items-center gap-2">
          <Skeleton className="h-5 w-5 flex-shrink-0" />
          <Skeleton className="h-5 sm:h-6 w-60" />
        </div>
      </div>

      {/* Sección principal con imagen e información básica */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-8 sm:mb-12">
        {/* Columna izquierda - Carrusel de imágenes */}
        <div className="w-full lg:w-3/5">
          <Skeleton className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[500px] rounded-lg" />
        </div>

        {/* Columna derecha - Información básica */}
        <div className="w-full lg:w-2/5 mt-4 lg:mt-0">
          <div className="bg-slate-50 rounded-lg p-4 sm:p-6 h-full">
            <div className="mb-4 sm:mb-6">
              <Skeleton className="h-7 sm:h-8 w-48 mb-4 sm:mb-6" />
              <div className="grid grid-cols-2 gap-y-4 sm:gap-y-6">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 sm:h-8 w-32" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 sm:h-6 w-24" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 sm:h-6 w-20" />
                </div>
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-5 sm:h-6 w-28" />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-200 my-4 sm:my-6" />

            <div className="mb-4 sm:mb-6">
              <Skeleton className="h-7 sm:h-8 w-48 mb-4" />
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full mb-2" />
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-5 sm:h-6 w-6" />
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-slate-200 my-4 sm:my-6" />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Skeleton className="h-10 sm:h-12 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton de la descripción */}
      <div className="mb-6 sm:mb-12">
        <Skeleton className="h-7 sm:h-8 w-40 mb-4" />
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
          
          <div className="flex items-center gap-2 mt-4 sm:mt-6">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </div>

      {/* Skeleton de características */}
      <div className="mb-6 sm:mb-12">
        <Skeleton className="h-7 sm:h-8 w-40 mb-4" />
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 flex-shrink-0" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Skeleton de información de contacto */}
      <div className="mb-6 sm:mb-12">
        <Skeleton className="h-7 sm:h-8 w-56 mb-4" />
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full flex-shrink-0" />
                <div className="min-w-0">
                  <Skeleton className="h-6 sm:h-7 w-40 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 flex-shrink-0" />
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 flex-shrink-0" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center mt-4 md:mt-0">
              <div className="bg-slate-50 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-5 w-5 flex-shrink-0" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 sm:h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}