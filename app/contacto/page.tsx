"use client"

import Navbar from "@/components/navbar"
import Banner from "@/components/banner"
import Footer from "@/components/footer"
import Sedes from "@/components/contact/sitesInfo"
import Formulario from "@/components/contact/contactForm"

const Contacto = () => {
  return (
    <>
      <Navbar />
      <Banner imageUrl="/banner.jpg" height="50vh">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            ¿Listo para encontrar tu lugar ideal?
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md">
            Contáctanos y déjanos ayudarte a dar el siguiente gran paso.
          </p>
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
