"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Star, Heart, Shield, Zap } from "lucide-react";
import Link from "next/link";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AboutPage() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Hero Animation
        tl.fromTo(".about-hero-content",
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.2 }
        );

        // Section Animations on Scroll
        gsap.utils.toArray(".reveal-section").forEach((section) => {
            gsap.fromTo(section,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Values Grid Animation
        gsap.fromTo(".value-card",
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                stagger: 0.2,
                duration: 0.6,
                scrollTrigger: {
                    trigger: ".values-grid",
                    start: "top 80%"
                }
            }
        );
    }, { scope: containerRef });

    const values = [
        { icon: <Star className="size-6" />, title: "Excellence", desc: "We strive for perfection in every detail of our curated collection." },
        { icon: <Heart className="size-6" />, title: "Community", desc: "Connecting with our customers through a shared love for quality design." },
        { icon: <Shield className="size-6" />, title: "Trust", desc: "Your security and satisfaction are our top priorities, always." },
        { icon: <Zap className="size-6" />, title: "Innovation", desc: "Always evolving to bring you the latest trends and technologies." }
    ];

    return (
        <div ref={containerRef} className="bg-background">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                        alt="Aesthetic Interior"
                        fill
                        className="object-cover brightness-50"
                        priority
                    />
                </div>
                <div className="container mx-auto px-4 z-10 text-center about-hero-content">
                    <span className="inline-block py-1 px-4 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-sm font-semibold mb-6 border border-primary/30">
                        Our Essence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">Designed for Living</h1>
                    <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
                        Elevating everyday experiences through curated excellence and timeless design.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="reveal-section">
                            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                                <p>
                                    LuxeMarket began with a simple vision: to create a space where modern form meets functional perfection. We believe that the objects you surround yourself with should reflect your personality and enhance your life.
                                </p>
                                <p>
                                    What started as a small boutique has grown into a global destination for those seeking premium quality, sustainable production, and award-winning design. Each piece in our collection is handpicked for its craftsmanship and unique story.
                                </p>
                            </div>
                            <div className="pt-8">
                                <Link href="/shop">
                                    <Button size="lg" className="rounded-full">
                                        Explore the Collection <ArrowRight className="ml-2 size-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl reveal-section">
                            <Image
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
                                alt="Studio Showcase"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 reveal-section">
                        <h2 className="text-4xl font-bold mb-4">Our Values</h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            The core principles that guide every decision we make and every product we select.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 values-grid">
                        {values.map((v, i) => (
                            <div key={i} className="value-card p-8 rounded-3xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                                <p className="text-muted-foreground line-height-relaxed">
                                    {v.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto p-12 rounded-[3rem] bg-gradient-to-br from-primary to-violet-600 text-white text-center shadow-2xl reveal-section">
                        <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
                        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Subscribe to receive exclusive previews, design inspiration, and special offers delivered to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="name@email.com"
                                className="flex-1 h-14 px-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-white/60"
                            />
                            <Button variant="secondary" size="lg" className="h-14 rounded-2xl px-8 font-bold">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
