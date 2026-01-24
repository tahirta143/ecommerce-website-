"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";
import { products } from "@/lib/data";
import { ProductGrid } from "@/components/ProductGrid";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?q=80&w=2069&auto=format&fit=crop", count: "120+ Items" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop", count: "350+ Items" },
    { name: "Home & Living", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=2074&auto=format&fit=crop", count: "80+ Items" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2070&auto=format&fit=crop", count: "200+ Items" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2070&auto=format&fit=crop", count: "50+ Items" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2066&auto=format&fit=crop", count: "100+ Items" }
];

export default function Categories() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const containerRef = useRef(null);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.category === selectedCategory)
        : [];

    useGSAP(() => {
        if (selectedCategory && filteredProducts.length > 0) {
            gsap.fromTo(".product-grid-section",
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, [selectedCategory, filteredProducts.length]);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
        // Smooth scroll to product grid if selecting
        if (categoryName !== selectedCategory) {
            setTimeout(() => {
                const gridElement = document.getElementById("product-grid-anchor");
                if (gridElement) gridElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-12 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl mx-auto mb-16"
            >
                <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
                <p className="text-muted-foreground text-lg">
                    Find exactly what you&apos;re looking for with our curated collections.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${selectedCategory === cat.name ? 'border-primary ring-4 ring-primary/20 scale-[1.02]' : 'border-transparent hover:scale-[1.02]'}`}
                    >
                        <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10 ${selectedCategory === cat.name ? 'bg-black/50' : ''}`}></div>
                        <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

                        <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                            <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div>
                                    <h3 className="text-2xl font-bold mb-1">{cat.name}</h3>
                                    <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">{cat.count}</p>
                                </div>
                                <div className={`size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-opacity ${selectedCategory === cat.name ? 'opacity-100 bg-primary text-white' : 'opacity-0 group-hover:opacity-100'}`}>
                                    <ArrowUpRight className="size-5" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div id="product-grid-anchor" className="product-grid-section">
                {selectedCategory && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-3xl font-bold">
                                {selectedCategory} Collection
                            </h2>
                            <span className="text-muted-foreground">{filteredProducts.length} Products Found</span>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <ProductGrid products={filteredProducts} />
                        ) : (
                            <div className="py-20 text-center text-muted-foreground bg-secondary/30 rounded-xl">
                                <p className="text-xl">No products found in this category.</p>
                                <p className="text-sm mt-2">Try checking back later!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
