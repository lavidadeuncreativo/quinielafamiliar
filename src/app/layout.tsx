import type { Metadata } from "next";
import { Barlow_Condensed, Montserrat } from "next/font/google";
import "./globals.css";
import { PublicNav } from "@/components/PublicNav";

const bodyFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Quiniela Familiar Mundial 2026",
  description: "Dashboard publico de la Quiniela Familiar Mundial 2026.",
  openGraph: {
    title: "Quiniela Familiar Mundial 2026",
    description: "Tabla, puntos, premios, partidos y reglas de la quiniela familiar.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <PublicNav />
        {children}
      </body>
    </html>
  );
}
