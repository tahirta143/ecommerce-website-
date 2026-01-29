"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Heart, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

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

// Simpler ProductCard without date calculation issues
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const cardRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      // Entry Animation
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      );
    },
    { scope: cardRef },
  );

  // Hover Effects
  const handleMouseEnter = contextSafe(() => {
    gsap.to(".product-card", {
      y: -8,
      boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(".product-image", {
      scale: 1.1,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(".product-overlay", { opacity: 1, duration: 0.3 });
    gsap.to(".product-actions", {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
    gsap.to(".add-to-cart-container", {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(".product-card", {
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(".product-image", { scale: 1, duration: 0.8, ease: "power2.out" });
    gsap.to(".product-overlay", { opacity: 0, duration: 0.3 });
    gsap.to(".product-actions", { x: 20, opacity: 0, duration: 0.3 });
    gsap.to(".add-to-cart-container", { y: 20, opacity: 0, duration: 0.3 });
  });

  const handleAddToCart = (e) => {
    e.preventDefault();

    // Get the first image URL properly
    const firstImage =
      product.images && product.images.length > 0
        ? getImageUrl(product.images[0])
        : "/placeholder-image.jpg";

    // Transform API product to match cart structure
    const cartProduct = {
      id: product._id,
      name: product.title,
      price: product.price,
      image: firstImage,
      category: product.category,
    };

    addToCart(cartProduct);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Get the first image URL for display
  const imageUrl =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : "placeholder-image.jpg";

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="product-card group relative bg-card rounded-3xl overflow-hidden shadow-sm border border-white/50 dark:border-white/5"
    >
      <Link href={`/product/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="product-image object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            priority={false}
            onError={(e) => {
              //   console.error("Image failed to load:", imageUrl);
              e.target.src = "/placeholder-image.jpg";
            }}
          />

          {/* Overlay Actions */}
          <div className="product-overlay absolute inset-0 bg-transparent flex items-center justify-center gap-3 opacity-0 pointer-events-none">
            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="product-actions absolute top-4 right-4 flex flex-col gap-2 translate-x-5 opacity-0 z-10 pointer-events-auto">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg hover:bg-white hover:text-red-500 transition-colors"
            >
              <Heart className="size-4" />
            </Button>
          </div>

          {/* Quick Add Button */}
          <div className="add-to-cart-container absolute bottom-4 inset-x-4 translate-y-5 opacity-0 z-20 pointer-events-auto">
            <Button
              onClick={handleAddToCart}
              variant="ghost"
              className={`w-full rounded-xl shadow-xl backdrop-blur-md transition-all ${
                isAdded
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

          {/* Badge - Simple version (remove if not needed) */}
          {product.isNew && (
            <span className="absolute top-4 left-4 bg-accent text-white backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              New
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-5">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
          {product.category}
        </p>
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

// ProductGrid Component with API fetching - Fixed version
export function ProductGrid({
  title,
  apiUrl = "https://backend-with-node-js-ueii.onrender.com/api/products",
  showTitle = true,
  initialLoading = true,
}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Fetching products from:", apiUrl);
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Products response:", data);

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
    let isMounted = true;

    if (initialLoading && isMounted) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchProducts, initialLoading]);

  const handleRetry = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {showTitle && title && (
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
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Retry Loading
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
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
              <Button onClick={handleRetry} variant="ghost" className="mt-4">
                Refresh
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

// Alternative: ProductGrid with manual control (no auto-fetch)
export function ProductGridManual({
  products = [],
  title,
  isLoading = false,
  error = null,
  onRetry,
}) {
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
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
