"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Eye, Gem } from "lucide-react"
import { motion } from "framer-motion"

const PhilosophySection = () => {
  const philosophyData = [
    {
      icon: ShieldCheck,
      title: "Misión",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor orci urna, vitae convallis justo dictum at. Mauris pharetra neque sit amet euismod euismod.",
      size: "large",
    },
    {
      icon: Eye,
      title: "Visión",
      description: "Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc malesuada.",
      size: "medium",
    },
    {
      icon: Gem,
      title: "Valores",
      description:
        "Mauris pharetra neque sit amet euismod euismod. Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc.",
      size: "medium",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="min-h-screen flex items-center py-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">Nuestra Filosofía</h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Conoce más sobre lo que nos impulsa y guía en cada proyecto que desarrollamos.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          {philosophyData.map((item, index) => {
            const Icon = item.icon
            const getGridClass = () => {
              switch (item.size) {
                case "large":
                  return "md:col-span-2 md:row-span-1"
                case "medium":
                  return "md:col-span-1 md:row-span-1"
                default:
                  return ""
              }
            }

            return (
              <motion.div key={index} variants={itemVariants} className={`${getGridClass()}`}>
                <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white">
                  <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-4 rounded-full">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
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

export default PhilosophySection
