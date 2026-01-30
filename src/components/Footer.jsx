"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";

// Register GSAP plugins only on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const footerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useGSAP(
    () => {
      if (!isClient || !footerRef.current) return;

      // Ensure footer is visible immediately
      gsap.set(footerRef.current, { opacity: 1, visibility: "visible" });

      // Main animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      // Staggered column animation
      tl.from(".footer-column", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });

      // Animate the background gradient elements
      const gradients = gsap.utils.toArray(".gradient-blob");
      gradients.forEach((gradient, index) => {
        gsap.to(gradient, {
          x: index % 2 === 0 ? 20 : -20,
          y: index % 2 === 0 ? -20 : 20,
          duration: 15 + index * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Social icons hover animation
      if (isClient) {
        const socialIcons = gsap.utils.toArray(".social-icon-btn");
        socialIcons.forEach((icon) => {
          icon.addEventListener("mouseenter", () => {
            gsap.to(icon, {
              scale: 1.2,
              rotation: 10,
              backgroundColor: "var(--primary)",
              color: "white",
              duration: 0.3,
              ease: "back.out(1.7)",
            });
          });

          icon.addEventListener("mouseleave", () => {
            gsap.to(icon, {
              scale: 1,
              rotation: 0,
              backgroundColor: "white",
              color: "var(--text-muted)",
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });

        // Footer links hover animation with glow effect
        const links = gsap.utils.toArray(".footer-link");
        links.forEach((link) => {
          link.addEventListener("mouseenter", () => {
            gsap.to(link, {
              x: 8,
              color: "var(--primary)",
              duration: 0.3,
              ease: "power2.out",
            });

            // Add glow effect
            gsap.to(link, {
              textShadow: "0 0 8px var(--primary)",
              duration: 0.2,
            });
          });

          link.addEventListener("mouseleave", () => {
            gsap.to(link, {
              x: 0,
              color: "inherit",
              textShadow: "none",
              duration: 0.3,
              ease: "power2.out",
            });
          });
        });

        // Newsletter form animation
        const form = document.querySelector("form");
        if (form) {
          gsap.from(form, {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "elastic.out(1, 0.5)",
          });

          // Input focus animation
          const input = form.querySelector("input");
          if (input) {
            input.addEventListener("focus", () => {
              gsap.to(input, {
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(var(--primary-rgb), 0.1)",
                duration: 0.2,
                ease: "power2.out",
              });
            });

            input.addEventListener("blur", () => {
              gsap.to(input, {
                scale: 1,
                boxShadow: "none",
                duration: 0.2,
                ease: "power2.out",
              });
            });
          }
        }

        // Logo animation on hover
        const logo = document.querySelector(".footer-logo");
        if (logo) {
          logo.addEventListener("mouseenter", () => {
            gsap.to(".logo-icon", {
              rotation: 360,
              duration: 0.8,
              ease: "back.out(1.7)",
            });

            gsap.to(".logo-text", {
              x: 5,
              duration: 0.3,
              ease: "power2.out",
            });
          });

          logo.addEventListener("mouseleave", () => {
            gsap.to(".logo-text", {
              x: 0,
              duration: 0.3,
              ease: "power2.out",
            });
          });
        }

        // Pulse animation for copyright text
        gsap.to(".copyright-text", {
          opacity: 0.8,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: footerRef, dependencies: [isClient] },
  );

  // Handle form submission
  const handleSubscribe = (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");

    if (isClient && input) {
      gsap.to(input, {
        backgroundColor: "#10b981",
        color: "white",
        duration: 0.3,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(input, {
              backgroundColor: "",
              color: "",
              duration: 0.3,
            });
            input.value = "";
          }, 1000);
        },
      });
    }
  };

  // Don't render GSAP-dependent elements during SSR
  if (!isClient) {
    return (
      <footer
        ref={footerRef}
        className="bg-gradient-to-b from-white to-zinc-50 border-t border-zinc-200 pt-16 pb-8 relative text-zinc-600 overflow-hidden"
      >
        {/* Static content for SSR */}
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-16 border-b border-zinc-200/50 pb-16">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-3 w-max">
                <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center font-bold text-xl">
                  L
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tight text-zinc-900">
                    Luxe<span className="font-light">Market</span>
                  </span>
                  <span className="text-xs text-primary font-medium tracking-wider uppercase">
                    Elevating Everyday
                  </span>
                </div>
              </Link>
            </div>
            <div className="bg-white/80 p-8 rounded-3xl border border-zinc-100">
              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="flex-1">
                  <h3 className="text-zinc-900 font-bold text-lg mb-2">
                    Join our Exclusive Club
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-xs">
                    Get 10% off your first order + early access to new
                    collections.
                  </p>
                </div>
                <form className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-zinc-400"
                    required
                    suppressHydrationWarning
                  />
                  <Button
                    type="submit"
                    className="rounded-xl px-6 bg-gradient-to-r from-zinc-900 to-primary text-white hover:from-primary hover:to-violet-600 font-bold transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-zinc-200/50 text-center text-sm text-zinc-500">
            <p>
              © {new Date().getFullYear()} LuxeMarket Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      ref={footerRef}
      className="bg-gradient-to-b from-white to-zinc-50 border-t border-zinc-200 pt-16 pb-8 relative text-zinc-600 overflow-hidden"
      style={{
        visibility: "visible",
        opacity: 1,
      }}
    >
      {/* Animated Gradient Background Elements */}
      <div className="gradient-blob absolute -top-20 -right-20 w-80 h-80 bg-blue-100/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="gradient-blob absolute -bottom-20 -left-20 w-80 h-80 bg-violet-100/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="gradient-blob absolute top-1/2 left-1/4 w-60 h-60 bg-amber-100/30 blur-[80px] rounded-full pointer-events-none" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_0)] bg-[length:40px_40px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Top Section: Newsletter & Brand */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 border-b border-zinc-200/50 pb-16">
          <div className="footer-column space-y-6">
            <Link
              href="/"
              className="footer-logo flex items-center gap-3 group w-max"
            >
              <div className="logo-icon size-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 text-white flex items-center justify-center font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                L
              </div>
              <div className="flex flex-col">
                <span className="logo-text text-2xl font-black tracking-tight text-zinc-900">
                  Luxe<span className="font-light">Market</span>
                </span>
                <span className="text-xs text-primary font-medium tracking-wider uppercase">
                  Elevating Everyday
                </span>
              </div>
            </Link>
            <p className="text-zinc-500 max-w-md leading-relaxed text-sm">
              Curating premium essentials for the modern lifestyle. Where
              quality meets design in every product.
            </p>

            {/* Floating badges */}
            <div className="flex gap-3 mt-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                ✓ Free Shipping
              </span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                ★ 5-Star Reviews
              </span>
            </div>
          </div>

          <div className="footer-column bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-zinc-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex-1">
                <h3 className="text-zinc-900 font-bold text-lg mb-2">
                  Join our Exclusive Club
                </h3>
                <p className="text-sm text-zinc-500 max-w-xs">
                  Get 10% off your first order + early access to new
                  collections.
                </p>
              </div>
              <form
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                onSubmit={handleSubscribe}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-zinc-400"
                  required
                  suppressHydrationWarning
                />
                <Button
                  type="submit"
                  className="rounded-xl px-6 bg-gradient-to-r from-zinc-900 to-primary text-white hover:from-primary hover:to-violet-600 font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Subscribe
                </Button>
              </form>
            </div>
            <p className="text-xs text-zinc-400 mt-4 text-center sm:text-left">
              By subscribing, you agree to our Privacy Policy
            </p>
          </div>
        </div>

        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16 text-sm">
          <div className="footer-column space-y-5">
            <h4 className="text-zinc-900 font-bold text-base tracking-wide flex items-center gap-2">
              Shop
              <span className="w-4 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                "New Arrivals",
                "Best Sellers",
                "Limited Edition",
                "Accessories",
                "Home & Living",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/shop"
                    className="footer-link block text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column space-y-5">
            <h4 className="text-zinc-900 font-bold text-base tracking-wide flex items-center gap-2">
              Company
              <span className="w-4 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                "Our Story",
                "Sustainability",
                "Careers",
                "Press",
                "Investors",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/about"
                    className="footer-link block text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column space-y-5">
            <h4 className="text-zinc-900 font-bold text-base tracking-wide flex items-center gap-2">
              Support
              <span className="w-4 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {["FAQ", "Shipping", "Returns", "Contact Us", "Size Guide"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="footer-link block text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="footer-column space-y-5">
            <h4 className="text-zinc-900 font-bold text-base tracking-wide flex items-center gap-2">
              Legal
              <span className="w-4 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Accessibility",
                "Sitemap",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="footer-link block text-zinc-500 hover:text-zinc-900 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column space-y-5 col-span-2 md:col-span-1">
            <h4 className="text-zinc-900 font-bold text-base tracking-wide flex items-center gap-2">
              Connect
              <span className="w-4 h-0.5 bg-primary rounded-full"></span>
            </h4>
            <p className="text-zinc-500 text-sm">
              Follow us for updates, inspiration, and exclusive offers.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                {
                  icon: Instagram,
                  color:
                    "hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600",
                },
                { icon: Facebook, color: "hover:bg-blue-600" },
                { icon: Twitter, color: "hover:bg-sky-500" },
                { icon: Linkedin, color: "hover:bg-blue-700" },
              ].map(({ icon: Icon, color }, i) => (
                <button
                  key={i}
                  className={`social-icon-btn size-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 shadow-sm hover:text-white transition-all duration-300 ${color}`}
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with enhanced animation */}
        <div className="footer-column pt-8 border-t border-zinc-200/50 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="copyright-text">
              © {new Date().getFullYear()} LuxeMarket Inc.
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies", "Security"].map((item) => (
              <Link key={item} href="#" className="relative group">
                {item}
                <span className="link-underline absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Made with</span>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-full blur opacity-70"></div>
              <div className="relative size-5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center">
                <span className="text-white text-xs">❤️</span>
              </div>
            </div>
            <span className="text-xs text-zinc-400">in Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
