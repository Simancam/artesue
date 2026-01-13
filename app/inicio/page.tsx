"use client";

import Navbar from "@/components/navbar";
import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ContactSection } from "@/components/contactSection";
import FeaturesSection from "@/components/home/featuresSection";
import Footer from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const Inicio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef}>
      <Navbar />

      {/* Hero Section with Animation */}
      <div className="relative h-screen overflow-hidden">
        <Banner
          imageUrl="https://plus.unsplash.com/premium_photo-1661427097113-2e42e8b0070e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QWRtaW5pc3RyYWNpJUMzJUIzbiUyMGRlJTIwcHJvcGllZGFkZXN8ZW58MHx8MHx8fDA%3D"
          height="100vh"
        >
          <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg"
            >
              Tu nuevo hogar te está esperando
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-xl md:text-2xl lg:text-3xl text-white drop-shadow-md max-w-4xl"
            >
              Explora nuestras propiedades y encuentra el lugar perfecto para ti
              y tu familia.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8"
            >
              <Link href="/propiedades">
                <Button className="bg-amber-400 hover:bg-amber-500 text-lg px-8 py-4 h-auto">
                  Ver Proiedades
                </Button>
              </Link>
            </motion.div>
          </div>
        </Banner>
      </div>

      {/* Main Content Section */}
      <section className="min-h-screen bg-white flex items-center relative">
        <div className="w-full px-6 py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Encuentra la casa de tus sueños
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Tenemos una amplia variedad de propiedades que se adaptan a
                todas las necesidades y presupuestos. Da el primer paso hacia tu
                nuevo hogar hoy mismo.
              </p>
              <Link href="/nosotros">
                <Button className="bg-amber-400 hover:bg-amber-500 text-lg px-8 py-4 h-auto">
                  Explorar más
                </Button>
              </Link>
            </div>
            <motion.div style={{ y }} className="flex justify-center relative">
              <div className="w-full max-w-[600px] aspect-[16/9] relative">
                <Image
                  src="/houseSearch.svg"
                  alt="Casa de tus sueños"
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Curved Transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg
            className="relative block w-full h-20 md:h-32"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-gradient-to-br fill-indigo-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section with gradient background */}
      <div className="bg-gradient-to-br bg-indigo-50 relative">
        <FeaturesSection />
      </div>

      <ContactSection />
      <Footer />
    </div>
  );
};

export default Inicio;
