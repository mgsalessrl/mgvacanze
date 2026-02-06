import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nContext";
import { getSeoMetadata } from "@/lib/seo-config";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

import { Navbar } from "@/components/NavbarFooter";
import FooterClient from "@/components/FooterClient";
import IubendaScript from "@/components/IubendaScript";
import SpecialRequests from "@/components/SpecialRequests";
import AuthErrorListener from "@/components/AuthErrorListener";

export const metadata: Metadata = getSeoMetadata('/');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <I18nProvider>
          <AuthErrorListener />
          <Navbar />
          <div className="flex-grow animate-fade-in">
              {children}
          </div>
          <SpecialRequests />
          <FooterClient />
          <IubendaScript />
        </I18nProvider>
      </body>
    </html>
  );
}
