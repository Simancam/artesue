import "./globals.css";
import { Raleway, Poppins } from "next/font/google";

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
  return (
    <html lang="es" className={`${raleway.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
