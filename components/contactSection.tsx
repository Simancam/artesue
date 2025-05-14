'use client';

import { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sendEmail } from '@/lib/email';
import { Label } from '@/components/ui/label';

export const ContactSection = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const alertRef = useRef<HTMLDivElement | null>(null);

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await sendEmail({
      nombres: formData.get('nombres') as string,
      correo: formData.get('correo') as string,
      mensaje: formData.get('mensaje') as string,
    });

    setIsSuccess(result);
    setShowAlert(true);
    setLoading(false);
    formRef.current?.reset();
  };

  return (
    <div>
      <section className="bg-amber-400 text-white rounded-t-3xl py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Contáctate con nosotros</h2>
            <p className="text-white/90 mb-8 max-w-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <ul className="space-y-5 text-white/90 text-sm">
              <li className="flex items-center gap-3">
                <Mail size={20} />
                contacto@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} />
                +57 300 649 5480
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={20} />
                Cra 10 # 84A - 05
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} />
                Horario de atención: 9 a.m. - 6 p.m.
              </li>
            </ul>
          </div>

          <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
            <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="correo" className="text-sm font-medium text-gray-700 block mb-1">
                  Correo <span className="text-red-500">*</span>
                </Label>
                <Input name="correo" id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="nombres" className="text-sm font-medium text-gray-700 block mb-1">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input name="nombres" id="name" type="text" required />
              </div>
              <div>
                <Label htmlFor="mensaje" className="text-sm font-medium text-gray-700 block mb-1">
                  Mensaje <span className="text-red-500">*</span>
                </Label>
                <Textarea name="mensaje" id="message" rows={4} required />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-400 hover:bg-amber-500 text-white w-full"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Alerta personalizada */}
      {showAlert && (
        <div
          ref={alertRef}
          className={`fixed bottom-4 right-4 z-50 w-80 md:w-96 animate-slide-in-right p-4 rounded-lg shadow-lg border ${
            isSuccess ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
          }`}
        >
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
                  isSuccess ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {isSuccess ? '¡Gracias por contactarnos!' : 'Error'}
              </h3>
              <p
                className={`mt-1 text-sm leading-normal ${
                  isSuccess ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {isSuccess
                  ? 'Hemos recibido tu mensaje. Nos pondremos en contacto contigo lo antes posible.'
                  : 'Ha ocurrido un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.'}
              </p>
            </div>
          </div>

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
  );
};
