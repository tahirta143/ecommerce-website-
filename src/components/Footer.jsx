"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
    const footerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerRef.current,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });

        tl.from(".footer-column", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });

        const icons = gsap.utils.toArray(".social-icon-btn");
        icons.forEach((icon) => {
            icon.addEventListener("mouseenter", () => {
                gsap.to(icon, { scale: 1.2, duration: 0.3, ease: "back.out(1.7)" });
            });
            icon.addEventListener("mouseleave", () => {
                gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        });

        // Smooth GSAP Hover for Links
        const links = gsap.utils.toArray(".footer-link");
        links.forEach((link) => {
            link.addEventListener("mouseenter", () => {
                gsap.to(link, { x: 5, color: "var(--primary)", duration: 0.3, ease: "power2.out" });
            });
            link.addEventListener("mouseleave", () => {
                gsap.to(link, { x: 0, color: "inherit", duration: 0.3, ease: "power2.out" });
            });
        });

    }, { scope: footerRef });

    return (
        <footer ref={footerRef} className="bg-zinc-50 border-t border-zinc-200 pt-12 pb-6 overflow-hidden relative text-zinc-600">
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-full max-w-2xl h-80 bg-blue-50/50 blur-[100px] rounded-full pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-full max-w-2xl h-80 bg-violet-50/50 blur-[100px] rounded-full pointer-events-none -z-10" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Top Section: Newsletter & Brand */}
                <div className="grid lg:grid-cols-2 gap-10 mb-12 border-b border-zinc-200 pb-10">
                    <div className="footer-column space-y-4">
                        <Link href="/" className="flex items-center gap-2 group w-max">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                                L
                            </div>
                            <span className="text-xl font-black tracking-tight text-zinc-900">
                                Luxe<span className="font-light">Market</span>.
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
                            Elevating your lifestyle with curated premium essentials.
                        </p>
                    </div>

                    <div className="footer-column bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex-1">
                                <h3 className="text-zinc-900 font-bold">Join our Exclusive Club</h3>
                                <p className="text-xs text-zinc-500">Get 10% off your first order.</p>
                            </div>
                            <form className="flex gap-2 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 sm:w-48 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-primary transition-all"
                                />
                                <Button size="sm" className="rounded-lg px-4 bg-zinc-900 text-white hover:bg-primary font-bold">
                                    Subscribe
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-sm">
                    <div className="footer-column space-y-4">
                        <h4 className="text-zinc-900 font-bold tracking-wide">Shop</h4>
                        <ul className="space-y-2">
                            {["New Arrivals", "Best Sellers", "Home & Living", "Accessories"].map(item => (
                                <li key={item}>
                                    <Link href="/shop" className="footer-link block transition-colors duration-300">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column space-y-4">
                        <h4 className="text-zinc-900 font-bold tracking-wide">Company</h4>
                        <ul className="space-y-2">
                            {["Our Story", "Sustainability", "Careers", "Press"].map(item => (
                                <li key={item}>
                                    <Link href="/about" className="footer-link block transition-colors duration-300">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column space-y-4">
                        <h4 className="text-zinc-900 font-bold tracking-wide">Support</h4>
                        <ul className="space-y-2">
                            {["FAQ", "Shipping", "Returns", "Contact Us"].map(item => (
                                <li key={item}>
                                    <Link href="#" className="footer-link block transition-colors duration-300">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-column space-y-4">
                        <h4 className="text-zinc-900 font-bold tracking-wide">Follow Us</h4>
                        <div className="flex gap-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                                <button key={i} className="social-icon-btn size-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-zinc-500 shadow-sm">
                                    <Icon className="size-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-column pt-6 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p>&copy; 2024 LuxeMarket Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-zinc-900 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
