"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EstatesFilter from "@/components/estates/estatesFilter";
import { EstateCard } from "@/components/estates/estateCard";
import Banner from "@/components/banner";
import {
  EstatesService,
  IEstate,
} from "@/components/estates/services/estatesService";

// Define la interfaz ProcessedFilters localmente si no está exportada desde EstatesFilter
interface ProcessedFilters {
  transactionType?: string;
  city?: string;
  minArea?: number;
  maxArea?: number;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
}

const Propiedades = () => {
  const [estates, setEstates] = useState<IEstate[]>([]);
  const [filteredEstates, setFilteredEstates] = useState<IEstate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await EstatesService.getAllEstates();
        setEstates(data);
        setFilteredEstates(data);
      } catch (e) {
        console.error("Error al cargar propiedades:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilterChange = async (filters: ProcessedFilters) => {
    if (Object.keys(filters).length === 0) {
      setFilteredEstates(estates);
    } else {
      const result = await EstatesService.filterEstates(filters);
      setFilteredEstates(result);
    }
  };

  return (
    <>
      <Navbar />
      <Banner imageUrl="/banner.jpg" height="50vh">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Explora Nuestros Lotes Disponibles
          </h1>
          <p className="mt-4 text-lg text-white drop-shadow-md">
            Elige el lugar perfecto para tu proyecto
          </p>
        </div>
      </Banner>

      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <EstatesFilter onFilterChange={handleFilterChange} />
      </div>

      <section className="py-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {filteredEstates.length === estates.length
                ? "Propiedades Disponibles"
                : `Propiedades Filtradas (${filteredEstates.length})`}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEstates.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEstates.map((estate) => (
                <EstateCard key={estate.id} estate={estate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-xl font-medium text-gray-500">
                No se encontraron propiedades con los filtros aplicados
              </h3>
              <p className="mt-2 text-gray-400">
                Intenta ajustar los criterios de búsqueda
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer/>
    </>
  );
};

export default Propiedades;