"use client";

import { ProductGrid } from "@/components/ProductGrid";
import { Button } from "@/components/ui/Button";
import {
  Filter,
  ChevronDown,
  ArrowRight,
  Star,
  Sparkles,
  X,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper function to get image URL
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  return "/placeholder.jpg";
};

export default function Shop() {
  // State for products and loading
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState(["All"]);

  // Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const sidebarRef = useRef(null);
  const gridRef = useRef(null);
  const filterPanelRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://backend-with-node-js-ueii.onrender.com/api/products",
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const products = data.data || [];

            // Process images to ensure proper URLs
            const processedProducts = products.map((product) => ({
              ...product,
              images:
                product.images?.map((img) => ({
                  ...img,
                  url: getImageUrl(img),
                })) || [],
            }));

            setAllProducts(processedProducts);

            // Extract unique categories
            const uniqueCategories = [
              "All",
              ...new Set(
                processedProducts
                  .map((product) => product.category)
                  .filter(Boolean),
              ),
            ];
            setCategories(uniqueCategories);

            // Calculate max price for price range
            const maxPrice =
              processedProducts.length > 0
                ? Math.max(...processedProducts.map((p) => p.price || 0))
                : 2000;
            setPriceRange([0, Math.ceil(maxPrice)]);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters
  const filteredProducts = allProducts.filter((product) => {
    // Category filter - FIXED: Now properly filters by category
    if (selectedCategory !== "All") {
      if (!product.category || product.category !== selectedCategory) {
        return false;
      }
    }

    // Price filter
    const productPrice = product.price || 0;
    if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "name-asc":
        return (a.title || "").localeCompare(b.title || "");
      case "name-desc":
        return (b.title || "").localeCompare(a.title || "");
      case "featured":
      default:
        return 0; // Keep original order for featured
    }
  });

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("All");

    // Reset price range to calculated max
    const maxPrice =
      allProducts.length > 0
        ? Math.max(...allProducts.map((p) => p.price || 0))
        : 2000;
    setPriceRange([0, Math.ceil(maxPrice)]);

    setSortBy("featured");

    // Animation for reset
    gsap.to(".reset-btn", {
      rotation: 360,
      duration: 0.8,
      ease: "back.out(1.7)",
    });
  };

  // GSAP Animations - FIXED: Remove dependencies that cause re-runs
  useGSAP(
    () => {
      if (!containerRef.current || hasAnimatedRef.current) return;

      // Hero section animation - always play on mount
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      // Hero text animation - always plays
      tl.from(headerRef.current, {
        opacity: 0,
        y: 50,
      });

      // Stats counter animation
      tl.from(
        ".hero-stats > div",
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

      // Sidebar animation - with ScrollTrigger but without reverse
      gsap.from(sidebarRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sidebarRef.current,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play none none none", // Changed to prevent reverse
        },
      });

      // Product grid animation - always visible
      gsap.from(gridRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play none none none",
        },
      });

      // Category buttons animation
      const categoryButtons = document.querySelectorAll(
        '[class^="category-btn-"]',
      );
      categoryButtons.forEach((btn, index) => {
        gsap.from(btn, {
          x: -20,
          opacity: 0,
          duration: 0.6,
          delay: 0.2 + index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: btn,
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play none none none",
          },
        });
      });

      // Stats counter animation with counting effect
      gsap.utils.toArray(".stat-number").forEach((stat) => {
        const target = parseInt(stat.textContent) || 0;
        gsap.fromTo(
          stat,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 90%",
              end: "bottom top",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Floating elements animation
      gsap.to(".floating-element", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Price range slider animation
      const priceSlider = document.querySelector(".price-slider-track");
      if (priceSlider) {
        gsap.from(priceSlider, {
          width: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: priceSlider,
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play none none none",
          },
        });
      }

      hasAnimatedRef.current = true;
    },
    { scope: containerRef },
  );

  // Mobile filters panel animation
  useGSAP(() => {
    if (showFilters && filterPanelRef.current) {
      gsap.fromTo(
        filterPanelRef.current,
        { x: -300, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );
    } else if (filterPanelRef.current) {
      gsap.to(filterPanelRef.current, {
        x: -300,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      });
    }
  }, [showFilters]);

  // Debug logging
  useEffect(() => {
    console.log("Selected Category:", selectedCategory);
    console.log("Filtered Products:", filteredProducts.length);
    console.log("All Products:", allProducts.length);
    console.log("Categories:", categories);
  }, [selectedCategory, filteredProducts, allProducts, categories]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-background via-background/95 to-secondary/10"
    >
      {/* Mobile Filters Panel */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />

          {/* Filters Panel */}
          <div
            ref={filterPanelRef}
            className="absolute left-0 top-0 h-full w-80 bg-background border-r border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="size-5" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-secondary rounded-lg"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Mobile Categories */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                        // Animation feedback
                        gsap.to(`[data-category="${category}"]`, {
                          scale: 0.95,
                          duration: 0.1,
                          yoyo: true,
                          repeat: 1,
                          ease: "power2.inOut",
                        });
                      }}
                      data-category={category}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">${priceRange[0]}</span>
                    <span className="text-sm">${priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Mobile Sort Options */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "name-asc", label: "Name: A to Z" },
                    { value: "name-desc", label: "Name: Z to A" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        sortBy === option.value
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    resetFilters();
                    setShowFilters(false);
                  }}
                  variant="outline"
                  className="flex-1 gap-2 reset-btn"
                >
                  <RefreshCw className="size-4" />
                  Reset
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative floating elements */}
      <div className="floating-element absolute top-20 right-10 w-24 h-24 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="floating-element absolute bottom-40 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Sparkles className="size-4" />
              Premium Collection
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Discover Luxury
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Explore our curated collection of premium products designed for
              the modern lifestyle.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12 hero-stats">
              {[
                { value: allProducts.length.toString(), label: "Products" },
                { value: "4.9", label: "Rating", icon: Star },
                { value: categories.length.toString(), label: "Categories" },
                { value: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-1">
                    <span className="stat-number">{stat.value}</span>
                    {stat.icon && (
                      <stat.icon className="inline size-5 ml-1 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative">
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Filters Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-card to-card/50 backdrop-blur-sm border border-border/50 shadow-lg"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
                <span className="ml-2 text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                  {sortedProducts.length} items
                </span>
              </h2>
              <p className="text-muted-foreground">
                Showing {sortedProducts.length} of {allProducts.length} products
                {priceRange[0] > 0 || priceRange[1] < 2000
                  ? ` (Price: $${priceRange[0]} - $${priceRange[1]})`
                  : ""}
              </p>
            </div>

            <div className="flex gap-3">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="gap-2 lg:hidden"
                onClick={() => {
                  setShowFilters(true);
                  gsap.to(".mobile-filter-btn", {
                    rotation: 180,
                    duration: 0.5,
                    ease: "back.out(1.7)",
                  });
                }}
              >
                <Filter className="size-4 mobile-filter-btn" />
                Filter
              </Button>

              {/* Sort Dropdown */}
              <div className="relative group">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 0.95,
                      duration: 0.2,
                      yoyo: true,
                      repeat: 1,
                      ease: "power2.inOut",
                    });
                  }}
                >
                  Sort:{" "}
                  {sortBy === "featured"
                    ? "Featured"
                    : sortBy === "price-low"
                      ? "Price: Low to High"
                      : sortBy === "price-high"
                        ? "Price: High to Low"
                        : sortBy === "name-asc"
                          ? "Name: A to Z"
                          : "Name: Z to A"}
                  <ChevronDown className="size-4 transition-transform group-hover:rotate-180" />
                </Button>

                {/* Sort Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "name-asc", label: "Name: A to Z" },
                    { value: "name-desc", label: "Name: Z to A" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full text-left px-4 py-3 hover:bg-secondary transition-colors ${
                        sortBy === option.value
                          ? "text-primary bg-primary/10"
                          : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters Button */}
              <Button
                variant="outline"
                className="gap-2 reset-btn"
                onClick={resetFilters}
              >
                <RefreshCw className="size-4" />
                Reset
              </Button>
            </div>
          </motion.div>

          {/* Grid Layout */}
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            {/* Sidebar - Desktop Filters */}
            <aside ref={sidebarRef} className="hidden lg:block space-y-8">
              {/* Categories */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-border">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    Categories
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {categories.length}
                  </span>
                </div>
                <ul className="space-y-3">
                  {categories.map((item, index) => (
                    <li key={item}>
                      <button
                        onClick={() => {
                          setSelectedCategory(item);
                          gsap.to(`.category-btn-${index}`, {
                            scale: 0.95,
                            duration: 0.1,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.inOut",
                          });
                        }}
                        className={`category-btn-${index} w-full text-left p-3 rounded-xl transition-all duration-300 ${
                          selectedCategory === item
                            ? "bg-primary/10 text-primary font-bold border border-primary/20"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5 hover:pl-5"
                        }`}
                        data-active={
                          selectedCategory === item ? "true" : "false"
                        }
                      >
                        {item}
                        {selectedCategory === item && (
                          <ArrowRight className="inline size-4 ml-2 animate-pulse" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <h3 className="font-bold text-lg mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <div className="size-2 bg-accent rounded-full" />
                  Price Range
                </h3>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        ${priceRange[0]}
                      </span>
                      <span className="text-sm font-medium">
                        ${priceRange[1]}
                      </span>
                    </div>
                    <div className="relative h-2 bg-secondary rounded-full">
                      <div
                        className="price-slider-track absolute h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        style={{ width: `${(priceRange[1] / 2000) * 100}%` }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Min
                      </label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value) || 0,
                            priceRange[1],
                          ])
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        min="0"
                        max={priceRange[1]}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">
                        Max
                      </label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value) || 2000,
                          ])
                        }
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                        min={priceRange[0]}
                        max="2000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
                <h3 className="font-bold text-lg mb-6 pb-3 border-b border-border flex items-center gap-2">
                  <div className="size-2 bg-green-500 rounded-full" />
                  Active Filters
                </h3>
                <div className="space-y-3">
                  {selectedCategory !== "All" && (
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm">Category</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {selectedCategory}
                        </span>
                        <button
                          onClick={() => setSelectedCategory("All")}
                          className="p-1 hover:bg-primary/10 rounded"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {(priceRange[0] > 0 || priceRange[1] < 2000) && (
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm">Price Range</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ${priceRange[0]} - ${priceRange[1]}
                        </span>
                        <button
                          onClick={() => {
                            const maxPrice =
                              allProducts.length > 0
                                ? Math.max(
                                    ...allProducts.map((p) => p.price || 0),
                                  )
                                : 2000;
                            setPriceRange([0, Math.ceil(maxPrice)]);
                          }}
                          className="p-1 hover:bg-primary/10 rounded"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {sortBy !== "featured" && (
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                      <span className="text-sm">Sort By</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {sortBy === "price-low"
                            ? "Price: Low to High"
                            : sortBy === "price-high"
                              ? "Price: High to Low"
                              : sortBy === "name-asc"
                                ? "Name: A to Z"
                                : "Name: Z to A"}
                        </span>
                        <button
                          onClick={() => setSortBy("featured")}
                          className="p-1 hover:bg-primary/10 rounded"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div ref={gridRef} className="space-y-8">
              {!isLoading && sortedProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                    <Filter className="size-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No Products Found</h3>
                  <p className="text-muted-foreground mb-6">
                    No products found in "{selectedCategory}" category.
                    {priceRange[0] > 0 || priceRange[1] < 2000
                      ? ` (Price range: $${priceRange[0]} - $${priceRange[1]})`
                      : ""}
                  </p>
                  <Button onClick={resetFilters} className="gap-2 group">
                    Reset All Filters
                    <RefreshCw className="size-4 group-hover:rotate-180 transition-transform" />
                  </Button>
                </motion.div>
              ) : (
                <>
                  <ProductGrid
                    products={sortedProducts}
                    isLoading={isLoading}
                    title={null}
                    showTitle={false}
                  />

                  {/* Load More Button with animation */}
                  {!isLoading && sortedProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center pt-8"
                    >
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-full px-8 gap-2 group border-primary/30 hover:border-primary hover:bg-primary/5"
                        onClick={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 0.95,
                            duration: 0.2,
                            yoyo: true,
                            repeat: 1,
                            ease: "power2.inOut",
                          });
                        }}
                      >
                        Load More
                        <ChevronDown className="size-4 group-hover:rotate-180 transition-transform" />
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button for Mobile Filters */}
      <div className="fixed bottom-8 right-8 z-50 lg:hidden">
        <Button
          size="lg"
          className="rounded-full px-6 shadow-2xl hover:shadow-3xl bg-gradient-to-r from-primary to-accent group"
          onClick={() => {
            setShowFilters(true);
            gsap.to(".fab-filter", {
              rotation: 360,
              duration: 0.8,
              ease: "back.out(1.7)",
            });
          }}
        >
          <Filter className="size-5 mr-2 fab-filter group-hover:rotate-12 transition-transform" />
          Filters
        </Button>
      </div>
    </div>
  );
}
