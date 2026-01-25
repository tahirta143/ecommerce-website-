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
                mobileMenuOpen
                    ? "bg-white py-4"
                    : scrolled
                        ? "bg-white/80 backdrop-blur-md border-b border-black/5 py-4 shadow-sm"
                        : "bg-transparent py-6 border-transparent"
            )}
        >
            <div className="container mx-auto px-4 relative z-50">
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
                                scrolled || mobileMenuOpen ? "text-black" : "text-black md:text-white mix-blend-difference"
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
                            className={cn("md:hidden rounded-full", scrolled || mobileMenuOpen ? "text-black" : "text-white mix-blend-difference")}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Side Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex flex-col h-full">
                                {/* Drawer Header */}
                                <div className="p-6 border-b flex items-center justify-between">
                                    <span className="text-xl font-bold">Menu</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-full hover:bg-black/5"
                                    >
                                        <X className="size-6" />
                                    </Button>
                                </div>

                                {/* Drawer Content */}
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                                    {/* Search Mobile */}
                                    <form onSubmit={handleSearch} className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary border-transparent focus:border-primary focus:bg-background transition-all outline-none text-sm"
                                        />
                                    </form>

                                    <nav className="flex flex-col gap-1">
                                        {navItems.map((item, i) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={cn(
                                                    "block text-lg font-medium py-3 px-4 rounded-xl transition-colors hover:bg-secondary",
                                                    pathname === item.href ? "text-primary bg-secondary/50" : "text-foreground"
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </nav>
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t mt-auto">
                                    <Button
                                        className="w-full rounded-xl font-bold"
                                        onClick={() => { router.push('/signin'); setMobileMenuOpen(false); }}
                                    >
                                        Sign In / Register
                                    </Button>
                                    <p className="text-center text-muted-foreground text-xs mt-4">
                                        © 2024 LuxeMarket Inc.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
