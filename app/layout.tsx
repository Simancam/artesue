// app/layout.tsx
"use client";

import "./globals.css";
import { Raleway, Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import WhatsappButton from "@/components/wspButton";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-raleway",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const whatsappNumber = "573001234567";

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <html lang="es" className={`${raleway.variable} ${poppins.variable}`}>
      <body className="relative">
        {children}
        {!isDashboard && (
          <WhatsappButton phoneNumber={whatsappNumber} />
        )}
      </body>
    </html>
  );
}
