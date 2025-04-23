import Navbar from "@/components/navbar";
import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ContactSection } from "@/components/contactSection";
import FeaturesSection from "@/components/home/featuresSection";
import Footer from "@/components/footer";

const Inicio = () => {
  return (
    <>
      <Navbar />
      <Banner imageUrl="/banner.jpg" height="50vh">
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Tu nuevo hogar te está esperando
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md">
            Explora nuestras propiedades y encuentra el lugar perfecto para ti y
            tu familia.
          </p>
          <div className="mt-6">
            <Button className="bg-amber-400 hover:bg-amber-500">
              Ver propiedades
            </Button>
          </div>
        </div>
      </Banner>

      <section className="w-full px-6 py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
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
          <div className="flex justify-center">
            <div className="w-[1000px] h-[350px] relative">
              <Image
                src="/houseSearch.svg"
                alt="Casa de tus sueños"
                fill
                className="object-contain"
                sizes="500px"
              />
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />
      <ContactSection />
      <Footer/>
    </>
  );
};

export default Inicio;