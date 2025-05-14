"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { sendEmail } from "@/lib/email";

const Formulario = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // Efecto para ocultar la alerta después de 5 segundos
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (showAlert) {
      timeoutId = setTimeout(() => {
        // Añadir clase de animación de salida antes de ocultar
        if (alertRef.current) {
          alertRef.current.classList.remove("animate-slide-in-right");
          alertRef.current.classList.add("animate-slide-out-right");

          // Esperar a que termine la animación antes de ocultar
          setTimeout(() => {
            setShowAlert(false);
          }, 300); // Duración de la animación
        }
      }, 5000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showAlert]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setShowAlert(false); // Ocultar cualquier alerta previa

    const formData = new FormData(e.currentTarget);

    try {
      const result = await sendEmail({
        nombres: formData.get("nombres") as string,
        apellidos: formData.get("apellidos") as string,
        ciudad: formData.get("ciudad") as string,
        correo: formData.get("correo") as string,
        telefono: formData.get("telefono") as string,
        mensaje: formData.get("mensaje") as string,
      });

      console.log("Resultado de sendEmail:", result);

      // Mostrar siempre el mensaje de éxito
      setIsSuccess(true);
      setShowAlert(true);

      // Usar la referencia del formulario para resetearlo
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setIsSuccess(false);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar manualmente la alerta
  const closeAlert = () => {
    if (alertRef.current) {
      alertRef.current.classList.remove("animate-slide-in-right");
      alertRef.current.classList.add("animate-slide-out-right");

      setTimeout(() => {
        setShowAlert(false);
      }, 300);
    }
  };

  return (
    <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
      <h2 className="text-2xl font-bold mb-6">Contacta con nosotros</h2>

      {/* Alerta posicionada en la esquina inferior derecha */}
      {showAlert && (
        <div
          ref={alertRef}
          className="fixed bottom-4 right-4 z-50 w-80 md:w-96 animate-slide-in-right"
        >
          {showAlert && (
            <div
              ref={alertRef}
              className={`fixed bottom-4 right-4 z-50 w-80 md:w-96 animate-slide-in-right p-4 rounded-lg shadow-lg border ${
                isSuccess
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              {/* Icono + texto */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isSuccess ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-sm font-semibold ${
                      isSuccess ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isSuccess ? "¡Gracias por contactarnos!" : "Error"}
                  </h3>
                  <p
                    className={`mt-1 text-sm leading-normal ${
                      isSuccess ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isSuccess
                      ? "Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible."
                      : "Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde."}
                  </p>
                </div>
              </div>

              {/* Botón de cerrar */}
              <button
                onClick={closeAlert}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cerrar notificación"
              >
                <XCircle className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          )}
        </div>
      )}

      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nombres">
              Nombres <span className="text-red-500">*</span>
            </Label>
            <Input
              name="nombres"
              id="nombres"
              placeholder="Digite su nombre..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellidos">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input
              name="apellidos"
              id="apellidos"
              placeholder="Digite su apellido..."
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">
            Ciudad <span className="text-red-500">*</span>
          </Label>
          <Input
            name="ciudad"
            id="ciudad"
            placeholder="Digite la ciudad..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="correo">
            Correo <span className="text-red-500">*</span>
          </Label>
          <Input
            name="correo"
            id="correo"
            type="email"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">
            Teléfono <span className="text-red-500">*</span>
          </Label>
          <Input
            name="telefono"
            id="telefono"
            placeholder="+1123 4567890"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mensaje">
            Mensaje <span className="text-red-500">*</span>
          </Label>
          <Textarea
            name="mensaje"
            id="mensaje"
            placeholder="Digite su mensaje..."
            className="min-h-[120px]"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-amber-400 hover:bg-amber-500 text-white"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </div>
  );
};

export default Formulario;
