import React from "react";
import { Card, CardContent } from "../ui/card";
import { ShieldCheck, Eye, Gem } from "lucide-react";

interface IPhilosophyCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const PhilosophyCard: React.FC<IPhilosophyCardProps> = ({ icon: Icon, title, description }) => (
  <Card className="flex items-start gap-4 p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
    <Icon className="h-10 w-10 text-amber-500 flex-shrink-0 mt-1" />
    <div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <CardContent className="text-gray-700 p-0">
        {description}
      </CardContent>
    </div>
  </Card>
);

const philosophyData = [
  {
    icon: ShieldCheck,
    title: "Misión",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempor orci urna, vitae convallis justo dictum at. Mauris pharetra neque sit amet euismod euismod."
  },
  {
    icon: Eye,
    title: "Visión",
    description:
      "Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc malesuada."
  },
  {
    icon: Gem,
    title: "Valores",
    description:
      "Mauris pharetra neque sit amet euismod euismod. Quisque quis lorem nec enim placerat elementum. Vivamus euismod orci quis nunc."
  }
];

const PhilosophySection = () => {
  return (
    <div>
      <div className="w-full px-6 pt-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nuestra Filosofía
          </h2>
          <p className="text-lg text-gray-700 mt-2">
            Conoce más sobre lo que nos impulsa y guía en cada proyecto que
            desarrollamos.
          </p>
        </div>
      </div>

      <section className="w-full px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {philosophyData.map((item, index) => (
            <PhilosophyCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PhilosophySection;