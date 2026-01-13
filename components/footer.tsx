import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const companyName = "Artesue";
  const logoUrl = "/logo.png";
  const developerUrl = "https://simanca.com";

  return (
    <footer style={{ backgroundColor: '#0A1F44' }} className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-24 h-24 relative">
              <Image
                src={logoUrl}
                alt={`${companyName} logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          <div className="text-center text-sm text-white md:text-right">
            <p>
              &copy; {currentYear} {companyName}. Todos los derechos reservados.
            </p>
            <p className="mt-1">
              Developed by{" "}
              <Link
                href={developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline hover:scale-110 transition-transform duration-300"
              >
                Simanca
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
