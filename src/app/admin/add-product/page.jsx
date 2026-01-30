"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Upload, Plus, Check, Image as ImageIcon, AlertCircle, Trash2, Link as LinkIcon, FileUp, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AddProduct() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("edit");
    const API_BASE = "https://backend-with-node-js-ueii.onrender.com";

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        category: "Electronics",
        images: [{ url: "", type: "link", file: null }],
        description: "",
        stock: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState("checking");
    const containerRef = useRef(null);

    // Test backend connection
    const testBackendConnection = async () => {
        try {
            setBackendStatus("checking");
            console.log("Testing backend connection...");

            const response = await fetch(`${API_BASE}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setBackendStatus("online");
                console.log("✅ Backend is online");
                return true;
            } else {
                setBackendStatus("error");
                console.log("⚠️ Backend error:", response.status);
                return false;
            }
        } catch (err) {
            setBackendStatus("offline");
            console.error('❌ Backend connection failed:', err.message);
            return false;
        }
    };

    // Test connection on mount
    useEffect(() => {
        testBackendConnection();
    }, [API_BASE]);

    // Fetch product for editing
    useEffect(() => {
        if (editId) {
            const fetchProduct = async () => {
                try {
                    setIsLoading(true);
                    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
                    if (!token) {
                        setError("Please log in first");
                        return;
                    }

                    const response = await fetch(`${API_BASE}/api/products/${editId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                            "token": token
                        }
                    });

                    console.log("Fetch response status:", response.status);

                    if (!response.ok) {
                        let errorMessage = `Failed to load product (${response.status})`;
                        try {
                            const errorData = await response.json();
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            // Ignore JSON parsing errors
                        }
                        throw new Error(errorMessage);
                    }

                    const data = await response.json();
                    console.log("Fetched product data:", data);

                    if (data.success && data.data) {
                        const product = data.data;
                        setFormData({
                            title: product.title || "",
                            price: product.price || "",
                            category: product.category || "Electronics",
                            images: product.images && product.images.length > 0
                                ? product.images.map(img => ({
                                    url: img.url || "",
                                    type: "link",
                                    file: null
                                }))
                                : [{ url: "", type: "link", file: null }],
                            description: product.description || "",
                            stock: product.stock || 0
                        });
                    } else {
                        throw new Error(data.message || "Invalid product data");
                    }
                } catch (err) {
                    console.error("Fetch error:", err);
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [editId, API_BASE]);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".add-product-header",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 }
        )
            .fromTo(".form-section",
                { opacity: 0, scale: 0.98, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2 },
                "-=0.4"
            );
    }, { scope: containerRef });

    const categories = ["Electronics", "Furniture", "Wearables", "Lighting", "Photography", "Accessories", "Kitchen"];

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index].url = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleFileChange = (index, file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        const newImages = [...formData.images];
        newImages[index] = {
            file: file,
            url: URL.createObjectURL(file),
            type: "upload"
        };
        setFormData({ ...formData, images: newImages });
        setError("");
    };

    const toggleImageType = (index) => {
        const newImages = [...formData.images];
        newImages[index].type = newImages[index].type === "link" ? "upload" : "link";
        newImages[index].url = "";
        newImages[index].file = null;
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { url: "", type: "link", file: null }]
        });
    };

    const removeImageField = (index) => {
        if (formData.images.length === 1) {
            setFormData({
                ...formData,
                images: [{ url: "", type: "link", file: null }]
            });
            return;
        }
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    // Debug function to test API
    const debugConnection = async () => {
        try {
            setError("");
            console.log("=== DEBUG CONNECTION ===");

            // Test 1: Health check
            console.log("1. Testing health endpoint...");
            const health = await fetch(`${API_BASE}/health`, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(`   Health: ${health.status} ${health.statusText}`);

            // Test 2: Check token
            const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
            console.log(`2. Token: ${token ? "Present" : "Missing"}`);
            if (token) {
                console.log(`   Token preview: ${token.substring(0, 20)}...`);

                // Decode token
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.log(`   Token payload:`, payload);
                } catch (e) {
                    console.log(`   Cannot decode token: ${e.message}`);
                }
            }

            // Test 3: Simple POST test
            console.log("3. Testing simple POST...");
            const testData = {
                title: "Debug Test Product",
                price: 99.99,
                category: "Electronics",
                description: "Test from debug",
                stock: 10,
                images: [{ url: "https://picsum.photos/200", alt: "Test" }]
            };

            if (token) {
                const postTest = await fetch(`${API_BASE}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                        'token': token
                    },
                    body: JSON.stringify(testData)
                }).catch(err => {
                    console.log(`   POST failed: ${err.message}`);
                    return null;
                });

                if (postTest) {
                    console.log(`   POST: ${postTest.status} ${postTest.statusText}`);
                    if (postTest.ok) {
                        const result = await postTest.json();
                        console.log(`   POST success:`, result);
                    } else {
                        const errorText = await postTest.text();
                        console.log(`   POST error: ${errorText}`);
                    }
                }
            } else {
                console.log("   Skipping POST test - no token");
            }

            alert("Debug complete! Check browser console for details.");
        } catch (err) {
            console.error("Debug error:", err);
            setError(`Debug failed: ${err.message}`);
        }
    };

    // FIXED SUBMIT FUNCTION
    // FIXED SUBMIT FUNCTION
    // FIXED SUBMIT FUNCTION - No upload endpoint needed
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        // Basic validation
        if (!formData.title.trim() || !formData.price || !formData.description.trim()) {
            setError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        // Check for at least one image
        const validImages = formData.images.filter(img => img.url.trim() !== "");
        if (validImages.length === 0) {
            setError("Please add at least one product image");
            setIsSubmitting(false);
            return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        try {
            const url = editId
                ? `${API_BASE}/api/products/${editId}`
                : `${API_BASE}/api/products`;

            const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
            if (!token) {
                throw new Error("Please log in to add products. No authentication token found.");
            }

            // Prepare images - SIMPLIFIED VERSION
            // Only use image URLs (no file uploads since no upload endpoint)
            const imageUrls = formData.images
                .filter(img => img.url.trim() !== "")
                .map(img => {
                    // If it's a file upload, convert to base64
                    if (img.type === "upload" && img.file) {
                        // Convert file to base64 for temporary preview
                        // Note: This sends large base64 strings - not ideal for production
                        // For production, you need an upload endpoint
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve({
                                url: reader.result,
                                alt: formData.title || "Product image",
                                type: "base64"
                            });
                            reader.onerror = reject;
                            reader.readAsDataURL(img.file);
                        });
                    } else {
                        // Regular URL
                        return Promise.resolve({
                            url: img.url,
                            alt: formData.title || "Product image",
                            type: "url"
                        });
                    }
                });

            // Wait for all base64 conversions
            const processedImages = await Promise.all(imageUrls);

            // Create request body
            const requestBody = {
                title: formData.title.trim(),
                price: parseFloat(formData.price),
                category: formData.category,
                description: formData.description.trim(),
                stock: parseInt(formData.stock) || 0,
                images: processedImages.map(img => ({
                    url: img.url,
                    alt: img.alt
                }))
            };

            console.log("Submitting to:", url);
            console.log("Request body:", requestBody);

            // Check if any images are base64 (too large for JSON)
            const hasBase64Images = processedImages.some(img => img.type === "base64");
            if (hasBase64Images) {
                console.warn("Warning: Using base64 images - payload may be large");

                // If base64 images are too large, warn the user
                const totalSize = JSON.stringify(requestBody).length;
                if (totalSize > 1000000) { // 1MB limit
                    if (!window.confirm(`Warning: The image data is large (${Math.round(totalSize / 1024)}KB). This may cause performance issues. Continue anyway?`)) {
                        setIsSubmitting(false);
                        return;
                    }
                }
            }

            const response = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "token": token,
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestBody),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log("Response status:", response.status);

            let result;
            const responseText = await response.text();
            console.log("Raw response:", responseText);

            try {
                result = JSON.parse(responseText);
                console.log("Parsed response:", result);
            } catch (jsonError) {
                console.error("JSON parse error:", jsonError);
                throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}`);
            }

            if (!response.ok) {
                throw new Error(result.message || `Server error (${response.status}): ${response.statusText}`);
            }

            if (!result.success) {
                throw new Error(result.message || "Operation failed");
            }

            // Success
            setIsSuccess(true);
            gsap.fromTo(".success-check",
                { scale: 0, rotate: -45 },
                { scale: 1.2, rotate: 0, duration: 0.5, ease: "back.out(1.7)" }
            );

            // Reset or redirect
            setTimeout(() => {
                if (editId) {
                    router.push("/admin/products");
                } else {
                    setFormData({
                        title: "",
                        price: "",
                        category: "Electronics",
                        images: [{ url: "", type: "link", file: null }],
                        description: "",
                        stock: 0
                    });
                }
                setIsSuccess(false);
            }, 2000);

        } catch (err) {
            console.error("Submit error:", err);
            clearTimeout(timeoutId);

            let errorMessage = err.message;

            if (err.name === "AbortError") {
                errorMessage = "Request timeout: Server took too long to respond.";
            } else if (err.message.includes("Failed to fetch") ||
                err.message.includes("NetworkError")) {
                errorMessage = `Network error: Cannot connect to backend at ${API_BASE}`;
            } else if (err.message.includes("401") || err.message.includes("403")) {
                errorMessage = "Authentication failed. Please log in again.";
                localStorage.removeItem("admin_token");
                localStorage.removeItem("token");
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div ref={containerRef} className="max-w-4xl mx-auto p-4 md:p-6">
            {/* Header with connection status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 add-product-header gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">
                        {editId ? "Edit Product" : "Add New Product"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-zinc-500 font-medium text-sm md:text-base">
                            {editId ? `Editing: ${formData.title || "product"}` : "Add a new product to your store"}
                        </p>
                        <div className="flex items-center gap-1">
                            <div className={cn(
                                "size-2 rounded-full",
                                backendStatus === "online" ? "bg-green-500 animate-pulse" :
                                    backendStatus === "error" ? "bg-yellow-500" :
                                        "bg-red-500"
                            )} />
                            <span className="text-xs text-zinc-400">
                                {backendStatus === "online" ? "Connected" :
                                    backendStatus === "error" ? "Error" : "Offline"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={debugConnection}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                    >
                        <Server className="size-4 mr-2" />
                        Debug
                    </Button>

                    {editId && (
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/admin/products")}
                            className="rounded-full"
                        >
                            Cancel
                        </Button>
                    )}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-red-700 font-bold">Error</p>
                            <p className="text-red-600 text-sm whitespace-pre-line">{error}</p>
                        </div>
                        <Button
                            onClick={() => setError("")}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                        >
                            Dismiss
                        </Button>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center space-y-4">
                        <div className="size-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin mx-auto" />
                        <p className="text-zinc-500">Loading product data...</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Left Column - Main Form */}
                    <div className="lg:col-span-2 space-y-6 form-section">
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Product Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                    placeholder="Product name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Price ($) *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0.01"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                        placeholder="0.00"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Stock *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                        placeholder="0"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all appearance-none cursor-pointer"
                                        disabled={isSubmitting}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Description *</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all resize-none"
                                    placeholder="Product description"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Images & Submit */}
                    <div className="space-y-6 form-section">
                        <div className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-zinc-700">Product Images</label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={addImageField}
                                        disabled={isSubmitting}
                                        className="text-xs"
                                    >
                                        <Plus className="size-3 mr-1" /> Add Image
                                    </Button>
                                </div>

                                {formData.images.map((img, index) => (
                                    <div key={index} className="space-y-3 p-4 bg-zinc-50 rounded-xl border border-zinc-200">
                                        <div className="flex gap-2 mb-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleImageType(index)}
                                                disabled={isSubmitting}
                                                className={cn(
                                                    "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
                                                    img.type === "link"
                                                        ? "bg-black text-white shadow-sm"
                                                        : "bg-white text-zinc-600 border hover:bg-zinc-50"
                                                )}
                                            >
                                                URL
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => toggleImageType(index)}
                                                disabled={isSubmitting}
                                                className={cn(
                                                    "flex-1 py-2 text-xs font-medium rounded-lg transition-all",
                                                    img.type === "upload"
                                                        ? "bg-black text-white shadow-sm"
                                                        : "bg-white text-zinc-600 border hover:bg-zinc-50"
                                                )}
                                            >
                                                Upload
                                            </button>
                                        </div>

                                        <div className="aspect-video rounded-lg bg-zinc-100 overflow-hidden relative border border-zinc-200">
                                            {img.url ? (
                                                <Image
                                                    src={img.url}
                                                    alt="Preview"
                                                    fill
                                                    className="object-cover"
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                                    <ImageIcon className="size-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            {img.type === "link" ? (
                                                <input
                                                    type="url"
                                                    value={img.url}
                                                    onChange={e => handleImageChange(index, e.target.value)}
                                                    className="flex-1 h-10 px-3 text-sm rounded-lg border border-zinc-200 focus:border-black focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                                    placeholder="https://example.com/image.jpg"
                                                    disabled={isSubmitting}
                                                />
                                            ) : (
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(index, e.target.files[0])}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                        disabled={isSubmitting}
                                                    />
                                                    <div className="h-10 px-3 flex items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 overflow-hidden">
                                                        <Upload className="size-3 mr-2 flex-shrink-0" />
                                                        <span className="truncate">
                                                            {img.file ? img.file.name : "Choose file..."}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {formData.images.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeImageField(index)}
                                                    disabled={isSubmitting}
                                                    className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={cn(
                                    "w-full h-12 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]",
                                    isSuccess ? "bg-green-500 hover:bg-green-600 text-white" :
                                        isSubmitting ? "bg-zinc-400 cursor-not-allowed" :
                                            "bg-black hover:bg-zinc-800 text-white"
                                )}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {editId ? "Updating..." : "Creating..."}
                                    </span>
                                ) : isSuccess ? (
                                    <span className="flex items-center justify-center gap-2">
                                        Success <Check className="size-5 success-check" />
                                    </span>
                                ) : editId ? (
                                    "Update Product"
                                ) : (
                                    "Add Product"
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}