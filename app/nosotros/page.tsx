import Banner from "@/components/banner";
import Navbar from "@/components/navbar";
import Image from "next/image";
import PhilosophySection from "@/components/about/philosophySection";
import { Button } from "@/components/ui/button";
import { ContactSection } from "@/components/contactSection";
import Footer from "@/components/footer";

const Nosotros = () => {
  return (
    <>
      <Navbar />
      <Banner imageUrl="/banner.jpg" height="50vh">
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Conócenos
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md">
            Somos un equipo apasionado por ayudarte a encontrar tu hogar ideal.
          </p>
        </div>
      </Banner>
      <section className="w-full px-6 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center relative w-full aspect-[16/9]">
            <Image
              src="/constructionHouse.svg"
              alt="Casa de tus sueños"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Encuentra la casa de tus sueños
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Tenemos una amplia variedad de propiedades que se adaptan a todas
              las necesidades y presupuestos. Da el primer paso hacia tu nuevo
              hogar hoy mismo.
            </p>
            <Button className="bg-amber-400 hover:bg-amber-500">
              Explorar más
            </Button>
          </div>
        </div>
      </section>
      <PhilosophySection />
      <ContactSection />
      <Footer />
    </>
  );
};

export default Nosotros;