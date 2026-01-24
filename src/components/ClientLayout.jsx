"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import TopBar from "@/components/TopBar";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/signin";

    return (
        <CartProvider>
            <SmoothScroll>
                {/* {!isAuthPage && <TopBar />} */}
                {!isAuthPage && <Header />}
                <main className={`flex-1 ${!isAuthPage ? "pt-24 pb-12" : "min-h-screen"}`}>
                    {children}
                </main>
                {!isAuthPage && <Footer />}
            </SmoothScroll>
        </CartProvider>
    );
}
