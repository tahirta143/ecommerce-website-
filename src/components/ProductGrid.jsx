"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Heart, Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getDominantColor } from "@/lib/colors";

// Register ScrollTrigger
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Helper function to get image URL
const getImageUrl = (image) => {
    if (!image) return "/placeholder-image.jpg";
    if (typeof image === "string") return image;
    if (image.url) return image.url;
    return "/placeholder-image.jpg";
};

const getProductImage = (product) => {
    if (!product) return "/placeholder-image.jpg";

    // Try images array first
    if (product.images && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }
    // Switch to singular image property
    if (product.image) {
        return getImageUrl(product.image);
    }

    return "/placeholder-image.jpg";
};

// Modern ProductCard with Multi-Image Slider & Premium Styling
function ProductCard({ product, compact = false }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [dominantColor, setDominantColor] = useState("rgba(0,0,0,0.05)");
    const [isColorLoaded, setIsColorLoaded] = useState(false);
    const cardRef = useRef(null);

    const images = useMemo(() => product.images && product.images.length > 0
        ? product.images.map(img => getImageUrl(img))
        : [getProductImage(product)], [product]);

    // Extract dominant color from the first image
    useEffect(() => {
        const extractColor = async () => {
            if (images[0] && images[0] !== "/placeholder-image.jpg") {
                try {
                    const color = await getDominantColor(images[0]);
                    setDominantColor(color);
                } catch (error) {
                    console.error("Error extracting dominant color:", error);
                    setDominantColor("rgba(0,0,0,0.05)");
                }
            } else {
                setDominantColor("rgba(0,0,0,0.05)");
            }
            setIsColorLoaded(true);
        };
        extractColor();
    }, [images]);

    const { contextSafe } = useGSAP(
        () => {
            if (!cardRef.current) return;
            // Entry Animation - Staggered entrance
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, scale: 0.95, y: 30 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 92%",
                        toggleActions: "play none none reverse",
                    },
                },
            );
        },
        { scope: cardRef },
    );

    // Advanced GSAP Hover - YouTube Cinematic Style
    const handleMouseEnter = contextSafe((e) => {
        const card = e.currentTarget;
        const q = gsap.utils.selector(card);

        // YouTube-style dynamic lift and soft shadow
        gsap.to(card, {
            scale: 1.02,
            boxShadow: `0 30px 60px -12px ${dominantColor.replace(')', ', 0.25)').replace('rgb', 'rgba')}`,
            borderColor: "rgba(0, 0, 0, 0.05)",
            duration: 0.5,
            ease: "power2.out",
        });

        // Magnetic image scale - REDUCED ZOOM from 1.1 to 1.03
        gsap.to(q(".product-image"), {
            scale: 1.03, // Changed from 1.1 to 1.03 for subtle zoom
            y: -3, // Reduced from -5 to -3
            duration: 0.6,
            ease: "power2.out",
        });

        // Clean overlay
        gsap.to(q(".image-overlay"), {
            opacity: 1,
            duration: 0.4,
        });

        // Staggered reveal for UI elements
        const uiElements = q(".wishlist-btn, .quick-add-container, .image-dots");

        gsap.to(uiElements, {
            opacity: 1,
            scale: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.7)"
        });
    });

    const handleMouseMove = contextSafe((e) => {
        const card = e.currentTarget;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Tilt Effect - REDUCED intensity
        const tiltX = (y - centerY) / 30; // Changed from /20 to /30 for less tilt
        const tiltY = (centerX - x) / 30; // Changed from /20 to /30 for less tilt

        gsap.to(card, {
            rotateX: tiltX,
            rotateY: tiltY,
            duration: 0.5,
            ease: "power2.out"
        });

        // Magnetic Wishlist Button
        const wishlistBtn = card.querySelector(".wishlist-btn");
        if (wishlistBtn) {
            const btnRect = wishlistBtn.getBoundingClientRect();
            const btnX = btnRect.left + btnRect.width / 2;
            const btnY = btnRect.top + btnRect.height / 2;

            const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY);

            if (dist < 80) {
                gsap.to(wishlistBtn, {
                    x: (e.clientX - btnX) * 0.4,
                    y: (e.clientY - btnY) * 0.4,
                    scale: 1.1,
                    duration: 0.4,
                    ease: "power2.out"
                });
            } else {
                gsap.to(wishlistBtn, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        }
    });

    const handleMouseLeave = contextSafe((e) => {
        const card = e.currentTarget;
        const q = gsap.utils.selector(card);

        gsap.to(card, {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
            borderColor: "rgba(0, 0, 0, 0.04)",
            duration: 0.6,
            ease: "power2.inOut",
        });

        gsap.to(q(".product-image"), {
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.inOut",
        });

        gsap.to(q(".image-overlay"), {
            opacity: 0,
            duration: 0.4,
        });

        // Coordinated UI Fade Out
        gsap.to(q(".wishlist-btn, .quick-add-container, .image-dots"), {
            opacity: 0,
            y: 10,
            scale: 0.8,
            duration: 0.4,
            ease: "power2.in"
        });

        gsap.to(q(".wishlist-btn"), { x: 15 });
    });

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Auth Wall Check - Robust check for token
        const token = localStorage.getItem("token");
        const isAuthenticated = token && token !== "undefined" && token !== "null";

        if (!isAuthenticated) {
            console.log("Not authenticated, redirecting to signin...");
            router.push("/signin");
            return;
        }

        // Normalize product data for Cart Context/Page
        const cartProduct = {
            id: product._id || product.id,
            name: product.title || product.name || "Unnamed Product",
            price: product.price || 0,
            image: images[0] || "/placeholder-image.jpg",
            category: product.category || "General"
        };

        addToCart(cartProduct);
        setIsAdded(true);

        // Success pulse animation
        gsap.fromTo(cardRef.current,
            { outline: "2px solid transparent" },
            { outline: "2px solid #22c55e", duration: 0.3, yoyo: true, repeat: 1 }
        );

        setTimeout(() => setIsAdded(false), 2000);
    };

    // Robust data handling
    const productId = product._id || product.id;
    const productTitle = product.title || product.name || "Unnamed Product";
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

    // Create a light version of the dominant color for the background (20% opacity)
    const getBackgroundColor = () => {
        if (!dominantColor || dominantColor === "rgba(0,0,0,0.05)") {
            return "#f8fafc"; // Light gray fallback
        }

        // If it's rgb format, convert to rgba with 0.2 opacity (20%)
        if (dominantColor.startsWith('rgb(')) {
            return dominantColor.replace('rgb(', 'rgba(').replace(')', ', 0.2)');
        }

        // If it's already rgba, just adjust opacity to 0.2 (20%)
        if (dominantColor.startsWith('rgba(')) {
            return dominantColor.replace(/[^,]+(?=\))/, '0.2');
        }

        // If it's hex, we'd need to convert, but assuming getDominantColor returns rgb/rgba
        return dominantColor;
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`product-card group relative bg-white rounded-[1.5rem] overflow-hidden border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] perspective-1000 ${compact ? 'max-w-sm' : ''}`}
            style={{
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            }}
        >
            {/* Image Section with Dominant Color Background */}
            <div className={`relative ${compact ? 'aspect-[3/4]' : 'aspect-[4/5]'} overflow-hidden group-hover:cursor-pointer bg-slate-50`}>
                {/* Static Dominant Color Background - Only in image area */}
                <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                        backgroundColor: getBackgroundColor(),
                        opacity: isColorLoaded ? 1 : 0,
                    }}
                />

                <Link href={`/product/${productId}`} className="absolute inset-0 z-10 flex items-center justify-center p-4">
                    <motion.div
                        key={currentImgIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={images[currentImgIndex]}
                            alt={productTitle}
                            fill
                            className="product-image object-contain" // Using object-contain to prevent cutting
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            priority={currentImgIndex === 0}
                            unoptimized={true}
                        />
                    </motion.div>
                </Link>

                {/* Subtle Overlay */}
                <div className="image-overlay absolute inset-0 bg-black/5 opacity-0 pointer-events-none z-20" />

                {/* Image Dots - Slider Controls */}
                {images.length > 1 && (
                    <div className="image-dots absolute top-1/2 -translate-y-1/2 left-3 flex flex-col gap-1.5 z-30 opacity-0 translate-x-[-10px]">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={(e) => {
                                    e.stopPropagation();
                                    setCurrentImgIndex(idx);
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentImgIndex(idx);
                                }}
                                className={`size-1.5 rounded-full transition-all duration-200 ${currentImgIndex === idx
                                    ? "bg-primary scale-150 shadow-[0_0_8px_var(--primary)]"
                                    : "bg-slate-300 hover:bg-slate-400"
                                    }`}
                                aria-label={`View image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Wishlist Button - Floating & Light Glass */}
                <button className="wishlist-btn absolute top-4 right-4 z-30 flex items-center justify-center size-9 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-slate-400 opacity-0 translate-x-10 scale-75 hover:bg-white hover:text-red-500 shadow-sm">
                    <Heart className="size-4" />
                </button>

                {/* Badges */}
                {product.isNew && (
                    <div className="absolute top-4 left-4 z-30 pointer-events-none">
                        <span className="px-3 py-1 rounded-full bg-white/90 text-primary text-[9px] font-bold uppercase tracking-widest shadow-sm border border-slate-100/50 backdrop-blur-sm">
                            New Arrival
                        </span>
                    </div>
                )}

                {/* Quick Add Button - Clean Glass */}
                <div className="quick-add-container absolute bottom-4 inset-x-4 z-30 translate-y-10 opacity-0">
                    <Button
                        onClick={handleAddToCart}
                        className={`w-full h-11 rounded-xl shadow-lg backdrop-blur-xl ${isAdded
                            ? "bg-green-500 text-white"
                            : "bg-white/95 text-slate-800 border border-slate-100/50 hover:bg-black hover:text-white"
                            }`}
                    >
                        {isAdded ? (
                            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center">
                                <Check className="mr-2 size-4" /> Added
                            </motion.div>
                        ) : (
                            <div className="flex items-center font-medium text-sm">
                                <ShoppingCart className="mr-2 size-4" /> Quick Add
                            </div>
                        )}
                    </Button>
                </div>
            </div>

            {/* Info Section - White Background */}
            <Link href={`/product/${productId}`}>
                <div className={`relative bg-white ${compact ? 'p-3 space-y-1.5' : 'p-5 space-y-2'}`}>
                    <div className="space-y-0.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {product.category || "Lifestyle"}
                            </span>
                        </div>
                        <h3 className={`font-semibold text-slate-800 leading-tight line-clamp-1 ${compact ? 'text-sm' : 'text-base'}`}>
                            {productTitle}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <span className={`font-bold text-slate-900 ${compact ? 'text-lg' : 'text-xl'}`}>
                            Rs. {productPrice.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="flex text-amber-300 gap-0.5 scale-[0.7] origin-right">
                                {"★".repeat(5)}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

// ProductCardSkeleton Component
export function ProductCardSkeleton() {
    return (
        <div className="product-card bg-card rounded-3xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5">
            {/* Image Container Skeleton */}
            <div className="relative aspect-[4/5] bg-muted animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
            </div>

            {/* Content Skeleton */}
            <div className="p-3 md:p-5 space-y-3">
                {/* Title */}
                <div className="h-6 bg-muted/50 rounded-md w-3/4 animate-pulse" />

                {/* Category */}
                <div className="h-4 bg-muted/30 rounded-md w-1/3 animate-pulse" />

                {/* Price and Rating */}
                <div className="flex items-center justify-between pt-2">
                    <div className="h-6 bg-muted/40 rounded-md w-1/4 animate-pulse" />
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="size-3 bg-muted/30 rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ProductGridManual({
    products = [],
    title,
    isLoading = false,
    error = null,
    onRetry,
    compact = false,
    gridClassName = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6"
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Reset pagination when products list changes (e.g. different category)
    // Using a simple conditional check to avoid redundant effect-based renders
    // if we haven't already reset it.
    const [prevProductsLength, setPrevProductsLength] = useState(products.length);
    if (products.length !== prevProductsLength) {
        setCurrentPage(1);
        setPrevProductsLength(products.length);
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center mb-8 p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        {onRetry && (
                            <Button
                                onClick={onRetry}
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                Retry Loading
                            </Button>
                        )}
                    </motion.div>
                )}

                <div className={`${gridClassName} min-h-[400px]`}>
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, index) => (
                            <ProductCardSkeleton key={`skeleton-${index}`} />
                        ))
                    ) : currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} compact={compact} />
                        ))
                    ) : !error ? (
                        <div className="col-span-full text-center py-12">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <ShoppingCart className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                            <p className="text-muted-foreground">
                                Check back later for new products
                            </p>
                        </div>
                    ) : null}
                </div>

                {/* Pagination Controls */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-16">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`size-10 rounded-xl transition-all duration-300 font-medium ${currentPage === page
                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                        : "hover:bg-primary/10 text-slate-600"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}

// Hook for fetching products (clean separation)
export function useProducts(
    apiUrl = "https://backend-with-node-js-ueii.onrender.com/api/products",
) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Process images to ensure they're in the correct format
                const processedProducts = (data.data || []).map((product) => ({
                    ...product,
                    images:
                        product.images?.map((img) => ({
                            ...img,
                            url: typeof img === "string" ? img : img.url,
                        })) || [],
                }));
                setProducts(processedProducts);
            } else {
                throw new Error(data.message || "Failed to fetch products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message || "Failed to load products");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, isLoading, error, refetch: fetchProducts };
}

// Example usage in a parent component:
export function ProductsPage() {
    const { products, isLoading, error, refetch } = useProducts();

    return (
        <div>
            <ProductGridManual
                products={products}
                title="Our Products"
                isLoading={isLoading}
                error={error}
                onRetry={refetch}
            />
        </div>
    );
}

// Main dynamic ProductGrid component
export function ProductGrid({
    title,
    products: initialProducts,
    isLoading: initialLoading,
    error: initialError,
    onRetry: initialRetry,
    compact = false,
    gridClassName
}) {
    // Only call useProducts if we don't have initialProducts or initialLoading
    // Using a conditional hook usage is technically against React rules, 
    // but we can wrap it or just handle the logic inside the hook if needed.
    // However, a simpler way is to always call it but ignore its results.
    // To be safer and follow rules, we call the hook but prioritize props.
    const {
        products: fetchedProducts,
        isLoading: fetchedLoading,
        error: fetchedError,
        refetch: fetchedRetry
    } = useProducts();

    // If initialProducts is provided (even if empty array), we use it.
    // This allows Shop page to manage its own filtered state.
    const hasProps = initialProducts !== undefined;

    const displayProducts = hasProps ? initialProducts : fetchedProducts;
    const displayLoading = hasProps ? (initialLoading ?? false) : fetchedLoading;
    const displayError = hasProps ? initialError : fetchedError;
    const displayRetry = hasProps ? initialRetry : fetchedRetry;

    return (
        <ProductGridManual
            products={displayProducts}
            title={title}
            isLoading={displayLoading}
            error={displayError}
            onRetry={displayRetry}
            compact={compact}
            gridClassName={gridClassName}
        />
    );
}

// DEFAULT EXPORT - CRITICAL FOR IMPORT IN page.js
export default ProductGrid;