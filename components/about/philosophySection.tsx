"use client"

import { ShieldCheck, Eye, Gem } from "lucide-react"
import { motion } from "framer-motion"

const PhilosophySection = () => {
  const philosophyData = [
    {
      icon: ShieldCheck,
      title: "Misión",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor orci urna, vitae convallis justo dictum at. Mauris pharetra neque sit amet euismod euismod.",
    },
    {
      icon: Eye,
      title: "Visión",
      description:
        "Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc malesuada. Donec tempor orci urna vitae convallis.",
    },
    {
      icon: Gem,
      title: "Valores",
      description:
        "Mauris pharetra neque sit amet euismod euismod. Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#eef2ff] from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
            Nuestra Filosofía
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Conoce más sobre lo que nos impulsa y guía en cada proyecto que desarrollamos.
          </p>
        </div>

        {/* Cards Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10"
        >
          {philosophyData.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.article
                key={index}
                variants={itemVariants}
                className="relative bg-white rounded-2xl p-8 md:p-6 lg:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-4">{item.title}</h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">{item.description}</p>

                {/* Decorative accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default PhilosophySection
