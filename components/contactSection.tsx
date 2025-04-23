'use client';

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';

export const ContactSection = () => {
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
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                Correo <span className="text-red-500">*</span>
              </label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input id="name" type="text" required />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-gray-700 block mb-1">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <Textarea id="message" rows={4} required />
            </div>
            <Button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-white w-full"
            >
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </section>
  </div>
  );
};
