/**
 * Utility to extract dominant color from an image URL using canvas.
 * This runs on the client side.
 */
export async function getDominantColor(imageUrl) {
    if (!imageUrl || typeof window === 'undefined') return 'rgba(0,0,0,0.1)';

    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Scale down for performance
                canvas.width = 50;
                canvas.height = 50;

                ctx.drawImage(img, 0, 0, 50, 50);

                const imageData = ctx.getImageData(0, 0, 50, 50).data;
                let r = 0, g = 0, b = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    r += imageData[i];
                    g += imageData[i + 1];
                    b += imageData[i + 2];
                }

                const count = imageData.length / 4;
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);

                // Boost saturation/brightness slightly for better glow effect
                const factor = 1.1;
                r = Math.min(255, Math.floor(r * factor));
                g = Math.min(255, Math.floor(g * factor));
                b = Math.min(255, Math.floor(b * factor));

                resolve(`rgba(${r}, ${g}, ${b}, 0.9)`);
            } catch (error) {
                console.warn("Could not extract dominant color:", error);
                resolve('rgba(0,0,0,0.1)');
            }
        };

        img.onerror = () => {
            resolve('rgba(0,0,0,0.1)');
        };
    });
}
