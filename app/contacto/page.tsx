"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/navbar"
import Banner from "@/components/banner"
import Footer from "@/components/footer"
import Sedes from "@/components/contact/sitesInfo"
import Formulario from "@/components/contact/contactForm"

const Contacto = () => {
  return (
    <>
      <Navbar />
      <Banner imageUrl="https://cdn.prod.website-files.com/6643a82fc46ca462b5ef9921/6643a82fc46ca462b5efa8cd_65847753f63f3947d2c394b3_4-Todo-sobre-la-gestio%25CC%2581n-inmobiliaria-%25C2%25BFQue-es-y-para-que-sirve.webp" height="100vh">
      <div className="flex flex-col items-center justify-center h-full text-center px-4 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg"
            >
              ¿Listo para encontrar tu lugar ideal?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-xl md:text-2xl lg:text-3xl text-white drop-shadow-md max-w-4xl"
            >
              Contáctanos y déjanos ayudarte a dar el siguiente gran paso.
            </motion.p>
          </div>
      </Banner>

      <section className="w-full">
        <div className="flex flex-col md:flex-row">
          <Sedes />
          <Formulario />
        </div>
      </section>

      <Footer/>
    </>
  )
}

export default Contacto
