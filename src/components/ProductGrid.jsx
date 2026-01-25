"use client";

import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { motion } from "framer-motion";

export function ProductGrid({ products, title, isLoading = false }) {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                {title && (
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold mb-8 text-center"
                    >
                        {title}
                    </motion.h2>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
