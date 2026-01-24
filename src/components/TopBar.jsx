"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "40px", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-foreground text-background relative z-50 overflow-hidden"
            >
                <div className="container mx-auto px-4 h-full flex items-center justify-between text-xs font-medium">
                    <div className="flex-1 text-center">
                        <span className="opacity-80">Spring Sale is Live! </span>
                        <span className="font-bold border-b border-background/20 ml-1">Get 50% Off Everything</span>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity p-1"
                        aria-label="Close announcement"
                    >
                        <X className="size-3" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
