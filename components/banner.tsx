import React from "react";
import Image from "next/image";

interface BannerProps {
  imageUrl: string;
  height?: string; // puedes ajustar el alto con props si deseas
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({ imageUrl, height = "60vh", children }) => {
  return (
    <div className="relative w-full" style={{ height }}>
      {/* Imagen de fondo */}
      <Image
        src={imageUrl}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
      />

      {/* Capa oscura encima de la imagen */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

      {/* Contenido encima del banner */}
      <div className="absolute inset-0 z-20 flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
};

export default Banner;
