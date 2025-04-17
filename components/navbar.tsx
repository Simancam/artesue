"use client"

import { useState } from "react";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: "inicio", text: "Inicio", active: false },
    { href: "propiedades", text: "Propiedades", active: true },
    { href: "nosotros", text: "Nosotros", active: false },
    { href: "contacto", text: "Contáctanos", active: false },
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative z-50">
      <div className="max-w-screen-xl mx-auto p-4 flex flex-wrap items-center justify-between">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image
            src="/file.svg"
            alt="Artesue Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Artesue
          </span>
        </a>

        {/* Button to toggle menu */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Menú para escritorio - siempre visible en md y superior */}
        <div className="hidden md:block w-auto">
          <ul className="font-medium flex flex-row space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={item.href} 
                  className={`${
                    item.active 
                    ? "text-yellow-500 hover:text-yellow-600" 
                    : "text-gray-900 dark:text-white hover:text-yellow-500"
                  } transition-colors duration-300`}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menú móvil con animación fade elegante */}
      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden transition-all duration-500 ease-in-out ${
          isOpen 
            ? "opacity-100 translate-y-0 visible" 
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <ul className="flex flex-col p-4 space-y-2">
          {navItems.map((item, index) => (
            <li key={index} className={`transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`} style={{ transitionDelay: `${index * 75}ms` }}>
              <a 
                href={item.href} 
                className={`block py-2 px-3 rounded ${
                  item.active 
                  ? "text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700" 
                  : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors duration-300`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;