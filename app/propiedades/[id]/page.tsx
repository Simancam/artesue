"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { EstateDetails } from "@/components/estates/estateDetails"
import { EstateDetailsSkeleton } from "@/components/estates/estateSkeletons"
import type { IEstate } from "@/services/estatesService"
import { EstatesService } from "@/services/estatesService"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EstateDetailPage() {
  const params = useParams()
  const estateId = params.id as string
  const [estate, setEstate] = useState<IEstate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstateDetails = async () => {
      try {
        setLoading(true)
        const estateData = await EstatesService.getEstateById(estateId)
        setEstate(estateData)
      } catch (err: unknown) {
        console.error("Error fetching estate details:", err)
        setError(
          `Error: ${
            err instanceof Error 
            ? err.message 
            : "No se pudo cargar los detalles de la propiedad"
          }`
        )
      } finally {
        setLoading(false)
      }
    }

    if (estateId) {
      fetchEstateDetails()
    }
  }, [estateId])

  if (loading) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <EstateDetailsSkeleton />
        </div>
        <Footer />
      </>
    )
  }

  if (error || !estate) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="p-4 border rounded-md bg-red-50 text-red-700 max-w-md text-center">
              <p>{error || "No se encontró la propiedad solicitada."}</p>
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/propiedades">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a propiedades
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="w-full bg-white">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <Button variant="outline" size="sm" className="sm:size-default" asChild>
              <Link href="/propiedades">
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Volver a propiedades</span>
              </Link>
            </Button>
          </div>
          <EstateDetails estate={estate} />
        </div>
      </div>
      <Footer />
    </>
  )
}