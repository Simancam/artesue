// app/layout.tsx o RootLayout.tsx
import "./globals.css";
import { Raleway, Poppins } from "next/font/google";
import WhatsappButton from "@/components/wspButton"; // Importa el componente

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

export const metadata = {
  title: "Artesue",
  description: "Descripción",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const whatsappNumber = "573001234567"; // Número en formato internacional

  return (
    <html lang="es" className={`${raleway.variable} ${poppins.variable}`}>
      <body className="relative">
        {children}
        <WhatsappButton phoneNumber={whatsappNumber} />
      </body>
    </html>
  );
}
