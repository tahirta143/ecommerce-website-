"use client";

import { products } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Star, Truck, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import { useRef, useState } from "react"; // Added imports
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

    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const detailsRef = useRef(null);
    const [activeTab, setActiveTab] = useState("Description");
    const [isOrdered, setIsOrdered] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);

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

    const handleOrder = contextSafe(() => {
        setIsOrdered(true);
        const btn = document.getElementById("order-btn");
        if (btn) {
            gsap.to(btn, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    gsap.to(btn, { width: "100%", backgroundColor: "#22c55e", color: "white", duration: 0.4 });
                }
            });
        }
    });

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

                    <div className="flex gap-4 pt-4">
                        <Button
                            id="checkout-btn"
                            size="lg"
                            className={`flex-1 text-lg h-14 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 bg-primary hover:bg-primary/90`}
                            onClick={() => setShowReceipt(true)}
                            disabled={isOrdered}
                        >
                            <ShoppingBag className="mr-2 size-5" /> Checkout Now
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 w-14 rounded-xl p-0 hover:bg-muted/50">
                            <Star className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-background rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-border animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-border bg-muted/30">
                            <h2 className="text-xl font-bold text-center">Order Summary</h2>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative size-20 rounded-xl overflow-hidden bg-muted border border-border">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">{product.category}</p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${product.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tax (10%)</span>
                                    <span>${(product.price * 0.1).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border text-foreground">
                                    <span>Total</span>
                                    <span>${(product.price * 1.1).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 pt-2 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 h-12 rounded-xl"
                                onClick={() => setShowReceipt(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                id="confirm-btn"
                                className={`flex-[2] h-12 rounded-xl text-lg transition-all ${isOrdered ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'}`}
                                onClick={handleOrder}
                                disabled={isOrdered}
                            >
                                {isOrdered ? (
                                    <>
                                        <CheckCircle className="mr-2 size-5" /> Paid!
                                    </>
                                ) : (
                                    "Confirm Payment"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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
