"use client";

import { products } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import { useRef, useState } from "react"; // Added imports
import { useCart } from "@/context/CartContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParams, notFound } from "next/navigation"; // Import useParams and notFound
import Link from "next/link"; // Added Link import
import Image from "next/image"; // Added Image import

// NOTE: generateStaticParams removed for now as we are in a dynamic environment or it can be kept if using SSG.
// Kept simple for client-side functionality focus.

export default function ProductPage() {
    const params = useParams();
    const id = params?.id;
    const product = products.find((p) => p.id.toString() === id);
    const { addToCart } = useCart(); // Added useCart hook

    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const detailsRef = useRef(null);
    const [activeTab, setActiveTab] = useState("Description");
    const [isAdded, setIsAdded] = useState(false); // To show "Added!" feedback

    const { contextSafe } = useGSAP(() => {
        if (!product) return;
        // Entry Animation
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        if (imageRef.current && detailsRef.current) {
            tl.fromTo(imageRef.current,
                { opacity: 0, x: -50, scale: 0.9 },
                { opacity: 1, x: 0, scale: 1, duration: 1 }
            )
                .fromTo(detailsRef.current.children,
                    { opacity: 0, x: 50 },
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.8 },
                    "-=0.5"
                );
        }
    }, { scope: containerRef });

    if (!id) return null;
    if (!product) return notFound();

    const handleAddToCart = contextSafe(() => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);

        // Simple scale animation for button
        gsap.fromTo("#add-cart-btn", { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
    });

    const handleWhatsAppOrder = () => {
        const message = `Hi, I want to order this product:
        
Name: ${product.name}
Price: $${product.price}
Link: ${window.location.href}
        
Please confirm my order.`;

        const encodedMessage = encodeURIComponent(message);
        // Replace with actual number if provided, otherwise generic
        window.open(`https://wa.me/923254828492?text=${encodedMessage}`, '_blank');
    };

    const handleTabChange = contextSafe((tab) => {
        if (tab === activeTab) return;

        // Simple fade out/in effect
        gsap.to(".tab-content-area", {
            opacity: 0,
            y: 10,
            duration: 0.2,
            onComplete: () => {
                setActiveTab(tab);
                gsap.to(".tab-content-area", { opacity: 1, y: 0, duration: 0.3 });
            }
        });
    });

    return (
        <div ref={containerRef} className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 size-4" /> Back to Shopping
            </Link>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 ">
                {/* Product Image */}
                <div ref={imageRef} className=" w-200px h-200px aspect-square rounded-3xl overflow-hidden bg-muted border border-border">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Product Details */}
                <div ref={detailsRef} className="space-y-8">
                    <div>
                        <span className="text-primary font-medium tracking-wider uppercase text-sm">
                            {product.category}
                        </span>
                        <h1 className="text-4xl font-bold mt-2 mb-4 text-foreground">{product.name}</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl font-bold text-foreground">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="size-5 fill-current" />
                                <span className="font-medium text-foreground">4.9</span>
                                <span className="text-muted-foreground">(128 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg">
                        Experience premium quality with our {product.name.toLowerCase()}.
                        Designed for modern lifestyles, this product combines aesthetics with functionality.
                        Perfect for those who appreciate attention to detail.
                    </p>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Truck className="size-5 text-primary" />
                            <span>Free global shipping on orders over $200</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <ShieldCheck className="size-5 text-primary" />
                            <span>2-year commercial warranty included</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            id="add-cart-btn"
                            size="lg"
                            className={`flex-1 text-lg h-14 rounded-xl transition-all shadow-lg hover:translate-y-[-2px] ${isAdded ? "bg-green-500 hover:bg-green-600" : "bg-zinc-100 text-foreground hover:bg-zinc-200"
                                }`}
                            onClick={handleAddToCart}
                        >
                            {isAdded ? (
                                <>
                                    <CheckCircle className="mr-2 size-5" /> Added to Cart
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="mr-2 size-5" /> Add to Cart
                                </>
                            )}
                        </Button>
                        <Button
                            size="lg"
                            className="flex-1 text-lg h-14 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:translate-y-[-2px] bg-[#25D366] hover:bg-[#128C7E] text-white"
                            onClick={handleWhatsAppOrder}
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
                            className={`px-8 py-4 text-lg font-medium transition-all border-b-2 -mb-[2px] whitespace-nowrap ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="tab-content-area prose prose-lg dark:prose-invert max-w-none text-muted-foreground min-h-[200px]">
                    {activeTab === "Description" && (
                        <>
                            <p>
                                Elevate your lifestyle with the {product.name}. Created with precision and care,
                                this masterpiece offers unparalleled performance and aesthetic appeal.
                                Whether you are a professional or an enthusiast, this is the perfect addition to your collection.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>Premium materials for durability and comfort.</li>
                                <li>Designed in-house by award-winning creatives.</li>
                                <li>Eco-friendly packaging and sustainable production.</li>
                            </ul>
                        </>
                    )}
                    {activeTab === "Reviews" && (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-muted/30 p-6 rounded-xl border border-border">
                                    <div className="flex items-center gap-2 mb-2 text-yellow-500">
                                        {"★".repeat(5)}
                                    </div>
                                    <h4 className="font-bold text-foreground mb-1">Absolutely fantastic!</h4>
                                    <p className="text-sm text-muted-foreground">&quot;I&apos;ve been looking for something like this for ages. The quality is unmatched and the delivery was super fast.&quot;</p>
                                    <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Verified Buyer • 2 days ago</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === "Specifications" && (
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                            <div className="flex justify-between py-3 border-b border-border">
                                <span>Material</span>
                                <span className="font-medium text-foreground">Premium Grade A</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                                <span>Weight</span>
                                <span className="font-medium text-foreground">1.2 kg</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                                <span>Dimensions</span>
                                <span className="font-medium text-foreground">24 x 12 x 5 cm</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                                <span>Warranty</span>
                                <span className="font-medium text-foreground">2 Years Limited</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                                <span>Origin</span>
                                <span className="font-medium text-foreground">Designed in California</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-24 border-t border-border pt-16">
                <h2 className="text-3xl font-bold mb-12">You might also like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products
                        .filter(p => p.category === product.category && p.id !== product.id)
                        .slice(0, 4)
                        .map(relatedProduct => (
                            <div key={relatedProduct.id} className="group">
                                <Link href={`/product/${relatedProduct.id}`}>
                                    <div className="relative aspect-[4/5] bg-muted rounded-2xl overflow-hidden mb-4 border border-border">
                                        <Image
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{relatedProduct.name}</h3>
                                    <p className="text-muted-foreground">${relatedProduct.price.toFixed(2)}</p>
                                </Link>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
