"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const Formulario = () => {
  return (
    <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
      <h2 className="text-2xl font-bold mb-6">Contacta con nosotros</h2>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombres">
              Nombres <span className="text-red-500">*</span>
            </Label>
            <Input id="nombres" placeholder="Digite su nombre..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input id="apellidos" placeholder="Digite su apellido..." required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">
            Ciudad <span className="text-red-500">*</span>
          </Label>
          <Input id="ciudad" placeholder="Digite la ciudad..." required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">
            Correo <span className="text-red-500">*</span>
          </Label>
          <Input id="correo" type="email" placeholder="example@gmail.com" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input id="telefono" placeholder="+1123 4567890" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensaje">
            Mensaje <span className="text-red-500">*</span>
          </Label>
          <Textarea id="mensaje" placeholder="Digite su mensaje..." className="min-h-[120px]" required />
        </div>

        <Button type="submit" className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-white">
          Enviar mensaje
        </Button>
      </form>
    </div>
  )
}

export default Formulario