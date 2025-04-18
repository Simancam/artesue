import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  companyName: string;
  logoUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  simancaUrl?: string;
}

const Footer: React.FC<FooterProps> = ({
  companyName,
  logoUrl,
  logoWidth = 120,
  logoHeight = 40,
  simancaUrl = "https://simanca.com",
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-3">
            <Image
              src={logoUrl}
              alt={`${companyName} logo`}
              width={logoWidth}
              height={logoHeight}
              className="h-12"
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
                href={simancaUrl}
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

// Ejemplo de uso
export function FooterExample() {
  return (
    <Footer
      companyName="PropTech"
      logoUrl="/logo-placeholder.svg"
      simancaUrl="https://simanca.com"
    />
  );
}
