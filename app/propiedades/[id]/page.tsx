"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { EstateDetails } from "@/components/estates/estateDetails"
import type { IEstate } from "@/services/estatesService"
import Navbar from "@/components/navbar"
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
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error("La URL base de la API no está configurada")
        }

        const timestamp = new Date().getTime()
        const url = `${apiBaseUrl}/estates/${estateId}?t=${timestamp}`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status} ${response.statusText}`)
        }

        const responseText = await response.text()
        let data
        try {
          data = JSON.parse(responseText)
        } catch {
          throw new Error("Error al procesar la respuesta del servidor")
        }

        if (!data) {
          throw new Error("No se recibieron datos de la API")
        }

        const estateData = data.data || data.estate || data.property || data

        const processedEstate: IEstate = {
          id: estateData.id || estateId,
          title: estateData.title || "Sin título",
          location: estateData.location || "Ubicación no disponible",
          type: estateData.type || "No especificado",
          price: typeof estateData.price === "number" ? estateData.price : 0,
          isForRent: typeof estateData.isForRent === "boolean" ? estateData.isForRent : false,
          area: typeof estateData.area === "number" ? estateData.area : 0,
          features: Array.isArray(estateData.features) ? estateData.features : [],
          bedrooms: typeof estateData.bedrooms === "number" ? estateData.bedrooms : 0,
          bathrooms: typeof estateData.bathrooms === "number" ? estateData.bathrooms : 0,
          propertyCode: estateData.propertyCode || "N/A",
          description: estateData.description || "",
          zoning: estateData.zoning || "Residencial",
          image: estateData.image || null,
          images: Array.isArray(estateData.images) ? estateData.images : [],
          videoUrl: estateData.videoUrl || null,
          utilities: Array.isArray(estateData.utilities) ? estateData.utilities : null,
          documents: Array.isArray(estateData.documents) ? estateData.documents : null,
          agent: estateData.agent || null,
          createdAt: estateData.createdAt || null,
          updatedAt: estateData.updatedAt || null,
          city: estateData.city || null,
        }

        setEstate(processedEstate)
      } catch (err: unknown) {
        console.error("Error fetching estate details:", err)
        setError(
          `Error: ${
            typeof err === "object" && err !== null && "message" in err
              ? (err as { message?: string }).message
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
          <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-900"></div>
          </div>
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
