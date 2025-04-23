import React from "react";
import Image from "next/image";

interface BannerProps {
  imageUrl: string;
  height?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({
  imageUrl,
  height = "60vh",
  overlayOpacity = 0.4,
  children,
}) => {
  return (
    <div className="relative w-full" style={{ height }}>
      <Image
        src={imageUrl}
        alt="Banner"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
      />

      <div 
        className="absolute inset-0 z-10" 
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      <div className="absolute inset-0 z-20 flex items-center justify-center text-white">
        {children}
      </div>
    </div>
  );
};

export default Banner;