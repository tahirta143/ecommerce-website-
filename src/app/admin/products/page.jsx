"use client";

import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, ExternalLink, Package, AlertCircle, RefreshCw, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { showToast } from "@/components/ui/Toast";
import { showConfirm } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";

export default function ProductsList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(null);
    const [backendStatus, setBackendStatus] = useState("checking");
    const [apiBase, setApiBase] = useState("https://backend-with-node-js-ueii.onrender.com");
    const containerRef = useRef(null);

    // Function to get a valid image URL
    const getImageUrl = (product) => {
        if (!product) return "/placeholder-image.png";

        let imageUrl = "";

        // Try images array first
        if (product.images && product.images.length > 0) {
            const first = product.images[0];
            imageUrl = typeof first === "string" ? first : (first.url || "");
        }
        // Then try single image property
        else if (product.image) {
            imageUrl = typeof product.image === "string" ? product.image : (product.image.url || "");
        }

        // If no URL, return placeholder
        if (!imageUrl || imageUrl.trim() === "") {
            return "/placeholder-image.png";
        }

        // If it's already a full URL, return it
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // If it's a base64 image, return it directly
        if (imageUrl.startsWith('data:image/')) {
            return imageUrl;
        }

        // If it's a relative path, prepend the API base URL
        if (imageUrl.startsWith('/')) {
            return `${apiBase}${imageUrl}`;
        }

        // If it's just a filename or path, construct the full URL
        return `${apiBase}/uploads/${imageUrl}`;
    };

    // Function to check if URL is valid for Next.js Image component
    const isValidImageUrl = (url) => {
        if (!url) return false;

        // Next.js Image component requires URLs to be in remotePatterns
        // For now, we'll check if it's a standard URL
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            // Not a valid URL, might be base64 or relative path
            return url.startsWith('data:image/') || url.startsWith('/');
        }
    };

    // Check backend health on mount
    useEffect(() => {
        const checkBackendHealth = async () => {
            try {
                console.log("Checking backend health at:", `${apiBase}/health`);
                const response = await fetch(`${apiBase}/health`, {
                    method: "GET",
                    mode: "cors",
                    credentials: "include"
                });

                if (response.ok) {
                    setBackendStatus("healthy");
                    console.log("Backend is healthy");
                } else {
                    setBackendStatus("unhealthy");
                    console.error("Backend responded with error:", response.status);
                }
            } catch (err) {
                setBackendStatus("offline");
                console.error("Backend is offline:", err.message);
            }
        };

        checkBackendHealth();
    }, [apiBase]);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in to view products");
            }

            console.log("Fetching products from:", `${apiBase}/api/products`);

            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(`${apiBase}/api/products`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "token": token,
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include",
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log("Response status:", response.status);

            if (!response.ok) {
                let errorMessage = `Server error (${response.status})`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If no JSON response, use status text
                    errorMessage = `${response.status}: ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Products data received:", data);

            if (data.success) {
                setProducts(data.data || []);
            } else {
                throw new Error(data.message || "Failed to fetch products");
            }
        } catch (err) {
            console.error("Fetch Products Error:", err);

            let userMessage;
            if (err.name === 'AbortError') {
                userMessage = "Request timeout: Server took too long to respond.";
            } else if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
                userMessage = `Cannot connect to backend server at ${apiBase}. Please check:
1. The backend is running
2. Your internet connection
3. CORS configuration`;
            } else if (err.message.includes("401") || err.message.includes("403")) {
                userMessage = "Authentication error. Please log in again.";
            } else {
                userMessage = err.message;
            }

            setError(userMessage);
            setBackendStatus("offline");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [apiBase]);

    const handleDelete = async (id) => {
        const product = products.find(p => p._id === id);
        if (!product) return;

        showConfirm({
            title: "Delete Product",
            message: `Are you sure you want to delete "${product.title}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            isDestructive: true,
            onConfirm: async () => {
                try {
                    setIsDeleting(id);
                    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");

                    const response = await fetch(`${apiBase}/api/products/${id}`, {
                        method: "DELETE",
                        mode: "cors",
                        headers: {
                            "token": token,
                            "Authorization": `Bearer ${token}`,
                            "Accept": "application/json"
                        },
                        credentials: "include"
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `Delete failed (${response.status})`);
                    }

                    const data = await response.json();
                    if (data.success) {
                        setProducts(products.filter(p => p._id !== id));
                        showToast("Product deleted successfully", "success");
                    } else {
                        throw new Error(data.message || "Failed to delete product");
                    }
                } catch (err) {
                    console.error("Delete Product Error:", err);
                    showToast(err.message === "Failed to fetch" ? "Network Error: Could not connect to server." : err.message, "error");
                } finally {
                    setIsDeleting(null);
                }
            }
        });
    };

    const handleRetry = () => {
        setError(null);
        setIsLoading(true);
        fetchProducts();
    };

    const handleUseLocalBackend = () => {
        if (window.confirm("Switch to local backend (http://localhost:5000)? Make sure your local backend is running.")) {
            setApiBase("http://localhost:5000");
        }
    };

    const handleUseProductionBackend = () => {
        setApiBase("https://backend-with-node-js-ueii.onrender.com");
    };

    useGSAP(() => {
        if (isLoading) return;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".products-header",
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.8 }
        )
            .fromTo(".products-table-container",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1 },
                "-=0.4"
            )
            .fromTo(".product-row",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 },
                "-=0.6"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-8 flex flex-col min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 products-header">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Inventory Management</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-zinc-500 font-medium text-sm">Manage and update your products.</p>
                        <div className="flex items-center gap-1">
                            <div className={cn(
                                "size-2 rounded-full",
                                backendStatus === "healthy" ? "bg-green-500 animate-pulse" :
                                    backendStatus === "unhealthy" ? "bg-yellow-500" :
                                        "bg-red-500"
                            )} />
                            <span className="text-xs text-zinc-400">
                                Backend: {apiBase.replace("https://", "").replace("http://", "")}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleRetry}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        disabled={isLoading}
                    >
                        <RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                    <Link href="/admin/add-product">
                        <Button className="rounded-full shadow-lg h-12 px-6 active:scale-95 transition-transform">
                            Add New Product
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Backend Status Banner */}
            {backendStatus === "offline" && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="size-5 text-red-500" />
                        <div>
                            <p className="text-red-700 font-bold">Backend Server Offline</p>
                            <p className="text-red-600 text-sm">
                                Cannot connect to {apiBase}. The server may be sleeping or not running.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleUseLocalBackend}
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                        >
                            Use Local Backend
                        </Button>
                        <Button
                            onClick={handleRetry}
                            variant="ghost"
                            size="sm"
                            className="rounded-lg"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="size-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
                    <p className="text-zinc-500 font-medium animate-pulse">Loading Inventory...</p>
                    <p className="text-xs text-zinc-400">Connecting to: {apiBase}</p>
                </div>
            ) : error ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
                    <div className="p-4 bg-red-50 rounded-full">
                        <AlertCircle className="size-12 text-red-500" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-zinc-900 font-bold text-lg">Connection Failed</p>
                        <p className="text-zinc-600 max-w-md">{error}</p>
                        <p className="text-sm text-zinc-400">
                            Current backend: {apiBase}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button onClick={handleRetry} className="rounded-full">
                            <RefreshCw className="size-4 mr-2" />
                            Retry Connection
                        </Button>
                        <Button onClick={handleUseLocalBackend} variant="outline" className="rounded-full">
                            Try Local Backend
                        </Button>
                        {apiBase.includes("localhost") && (
                            <Button onClick={handleUseProductionBackend} variant="ghost" className="rounded-full">
                                Back to Production
                            </Button>
                        )}
                    </div>
                </div>
            ) : products.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-8">
                    <div className="p-4 bg-zinc-50 rounded-full">
                        <Package className="size-12 text-zinc-300" />
                    </div>
                    <div className="text-center space-y-2">
                        <p className="text-zinc-900 font-bold text-lg">No Products Found</p>
                        <p className="text-zinc-500">Your inventory is empty. Start by adding your first product.</p>
                    </div>
                    <Link href="/admin/add-product">
                        <Button className="rounded-full">Add Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-zinc-500 text-sm">
                            Showing {products.length} product{products.length !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleRetry}
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                            >
                                <RefreshCw className="size-3" />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden products-table-container">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-zinc-100">
                                        <th className="px-6 md:px-8 py-4 text-sm font-bold text-zinc-500">Product</th>
                                        <th className="px-6 md:px-8 py-4 text-sm font-bold text-zinc-500">Category</th>
                                        <th className="px-6 md:px-8 py-4 text-sm font-bold text-zinc-500">Price (PKR)</th>
                                        <th className="px-6 md:px-8 py-4 text-sm font-bold text-zinc-500">Stock</th>
                                        <th className="px-6 md:px-8 py-4 text-sm font-bold text-zinc-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => {
                                        const imageUrl = getImageUrl(product);
                                        const isValidUrl = isValidImageUrl(imageUrl);

                                        return (
                                            <tr key={product._id} className="product-row group hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                                                <td className="px-6 md:px-8 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 md:size-14 rounded-xl overflow-hidden bg-zinc-100 shadow-inner relative flex-shrink-0">
                                                            {isValidUrl ? (
                                                                <Image
                                                                    src={imageUrl}
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    alt={product.title}
                                                                    fill
                                                                    sizes="(max-width: 768px) 48px, 56px"
                                                                    unoptimized={true} // Bypass Next.js optimization for external images
                                                                    onError={(e) => {
                                                                        // If image fails to load, show fallback
                                                                        e.target.style.display = 'none';
                                                                        const parent = e.target.parentElement;
                                                                        const fallback = parent.querySelector('.image-fallback');
                                                                        if (fallback) fallback.style.display = 'flex';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                                                    <ImageIcon className="size-6" />
                                                                </div>
                                                            )}
                                                            {/* Fallback container */}
                                                            <div className="image-fallback absolute inset-0 hidden items-center justify-center bg-zinc-100">
                                                                <ImageIcon className="size-6 text-zinc-300" />
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="font-bold text-zinc-900 truncate max-w-[150px] md:max-w-[200px]">
                                                                {product.title}
                                                            </div>
                                                            <div className="text-xs text-zinc-400 truncate">
                                                                ID: {product._id?.substring(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 md:px-8 py-4">
                                                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 md:px-8 py-4 font-bold text-zinc-900">Rs. {product.price}</td>
                                                <td className="px-6 md:px-8 py-4">
                                                    <span className={cn(
                                                        "flex items-center gap-1 text-sm font-bold",
                                                        product.stock > 0 ? "text-zinc-600" : "text-red-500"
                                                    )}>
                                                        <div className={cn("size-1.5 rounded-full", product.stock > 0 ? "bg-green-500" : "bg-red-500 animate-pulse")} />
                                                        {product.stock} in stock
                                                    </span>
                                                </td>
                                                <td className="px-6 md:px-8 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/admin/add-product?edit=${product._id}`}>
                                                            <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 active:scale-90 transition-transform">
                                                                <Edit className="size-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            onClick={() => handleDelete(product._id)}
                                                            disabled={isDeleting === product._id}
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-red-50 hover:text-red-600 active:scale-90 transition-transform"
                                                        >
                                                            {isDeleting === product._id ? (
                                                                <div className="size-4 border-2 border-zinc-200 border-t-red-500 rounded-full animate-spin" />
                                                            ) : (
                                                                <Trash2 className="size-4" />
                                                            )}
                                                        </Button>
                                                        <Link href={`/product/${product._id}`} target="_blank">
                                                            <Button variant="ghost" size="icon" className="active:scale-90 transition-transform">
                                                                <ExternalLink className="size-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}