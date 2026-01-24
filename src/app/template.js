// 'use client';

// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { useRef } from "react";

// if (typeof window !== "undefined") {
//     gsap.registerPlugin(useGSAP);
// }

// export default function Template({ children }) {
//     const containerRef = useRef(null);

//     useGSAP(() => {
//         gsap.fromTo(containerRef.current,
//             { opacity: 0, y: 20 },
//             { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
//         );
//     }, { scope: containerRef });

//     return (
//         <div ref={containerRef}>
//             {children}
//         </div>
//     );
// }

'use client';

import { useRef, useEffect } from "react";
import gsap from "gsap";

export default function Template({ children }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Animation on mount
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }, []);

    return <div ref={containerRef}>{children}</div>;
}
