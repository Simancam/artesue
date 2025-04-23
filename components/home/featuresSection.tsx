import React from "react";
import { Home, Key, ShieldCheck } from "lucide-react";

interface IFeatureCardProps {
  icon: React.ComponentType<{ size: number; strokeWidth: number; className: string }>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<IFeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <Icon
      size={48}
      strokeWidth={2}
      className="text-amber-400 transition-transform duration-300 hover:scale-110"
    />
    <h3 className="text-xl font-semibold mt-4 mb-2 relative after:block after:w-12 after:h-1 after:bg-amber-400 after:mt-2">
      {title}
    </h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const featuresData = [
  {
    title: "Variedad de propiedades",
    description:
      "Contamos con casas, apartamentos, fincas y lotes en las mejores zonas para que encuentres el lugar ideal según tus necesidades.",
    icon: Home,
  },
  {
    title: "Proceso seguro",
    description:
      "Aseguramos cada paso de la transacción con contratos claros, asesoría legal y acompañamiento personalizado.",
    icon: ShieldCheck,
  },
  {
    title: "Acceso inmediato",
    description:
      "Visualiza toda la información de los inmuebles y programa tu visita con un solo clic, sin intermediarios.",
    icon: Key,
  },
];

const FeaturesSection = () => {
  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-7xl mx-auto text-center">
        <span className="inline-block px-4 py-1 bg-amber-400 text-white text-sm rounded-full mb-4">
          Somos tu mejor opción
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Soluciones inmobiliarias confiables y modernas
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-10 relative after:block after:w-12 after:h-1 after:bg-amber-400 after:mt-3 after:mx-auto">
          Descubre por qué somos la mejor opción para ayudarte a comprar, vender o alquilar tu propiedad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;