"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const cardRef = useRef(null);

    const { contextSafe } = useGSAP(() => {
        // Entry Animation
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%", // Start when top of card hits 90% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, { scope: cardRef });

    // Hover Effects
    const handleMouseEnter = contextSafe(() => {
        gsap.to(".product-card", { y: -8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)", duration: 0.4, ease: "power2.out" });
        gsap.to(".product-image", { scale: 1.1, duration: 0.8, ease: "power2.out" });
        gsap.to(".product-overlay", { opacity: 1, duration: 0.3 });
        gsap.to(".product-actions", { x: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" });
        gsap.to(".add-to-cart-container", { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    });

    const handleMouseLeave = contextSafe(() => {
        gsap.to(".product-card", { y: 0, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", duration: 0.4, ease: "power2.out" });
        gsap.to(".product-image", { scale: 1, duration: 0.8, ease: "power2.out" });
        gsap.to(".product-overlay", { opacity: 0, duration: 0.3 });
        gsap.to(".product-actions", { x: 20, opacity: 0, duration: 0.3 });
        gsap.to(".add-to-cart-container", { y: 20, opacity: 0, duration: 0.3 });
    });

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="product-card group relative bg-card rounded-3xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5"
        >
            <Link href={`/product/${product.id}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="product-image object-cover"
                    />

                    {/* Overlay Actions */}
                    <div className="product-overlay absolute inset-0 bg-transparent flex items-center justify-center gap-3 opacity-0 pointer-events-none">
                        {/* Gradient overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>

                    <div className="product-actions absolute top-4 right-4 flex flex-col gap-2 translate-x-5 opacity-0 z-10 pointer-events-auto">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:bg-white hover:text-red-500 transition-colors">
                            <Heart className="size-4" />
                        </Button>
                    </div>

                    {/* Quick Add Button */}
                    <div className="add-to-cart-container absolute bottom-4 inset-x-4 translate-y-5 opacity-0 z-20 pointer-events-auto">
                        <Button
                            onClick={handleAddToCart}
                            variant="ghost" // Use ghost to avoid primary variant's text-white and gradient
                            className={`w-full rounded-xl shadow-xl backdrop-blur-md transition-all ${isAdded
                                ? "bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                : "bg-white/90 text-black hover:bg-white hover:text-black dark:bg-black/90 dark:text-white dark:hover:bg-black dark:hover:text-white"
                                }`}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="mr-2 size-4" /> Added
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="mr-2 size-4" /> Quick Add
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Badge */}
                    {product.isNew && (
                        <span className="absolute top-4 left-4 bg-accent text-white backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                            New
                        </span>
                    )}
                </div>
            </Link>

            {/* Content */}
            <div className="p-3 md:p-5">
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer">{product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        ${product.price.toFixed(2)}
                    </span>
                    <div className="flex text-amber-500 text-xs gap-0.5">
                        {"★".repeat(5)}
                    </div>
                </div>
            </div>
        </div>
    );
}
