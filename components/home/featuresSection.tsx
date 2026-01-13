"use client"
import { Home, Key, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const FeaturesSection = () => {
  const featuresData = [
    {
      title: "Variedad de propiedades",
      description:
        "Contamos con casas, apartamentos, fincas y lotes en las mejores zonas para que encuentres el lugar ideal según tus necesidades.",
      icon: Home,
      size: "large",
    },
    {
      title: "Proceso seguro",
      description:
        "Aseguramos cada paso de la transacción con contratos claros, asesoría legal y acompañamiento personalizado.",
      icon: ShieldCheck,
      size: "medium",
    },
    {
      title: "Acceso inmediato",
      description:
        "Visualiza toda la información de los inmuebles y programa tu visita con un solo clic, sin intermediarios.",
      icon: Key,
      size: "medium",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section className="min-h-screen flex items-center py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-6">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 bg-amber-400 text-white text-lg rounded-full"
          >
            Somos tu mejor opción
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900"
          >
            Soluciones inmobiliarias confiables y modernas
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Descubre por qué somos la mejor opción para ayudarte a comprar, vender o alquilar tu propiedad.
            </p>
            <div className="w-16 h-1 bg-amber-400 mx-auto mt-6"></div>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr"
        >
          {featuresData.map((feature, index) => {
            const Icon = feature.icon
            const getGridClass = () => {
              switch (feature.size) {
                case "large":
                  return "md:col-span-2 lg:col-span-1"
                case "medium":
                  return "md:col-span-1"
                default:
                  return ""
              }
            }

            return (
              <motion.div key={index} variants={itemVariants} className={`${getGridClass()}`}>
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:-translate-y-2">
                  <CardContent className="p-8 h-full flex flex-col space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full  opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-4 rounded-full w-fit">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 relative">
                        {feature.title}
                        <div className="w-12 h-1 bg-amber-400 mt-3 transition-all duration-300 group-hover:w-16"></div>
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
