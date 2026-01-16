"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop", // Reliable Shop Interior
        title: "Pure Aesthetics",
        subtitle: "Elevate your living space.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop", // Fashion Coat
        title: "Modern Form",
        subtitle: "Design that speaks volumes.",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop", // Fashion Model
        title: "Timeless Luxury",
        subtitle: "Crafted for perfection.",
    },
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const autoplayRef = useRef(null);

    const { contextSafe } = useGSAP(() => {
        // Initial entrance
        const tl = gsap.timeline();
        tl.fromTo(".slide-item:first-child",
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
        )
            .fromTo(".text-content:first-child .animate-text",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power3.out" },
                "-=1"
            );
    }, { scope: containerRef });

    const changeSlide = contextSafe((index) => {
        if (index === currentIndex) return;

        const slides = gsap.utils.toArray(".slide-item");
        const texts = gsap.utils.toArray(".text-content");

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];
        const currentText = texts[currentIndex];
        const nextText = texts[index];

        // Outgoing
        gsap.to(currentSlide, { opacity: 0, scale: 1.1, duration: 1, ease: "power2.inOut" });
        gsap.to(currentText.querySelectorAll(".animate-text"), { y: -30, opacity: 0, duration: 0.5, stagger: 0.05 });

        // Incoming
        gsap.fromTo(nextSlide,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.inOut" }
        );
        gsap.fromTo(nextText.querySelectorAll(".animate-text"),
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: "power3.out" }
        );

        setCurrentIndex(index);
    });

    // Auto-play logic
    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % SLIDES.length;
            changeSlide(nextIndex);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(autoplayRef.current);
    }, [currentIndex, changeSlide]); // Reset timer on slide change

    return (
        <div ref={containerRef} className="relative h-screen min-h-[400px] w-full overflow-hidden bg-white text-black">
            {SLIDES.map((slide, index) => (
                <div
                    key={slide.id}
                    className="slide-item absolute inset-0 w-full h-full"
                    style={{ opacity: index === 0 ? 1 : 0, zIndex: 0 }}
                >
                    {/* Darker Gradient Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 z-10" />
                    <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover scale-105"
                    />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`text-content absolute inset-x-0 ${index === currentIndex ? "pointer-events-auto" : "pointer-events-none"}`}
                        style={{ opacity: index === currentIndex ? 1 : 0 }}
                    >
                        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                            <span className="animate-text inline-block py-1.5 px-6 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl">
                                New Collection
                            </span>
                            <h1 className="animate-text text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] leading-none">
                                {slide.title}
                            </h1>
                            <p className="animate-text text-xl md:text-2xl text-zinc-200 max-w-2xl mx-auto font-medium drop-shadow-lg px-4">
                                {slide.subtitle}
                            </p>
                            <div className="animate-text pt-8">
                                <Button size="lg" className="rounded-full h-16 px-12 text-lg bg-white text-black hover:bg-zinc-200 hover:-translate-y-1 transition-all shadow-2xl active:scale-95 font-bold">
                                    Shop Now <ArrowRight className="ml-3 size-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-4">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => changeSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-10 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
