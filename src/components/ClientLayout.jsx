"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import TopBar from "@/components/TopBar";
import { CartProvider } from "@/context/CartContext";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    // Hide default header/footer for admin routes and auth pages
    const shouldHideHeaderFooter = pathname === "/signin" || pathname.startsWith("/admin");

    return (
        <CartProvider>
            <SmoothScroll>
                {/* {!shouldHideHeaderFooter && <TopBar />} */}
                {!shouldHideHeaderFooter && <Header />}
                <main className={`flex-1 ${!shouldHideHeaderFooter ? "pt-24 pb-12" : "min-h-screen"}`}>
                    {children}
                </main>
                {!shouldHideHeaderFooter && <Footer />}
            </SmoothScroll>
        </CartProvider>
    );
}
