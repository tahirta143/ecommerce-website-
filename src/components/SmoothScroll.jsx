"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
    useGSAP(() => {
        // Global ScrollTrigger defaults or setup can go here
        // For now, we mainly ensure plugins are registered client-side
    }, []);

    return <>{children}</>;
}
