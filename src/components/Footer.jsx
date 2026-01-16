"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Footer() {
    const footerRef = useRef(null);

    useGSAP(() => {
        // Initial state for social icons
        gsap.set(".social-icon", { opacity: 0, y: 10 });

        // Staggered reveal for social icons on mount (or scroll if using ScrollTrigger, but let's keep it simple for now)
        gsap.to(".social-icon", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.5
        });

        // Hover animations for text links
        const links = gsap.utils.toArray(".footer-link");
        links.forEach(link => {
            const tl = gsap.timeline({ paused: true });
            tl.to(link, {
                x: 8,
                color: "#18181b", // zinc-900 (blackish)
                duration: 0.3,
                ease: "power2.out"
            });

            link.addEventListener("mouseenter", () => tl.play());
            link.addEventListener("mouseleave", () => tl.reverse());
        });

        // Hover for social icons
        const socialIcons = gsap.utils.toArray(".social-icon-wrapper");
        socialIcons.forEach(icon => {
            const tl = gsap.timeline({ paused: true });
            tl.to(icon, {
                y: -5,
                scale: 1.1,
                backgroundColor: "#18181b",
                color: "#ffffff",
                duration: 0.3,
                ease: "power2.out"
            });

            icon.addEventListener("mouseenter", () => tl.play());
            icon.addEventListener("mouseleave", () => tl.reverse());
        });
    }, { scope: footerRef });

    const shopLinks = ["New Arrivals", "Best Sellers", "Electronics", "Lifestyle"];
    const supportLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "#" },
        { name: "FAQs", href: "#" },
        { name: "Shipping Info", href: "#" },
        { name: "Returns", href: "#" }
    ];

    return (
        <footer ref={footerRef} className="bg-zinc-50 border-t border-zinc-100 pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform group">
                            <div className="size-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">
                                L
                            </div>
                            <span className="text-2xl font-black tracking-tight text-zinc-900">LuxeMarket</span>
                        </Link>
                        <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-xs">
                            Discover the art of minimalist living. Curated essentials designed for the modern home and wardrobe.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Shop</h3>
                        <ul className="space-y-4">
                            {shopLinks.map(link => (
                                <li key={link}>
                                    <Link href="#" className="footer-link inline-block text-sm font-bold text-zinc-400 transition-none">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Support</h3>
                        <ul className="space-y-4">
                            {supportLinks.map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="footer-link inline-block text-sm font-bold text-zinc-400 transition-none">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Connect</h3>
                        <div className="flex gap-4 mb-8">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="social-icon social-icon-wrapper size-11 flex items-center justify-center text-zinc-400 bg-white rounded-2xl shadow-sm border border-zinc-100 transition-none"
                                >
                                    <Icon className="size-5" />
                                </a>
                            ))}
                        </div>
                        <div className="p-4 rounded-2xl bg-zinc-100/50 border border-zinc-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Weekly News</p>
                            <p className="text-xs font-bold text-zinc-600">Subscribe for early access.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-bold text-zinc-400">
                        &copy; 2026 LuxeMarket. <span className="hidden sm:inline">Crafted with precision.</span>
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">Privacy Policy</Link>
                        <Link href="#" className="text-xs font-bold text-zinc-400 hover:text-black transition-colors">Terms of Use</Link>

                    </div>
                </div>
            </div>
        </footer>
    );
}
