"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Shop() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-border pb-8"
            >
                <div>
                    <h1 className="text-4xl font-bold mb-2">Shop All</h1>
                    <p className="text-muted-foreground">Explore our complete collection of extensive luxury items.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="size-4" /> Filter
                    </Button>
                    <Button variant="outline" className="gap-2">
                        Sort by: Featured <ChevronDown className="size-4" />
                    </Button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-[240px_1fr] gap-12">
                {/* Sidebar Filters - Hidden on mobile for now */}
                <aside className="hidden lg:block space-y-8">
                    <div>
                        <h3 className="font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {["All", "Electronics", "Fashion", "Home & Living", "Accessories"].map((item) => (
                                <li
                                    key={item}
                                    onClick={() => setSelectedCategory(item)}
                                    className={`cursor-pointer transition-colors ${selectedCategory === item ? "text-primary font-bold" : "hover:text-primary"
                                        }`}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Price Range</h3>
                        <div className="space-y-2">
                            <div className="h-1 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full w-1/2 bg-primary"></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>$0</span>
                                <span>$2000+</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="space-y-6">
                    <ProductGrid products={filteredProducts} />
                    <div className="flex justify-center pt-8">
                        <Button variant="outline" size="lg" className="rounded-full px-8">Load More</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
