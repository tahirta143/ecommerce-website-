import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LuxeMarket | Modern E-Commerce",
  description: "Experience the future of shopping.",
};

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased min-h-screen flex flex-col font-sans bg-background text-foreground selection:bg-primary selection:text-white"
        )}
      >
        <CartProvider>
          <Header />
          <main className="flex-1 pt-24 pb-12">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
