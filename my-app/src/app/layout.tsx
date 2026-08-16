import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"], 
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pencil Edutech",
  description: "Pencil Edutech — questões de lógica e pensamento computacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.className} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
