"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { totalItems } = useCart();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "glass border-b border-white/10 py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                        E
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all">
                        LuxeMarket
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {[
                        { name: "Home", href: "/" },
                        { name: "Shop", href: "/shop" },
                        { name: "Categories", href: "/categories" },
                        { name: "About", href: "/about" },
                    ].map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors relative group",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                                )}
                            >
                                {item.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all",
                                    isActive ? "w-full" : "w-0 group-hover:w-full"
                                )}></span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Search Toggle */}
                    <AnimatePresence>
                        {searchOpen ? (
                            <motion.form
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onSubmit={handleSearch}
                                className="relative flex-1 md:flex-initial"
                            >
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-[200px] h-10 pl-3 pr-8 rounded-full bg-secondary/50 border border-transparent focus:border-primary focus:bg-background outline-none text-sm transition-all"
                                />
                                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                                    <X className="size-4" />
                                </button>
                            </motion.form>
                        ) : (
                            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-colors">
                                <Search className="size-5" />
                            </button>
                        )}
                    </AnimatePresence>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative group"
                        onClick={() => router.push('/cart')}
                    >
                        <ShoppingBag className="size-5 group-hover:text-primary transition-colors" />
                        {isMounted && totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in">
                                {totalItems}
                            </span>
                        )}
                    </Button>

                    <Button
                        className="hidden md:inline-flex rounded-full"
                        size="sm"
                        onClick={() => router.push('/signin')}
                    >
                        Sign In
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
                            {[
                                { name: "Home", href: "/" },
                                { name: "Shop", href: "/shop" },
                                { name: "Categories", href: "/categories" },
                                { name: "About", href: "/about" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "text-2xl font-bold transition-colors",
                                        pathname === item.href ? "text-primary" : "text-foreground"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <Link
                                href="/signin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-4"
                            >
                                <Button className="w-full h-14 rounded-2xl text-lg">Sign In</Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
