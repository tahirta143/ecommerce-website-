"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}) {
    const variants = {
        primary: 'bg-gradient-to-r from-primary to-violet-500 text-white hover:opacity-90 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent/10 hover:text-accent hover:border-accent',
        ghost: 'hover:bg-accent/10 hover:text-accent',
        link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-5 py-2.5',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
    };

    const buttonRef = useRef(null);
    const { contextSafe } = useGSAP({ scope: buttonRef });

    const handleMouseEnter = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    const handleMouseLeave = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    const handleMouseDown = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            scale: 0.95,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    const handleMouseUp = contextSafe((e) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    return (
        <button
            ref={buttonRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={cn(
                "inline-flex items-center cursor-pointer justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
