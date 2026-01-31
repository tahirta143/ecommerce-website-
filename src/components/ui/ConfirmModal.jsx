"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import gsap from "gsap";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

/**
 * Trigger a premium GSAP confirmation modal from anywhere in the app
 * @param {Object} options - Configuration for the modal
 * @param {string} options.title - The title of the modal
 * @param {string} options.message - The message to display
 * @param {string} options.confirmText - Label for confirm button
 * @param {string} options.cancelText - Label for cancel button
 * @param {Function} options.onConfirm - Callback when confirmed
 * @param {Function} options.onCancel - Callback when cancelled
 * @param {boolean} options.isDestructive - Whether the action is destructive (red theme)
 */
export const showConfirm = (options) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("show-confirm", { detail: options }));
    }
};

export default function ConfirmModal() {
    const [config, setConfig] = useState(null);
    const modalRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleShowConfirm = (e) => {
            setConfig(e.detail);
        };
        window.addEventListener("show-confirm", handleShowConfirm);
        return () => window.removeEventListener("show-confirm", handleShowConfirm);
    }, []);

    useEffect(() => {
        if (config && modalRef.current) {
            const tl = gsap.timeline();

            // Kill existing
            gsap.killTweensOf(overlayRef.current);
            gsap.killTweensOf(contentRef.current);

            // Animate overlay
            tl.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: "power2.out" }
            );

            // Animate content - Premium Pop
            tl.fromTo(contentRef.current,
                { y: 50, opacity: 0, scale: 0.9, rotateX: -20 },
                { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: 0.6, ease: "back.out(1.7)" },
                "-=0.2"
            );
        }
    }, [config]);

    const close = (callback) => {
        const tl = gsap.timeline({
            onComplete: () => {
                setConfig(null);
                if (callback) callback();
            }
        });

        tl.to(contentRef.current, {
            y: 20,
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in"
        }).to(overlayRef.current, {
            opacity: 0,
            duration: 0.2
        }, "-=0.1");
    };

    if (!config) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[999999] flex items-center justify-center p-4 perspective-1000">
            {/* Overlay */}
            <div
                ref={overlayRef}
                onClick={() => close(config.onCancel)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Content */}
            <div
                ref={contentRef}
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100"
            >
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "size-14 rounded-2xl flex items-center justify-center shrink-0",
                            config.isDestructive ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
                        )}>
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900">{config.title || "Are you sure?"}</h3>
                            <p className="text-zinc-500 text-sm mt-1">{config.message}</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1 rounded-full h-12"
                            onClick={() => close(config.onCancel)}
                        >
                            {config.cancelText || "Cancel"}
                        </Button>
                        <Button
                            className={cn(
                                "flex-1 rounded-full h-12 text-white",
                                config.isDestructive ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-zinc-800"
                            )}
                            onClick={() => close(config.onConfirm)}
                        >
                            {config.confirmText || "Confirm"}
                        </Button>
                    </div>
                </div>

                <button
                    onClick={() => close(config.onCancel)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-50 text-zinc-400 transition-colors"
                >
                    <X className="size-5" />
                </button>
            </div>
        </div>
    );
}
