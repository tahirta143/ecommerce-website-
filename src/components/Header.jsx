"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, X, User } from "lucide-react";
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

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Categories", href: "/categories" },
        { name: "About", href: "/about" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out font-sans",
                scrolled || mobileMenuOpen
                    ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4 shadow-sm"
                    : "bg-transparent py-6 border-transparent"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex-1 md:flex-none">
                        <Link href="/" className="flex items-center gap-2 group w-max">
                            <div className="relative">
                                <div className="size-10 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xl shadow-xl group-hover:scale-105 transition-transform duration-300">
                                    L
                                </div>
                                <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary/30 to-violet-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                            </div>
                            <span className={cn(
                                "text-2xl font-black tracking-tighter transition-colors duration-300 hidden sm:block",
                                scrolled ? "text-black" : "text-black md:text-white mix-blend-difference"
                            )}>
                                Luxe<span className="font-light">Market</span>.
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Centered */}
                    <nav className="hidden md:flex items-center justify-center gap-1">
                        <div className={cn(
                            "flex items-center gap-1 p-1.5 rounded-full transition-all duration-300",
                            scrolled ? "bg-secondary/50" : "bg-white/10 backdrop-blur-md border border-white/20"
                        )}>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                            isActive
                                                ? "bg-white text-black shadow-md"
                                                : scrolled ? "text-muted-foreground hover:text-black hover:bg-white/50" : "text-white/80 hover:text-white hover:bg-white/20"
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Actions Section */}
                    <div className="flex items-center justify-end gap-2 flex-1 md:flex-none">

                        {/* Search Toggle */}
                        <AnimatePresence mode="wait">
                            {searchOpen ? (
                                <motion.form
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "240px" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    onSubmit={handleSearch}
                                    className="relative hidden md:block overflow-hidden"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-11 pl-4 pr-10 rounded-full bg-secondary/80 border-0 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSearchOpen(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5"
                                    >
                                        <X className="size-4 text-muted-foreground" />
                                    </button>
                                </motion.form>
                            ) : (
                                <Button
                                    onClick={() => setSearchOpen(true)}
                                    variant="ghost"
                                    size="icon"
                                    className={cn("rounded-full hover:bg-black/5 transition-colors hidden md:flex", scrolled ? "text-foreground" : "text-white mix-blend-difference")}
                                >
                                    <Search className="size-5" />
                                </Button>
                            )}
                        </AnimatePresence>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("relative rounded-full hover:bg-black/5 transition-colors", scrolled ? "text-foreground" : "text-white mix-blend-difference")}
                            onClick={() => router.push('/cart')}
                        >
                            <ShoppingBag className="size-5" />
                            {isMounted && totalItems > 0 && (
                                <span className="absolute top-1.5 right-1.5 flex size-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full size-2.5 bg-primary"></span>
                                </span>
                            )}
                        </Button>

                        {/* Sign In (Desktop) */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("hidden md:flex rounded-full hover:bg-black/5", scrolled ? "text-foreground" : "text-white mix-blend-difference")}
                            onClick={() => router.push('/signin')}
                        >
                            <User className="size-5" />
                        </Button>


                        {/* Mobile Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("md:hidden rounded-full", scrolled ? "text-foreground" : "text-white mix-blend-difference")}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Full Screen Premium Feel */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
                        className="fixed inset-0 top-0 pt-24 bg-background z-40 md:hidden flex flex-col"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col gap-8 h-full">

                            {/* Search Mobile */}
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-secondary border-transparent focus:border-primary focus:bg-background transition-all outline-none text-lg"
                                />
                            </form>

                            <nav className="flex flex-col gap-2">
                                {navItems.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.05) }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "block text-4xl font-black tracking-tight py-2 transition-colors hover:text-primary",
                                                pathname === item.href ? "text-black" : "text-muted-foreground"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto pb-12 border-t pt-8 flex flex-col gap-4">
                                <Button
                                    className="w-full h-14 rounded-full text-lg font-bold"
                                    onClick={() => { router.push('/signin'); setMobileMenuOpen(false); }}
                                >
                                    Sign In / Register
                                </Button>
                                <p className="text-center text-muted-foreground text-sm">
                                    © 2024 LuxeMarket Inc.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
