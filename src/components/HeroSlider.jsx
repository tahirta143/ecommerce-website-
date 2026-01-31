"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SLIDES = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        title: "Pure Aesthetics",
        subtitle: "Elevate your living space.",
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
        title: "Modern Form",
        subtitle: "Design that speaks volumes.",
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
        title: "Timeless Luxury",
        subtitle: "Crafted for perfection.",
    },
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef(null);
    const sliderRef = useRef(null);
    const autoplayRef = useRef(null);

    const { contextSafe } = useGSAP(() => {
        // Initial set up for 3D
        gsap.set(".slide-item", {
            rotateY: (i) => i * -90,
            transformOrigin: "50% 50% -50vw", // Push back by half viewport width approx
            z: "-50vw", // Start pushed back
            opacity: 1
        });

        // Bring active slide to front
        gsap.set(".slide-item", {
            z: (i) => i === 0 ? 0 : "-50vw",
            opacity: (i) => i === 0 ? 1 : 0.5
        });

    }, { scope: containerRef });

    const changeSlide = contextSafe((index) => {
        if (index === currentIndex) return;

        const direction = index > currentIndex ? 1 : -1;
        // Handle wrap around for direction calculation if needed, simpler for 3 slides to just go direct for now or implement continuous rotation.
        // Let's do a continuous rotation effect for smooth 3D

        const rotationY = index * -90;

        // Animate the specific slides
        const slides = gsap.utils.toArray(".slide-item");
        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        const tl = gsap.timeline();

        // 3D Rotation Animation
        tl.to(currentSlide, {
            z: "-50vw",
            rotateY: 90 * (index > currentIndex ? -1 : 1), // Rotate out
            opacity: 0.5,
            duration: 1.2,
            ease: "power3.inOut"
        }, 0);

        tl.fromTo(nextSlide,
            {
                rotateY: 90 * (index > currentIndex ? 1 : -1),
                z: "-50vw",
                opacity: 0.5
            },
            {
                rotateY: 0,
                z: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.inOut"
            }, 0
        );

        // Text Animation
        const texts = gsap.utils.toArray(".text-content");
        const currentText = texts[currentIndex];
        const nextText = texts[index];

        gsap.to(currentText.querySelectorAll(".animate-text"), {
            y: -50,
            opacity: 0,
            duration: 0.5,
            stagger: 0.05
        });

        gsap.fromTo(nextText.querySelectorAll(".animate-text"),
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 0.4, ease: "power3.out" }
        );

        setCurrentIndex(index);
    });

    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % SLIDES.length;
            changeSlide(nextIndex);
        }, 6000);

        return () => clearInterval(autoplayRef.current);
    }, [currentIndex, changeSlide]);

    return (
        <div ref={containerRef} className="relative h-screen min-h-[500px] w-full overflow-hidden bg-black text-white perspective-1000">
            {/* 3D Container */}
            <div ref={sliderRef} className="relative w-full h-full transform-style-3d">
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="slide-item absolute inset-0 w-full h-full backface-hidden"
                        style={{
                            // Initial styles handled by GSAP, but basic setup
                            zIndex: index === currentIndex ? 10 : 0
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" />
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={index === 0}
                            className="object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className="text-content absolute inset-0 flex items-center justify-center text-center"
                        style={{ opacity: index === currentIndex ? 1 : 0, pointerEvents: index === currentIndex ? 'auto' : 'none' }}
                    >
                        <div className="container mx-auto px-4 flex flex-col items-center gap-6">
                            <span className="animate-text inline-block py-1.5 px-6 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-[0.2em] border border-white/20 shadow-2xl">
                                New Collection
                            </span>
                            <h1 className="animate-text text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl leading-none">
                                {slide.title}
                            </h1>
                            <p className="animate-text text-xl md:text-2xl text-zinc-200 max-w-2xl mx-auto font-medium drop-shadow-lg px-4">
                                {slide.subtitle}
                            </p>
                            <div className="animate-text pt-8">
                                <Link href="/shop">
                                    <Button size="lg" className="rounded-full h-16 px-12 text-lg bg-white text-black hover:bg-zinc-200 hover:-translate-y-1 transition-all shadow-2xl active:scale-95 font-bold pointer-events-auto">
                                        Shop Now <ArrowRight className="ml-3 size-6" />
                                    </Button>
                                </Link>
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
                        className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-10 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
}
