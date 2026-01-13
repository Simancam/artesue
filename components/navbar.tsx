"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "inicio", text: "Inicio", active: false },
    { href: "propiedades", text: "Propiedades", active: true },
    { href: "nosotros", text: "Nosotros", active: false },
    { href: "contacto", text: "Contáctanos", active: false },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-gray-200/50 shadow-sm"
          : "bg-white border-gray-200"
      } border-b dark:bg-gray-900`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="relative w-20 h-20">
            <Image
              src="/logo.png"
              alt="Artesue Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </Link>

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

        <div className="hidden md:block w-auto">
          <ul className="font-medium flex flex-row space-x-8">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`text-lg py-2 px-3 rounded-md transition-colors duration-300 ${
                    item.active
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-900 dark:text-white hover:text-yellow-500"
                  }`}
                >
                  {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`absolute top-full left-0 w-full ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md dark:bg-gray-800/90"
            : "bg-white dark:bg-gray-800"
        } border-t border-gray-200 dark:border-gray-700 md:hidden transition-all duration-500 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <ul className="flex flex-col p-4 space-y-2">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <Link
                href={item.href}
                className={`block py-3 px-3 rounded text-lg ${
                  item.active
                    ? "text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                } transition-colors duration-300`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
