"use client";

import { Button } from "@/components/ui/Button";
import {
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Helper function to get image URL
const getImageUrl = (image) => {
  if (!image) return "/placeholder.jpg";
  if (typeof image === "string") return image;
  if (image.url) return image.url;
  return "/placeholder.jpg";
};

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const { addToCart } = useCart();

  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const tabContentRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Description");
  const [isAdded, setIsAdded] = useState(false);

  // State for API data
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch product data
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch single product
        const response = await fetch(
          `https://backend-with-node-js-ueii.onrender.com/api/products/${id}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`);
        }

        const data = await response.json();

        // Check if API returned success and has data
        if (data.success && data.data) {
          setProduct(data.data);

          // Fetch all products to find related ones
          const allProductsResponse = await fetch(
            "https://backend-with-node-js-ueii.onrender.com/api/products",
          );
          if (allProductsResponse.ok) {
            const allProductsData = await allProductsResponse.json();

            if (allProductsData.success && allProductsData.data) {
              // Filter products with same category AND different ID
              // Take only the first 4 related products
              const relatedProducts = allProductsData.data
                .filter(
                  (p) => p._id !== id && p.category === data.data.category,
                )
                .slice(0, 4);
              setRelatedProducts(relatedProducts);
            }
          }
        } else {
          throw new Error("Product not found in API response");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // GSAP Animation for product details
  useGSAP(
    () => {
      if (!product || loading) return;

      // Reset elements to initial state
      gsap.set([imageRef.current, detailsRef.current], { clearProps: "all" });

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 0.8,
        },
      });

      // Image animation
      tl.fromTo(
        imageRef.current,
        {
          opacity: 0,
          x: -80,
          scale: 0.8,
          rotation: -5,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          rotation: 0,
          duration: 1.2,
        },
      );

      // Details animation with staggered children
      tl.fromTo(
        detailsRef.current.children,
        {
          opacity: 0,
          y: 30,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.15,
          duration: 0.8,
        },
        "-=0.5",
      );

      // Add subtle floating animation to image
      gsap.to(imageRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    },
    { scope: containerRef, dependencies: [product, loading] },
  );

  // GSAP for tab changes
  useGSAP(
    () => {
      if (isAnimating || !tabContentRef.current) return;

      const tl = gsap.timeline();

      // Fade out current content
      tl.to(tabContentRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsAnimating(false);
        },
      })
        // Fade in new content
        .to(
          tabContentRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          "+=0.1",
        );
    },
    { scope: containerRef, dependencies: [activeTab] },
  );

  const handleAddToCart = () => {
    if (!product) return;

    // Get the first image URL properly
    const firstImage =
      product.images && product.images.length > 0
        ? getImageUrl(product.images[0])
        : "/placeholder.jpg";

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

    // Add to cart animation
    gsap.to("#add-cart-btn", {
      scale: 1.1,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setTimeout(() => setIsAdded(false), 2000);
      },
    });

    // Floating cart icon animation
    const cartIcon = gsap.utils.toArray(".cart-icon")[0];
    if (cartIcon) {
      gsap.to(cartIcon, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;

    const message = `Hi, I want to order this product:
    
Name: ${product.title}
Price: $${product.price}
Link: ${window.location.href}
    
Please confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/923254828492?text=${encodedMessage}`, "_blank");

    // WhatsApp button animation
    gsap.to("#whatsapp-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
  };

  const handleTabChange = (tab) => {
    if (tab === activeTab || isAnimating) return;

    setIsAnimating(true);
    setActiveTab(tab);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 size-4" /> Back to Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get main image URL
  const mainImageUrl =
    product.images && product.images.length > 0
      ? getImageUrl(product.images[0])
      : "/placeholder.jpg";

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 size-4" /> Back to Shopping
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
        {/* Product Image */}
        <div
          ref={imageRef}
          className="w-full aspect-square rounded-3xl overflow-hidden bg-muted border border-border relative shadow-2xl"
        >
          <Image
            src={mainImageUrl}
            alt={product.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              console.error("Image failed to load:", mainImageUrl);
              e.target.src = "/placeholder.jpg";
            }}
          />
          {/* Image overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        </div>

        {/* Product Details */}
        <div ref={detailsRef} className="space-y-8">
          <div>
            <span className="text-primary font-medium tracking-wider uppercase text-sm inline-block px-4 py-1.5 bg-primary/10 rounded-full">
              {product.category || "Uncategorized"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-foreground leading-tight">
              {product.title}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ${product.price?.toFixed(2) || "0.00"}
              </span>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="size-5 fill-current" />
                <span className="font-medium text-foreground">4.9</span>
                <span className="text-muted-foreground">(128 reviews)</span>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg bg-card/50 p-6 rounded-2xl border border-border">
            {product.description ||
              `Experience premium quality with our ${product.title.toLowerCase()}. Designed for modern lifestyles, this product combines aesthetics with functionality.`}
          </p>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-card/30 rounded-xl">
              <Truck className="size-5 text-primary" />
              <span>Free global shipping on orders over $200</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-card/30 rounded-xl">
              <ShieldCheck className="size-5 text-primary" />
              <span>2-year commercial warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-sm p-3 bg-card/30 rounded-xl">
              <div
                className={`size-3 rounded-full ${product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
              ></div>
              <span
                className={
                  product.stock > 0
                    ? "text-green-600 font-medium"
                    : "text-red-600"
                }
              >
                {product.stock > 0
                  ? `✓ In Stock (${product.stock} available)`
                  : "✗ Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              id="add-cart-btn"
              size="lg"
              className={`flex-1 text-lg h-14 rounded-xl transition-all shadow-lg hover:shadow-xl ${
                isAdded
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-zinc-100 to-zinc-200 text-foreground hover:from-zinc-200 hover:to-zinc-300 dark:from-zinc-900 dark:to-zinc-800 dark:text-white"
              }`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {isAdded ? (
                <>
                  <CheckCircle className="mr-2 size-5 animate-bounce" /> Added
                  to Cart
                </>
              ) : product.stock <= 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingBag className="mr-2 size-5" /> Add to Cart
                </>
              )}
            </Button>
            <Button
              id="whatsapp-btn"
              size="lg"
              className="flex-1 text-lg h-14 rounded-xl transition-all shadow-xl hover:shadow-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white hover:from-[#128C7E] hover:to-[#075E54]"
              onClick={handleWhatsAppOrder}
              disabled={product.stock <= 0}
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 size-5 fill-current stroke-none"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Order WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs & Additional Info */}
      <div className="mt-24">
        <div className="flex border-b border-border mb-8 overflow-x-auto">
          {["Description", "Reviews", "Specifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-8 py-4 text-lg font-medium transition-all border-b-2 -mb-[2px] whitespace-nowrap ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div ref={tabContentRef} className="min-h-[200px]">
          {activeTab === "Description" && (
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground">
              <p>
                {product.description ||
                  `Elevate your lifestyle with the ${product.title}. Created with precision and care, this masterpiece offers unparalleled performance and aesthetic appeal. Whether you are a professional or an enthusiast, this is the perfect addition to your collection.`}
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Premium materials for durability and comfort.</li>
                <li>Designed in-house by award-winning creatives.</li>
                <li>Eco-friendly packaging and sustainable production.</li>
                <li>Tested for quality and durability standards.</li>
                <li>Comes with a satisfaction guarantee.</li>
              </ul>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="space-y-6">
              <div className="bg-card/50 p-6 rounded-2xl border border-border">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to review this product!
                </p>
                <Button className="mt-2">Write a Review</Button>
              </div>
              <div className="bg-card/30 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-500">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Average rating: 4.9/5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on 128 verified purchases
                </p>
              </div>
            </div>
          )}
          {activeTab === "Specifications" && (
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Product ID</span>
                <span className="font-medium text-foreground">
                  {product._id}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Stock Available</span>
                <span className="font-medium text-foreground">
                  {product.stock} units
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium text-foreground">
                  ${product.price?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Created Date</span>
                <span className="font-medium text-foreground">
                  {new Date(product.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium text-foreground">
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="md:col-span-2 flex justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">Product Status</span>
                <span
                  className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {product.stock > 0 ? "Active & In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="text-3xl font-bold mb-12">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct, index) => {
              // Get related product image URL
              const relatedImageUrl =
                relatedProduct.images && relatedProduct.images.length > 0
                  ? getImageUrl(relatedProduct.images[0])
                  : "/placeholder.jpg";

              return (
                <div key={relatedProduct._id} className="group">
                  <Link href={`/product/${relatedProduct._id}`}>
                    <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden mb-4 border border-border group-hover:border-primary transition-all duration-300">
                      <Image
                        src={relatedImageUrl}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        onError={(e) => {
                          console.error(
                            "Related image failed to load:",
                            relatedImageUrl,
                          );
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                      {relatedProduct.title}
                    </h3>
                    <p className="text-muted-foreground">
                      ${relatedProduct.price?.toFixed(2) || "0.00"}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
