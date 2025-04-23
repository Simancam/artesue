"use client"

import { useState } from "react"
import { MapPin, Phone, Mail } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const sedes = [
  {
    id: "cdmx",
    nombre: "Ciudad de México",
    direccion: "Cra 14 #4A-10",
    telefono: "+57 300 9278950",
    correo: "example@gmail.com",
    coordenadas: "19.4326,-99.1332",
  },
  {
    id: "guadalajara",
    nombre: "Guadalajara",
    direccion: "Av. Chapultepec #223",
    telefono: "+52 33 1234 5678",
    correo: "guadalajara@example.com",
    coordenadas: "20.6597,-103.3496",
  },
  {
    id: "monterrey",
    nombre: "Monterrey",
    direccion: "Blvd. Antonio L. Rodríguez #3000",
    telefono: "+52 81 8765 4321",
    correo: "monterrey@example.com",
    coordenadas: "25.6866,-100.3161",
  },
]

const Sedes = () => {
  const [sedeSeleccionada, setSedeSeleccionada] = useState(sedes[0])

  const cambiarSede = (sedeId: string) => {
    const sede = sedes.find((s) => s.id === sedeId)
    if (sede) {
      setSedeSeleccionada(sede)
    }
  }

  return (
    <div className="w-full md:w-2/5 bg-amber-400 p-8 md:p-12">
      <h2 className="text-3xl font-bold text-white mb-6">Nuestras sede</h2>

      <div className="mb-8">
        <Select onValueChange={cambiarSede} defaultValue={sedeSeleccionada.id}>
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Selecciona una sede" />
          </SelectTrigger>
          <SelectContent>
            {sedes.map((sede) => (
              <SelectItem key={sede.id} value={sede.id}>
                {sede.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 text-white">
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Dirección:</p>
            <p>{sedeSeleccionada.direccion}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Teléfono:</p>
            <p>{sedeSeleccionada.telefono}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Correo:</p>
            <p>{sedeSeleccionada.correo}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-lg overflow-hidden shadow-lg h-[250px] md:h-[300px]">
        <iframe
          src={`https://maps.google.com/maps?q=${sedeSeleccionada.coordenadas}&z=15&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${sedeSeleccionada.nombre}`}
        ></iframe>
      </div>
    </div>
  )
}

export default Sedes
