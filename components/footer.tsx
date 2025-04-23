import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const companyName = "Artesue";
  const logoUrl = "/logo-placeholder.svg";
  const logoWidth = 120;
  const logoHeight = 40;
  const developerUrl = "https://simanca.com";

  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={logoWidth}
              height={logoHeight}
              className="h-6 mb-2 md:mb-0 md:mr-2"
            />
            <span className="text-lg font-medium text-gray-800">
              {companyName}
            </span>
          </div>

          <div className="text-center text-sm text-gray-600 md:text-right">
            <p>
              &copy; {currentYear} {companyName}. Todos los derechos reservados.
            </p>
            <p className="mt-1">
              Developed by{" "}
              <Link
                href={developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-800 transition-transform duration-300 hover:scale-110"
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