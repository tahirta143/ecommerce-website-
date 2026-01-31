"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, Info, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Trigger a premium GSAP notification from anywhere in the app
 * @param {string} message - The text to display
 * @param {'success' | 'error' | 'info' | 'warning'} type - The theme of the toast
 */
export const showToast = (message, type = "success") => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type } }));
    }
};

export default function Toast() {
    const [toast, setToast] = useState(null);
    const [mounted, setMounted] = useState(false);
    const toastRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleShowToast = (e) => {
            setToast(e.detail);
        };
        window.addEventListener("show-toast", handleShowToast);
        return () => window.removeEventListener("show-toast", handleShowToast);
    }, []);

    useEffect(() => {
        if (toast && toastRef.current) {
            const tl = gsap.timeline();

            // Kill any existing animations
            gsap.killTweensOf(toastRef.current);
            gsap.killTweensOf(iconRef.current);

            // Intro animation - "Beautiful Pop" (Slide down from top)
            tl.fromTo(toastRef.current,
                { y: -50, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
            );

            // Icon punch
            tl.fromTo(iconRef.current,
                { scale: 0, rotate: -90 },
                { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(2)" },
                "-=0.3"
            );

            // Auto-hide after 3.5 seconds
            const timer = setTimeout(() => {
                gsap.to(toastRef.current, {
                    y: -20,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => setToast(null)
                });
            }, 3500);

            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast || !mounted) return null;

    const themes = {
        success: {
            icon: <CheckCircle2 className="size-5 text-green-500" />,
            bg: "bg-white/80 border-green-100 shadow-green-500/10",
        },
        error: {
            icon: <XCircle className="size-5 text-red-500" />,
            bg: "bg-white/80 border-red-100 shadow-red-500/10",
        },
        info: {
            icon: <Info className="size-5 text-blue-500" />,
            bg: "bg-white/80 border-blue-100 shadow-blue-500/10",
        },
        warning: {
            icon: <AlertCircle className="size-5 text-orange-500" />,
            bg: "bg-white/80 border-orange-100 shadow-orange-500/10",
        },
    };

    const theme = themes[toast.type] || themes.success;

    return createPortal(
        <div
            ref={toastRef}
            className={cn(
                "fixed top-6 right-6 z-[99999]",
                "flex items-center gap-4 px-6 py-4 rounded-[2rem] border shadow-2xl backdrop-blur-xl",
                "min-w-[320px] max-w-[400px]",
                theme.bg
            )}
        >
            <div ref={iconRef} className="flex-shrink-0">
                {theme.icon}
            </div>
            <p className="text-[15px] font-bold text-zinc-900 tracking-tight flex-1">
                {toast.message}
            </p>
            <button
                onClick={() => setToast(null)}
                className="size-6 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400"
            >
                <XCircle className="size-4" />
            </button>
        </div>,
        document.body
    );
}
