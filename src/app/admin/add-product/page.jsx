"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Upload, Plus, Check, Image as ImageIcon, AlertCircle, Trash2, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { showToast } from "@/components/ui/Toast";
import { showConfirm } from "@/components/ui/ConfirmModal";

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

    const categories = ["Electronics", "Furniture", "Wearables", "Lighting", "Photography", "Accessories", "Kitchen"];

    // Test backend connection
    const testBackendConnection = async () => {
        try {
            setBackendStatus("checking");
            const response = await fetch(`${API_BASE}/health`);
            setBackendStatus(response.ok ? "online" : "error");
        } catch (err) {
            setBackendStatus("offline");
        }
    };

    useEffect(() => {
        testBackendConnection();
    }, []);

    // Fetch product for editing
    useEffect(() => {
        if (editId) {
            const fetchProduct = async () => {
                try {
                    setIsLoading(true);
                    const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
                    if (!token) throw new Error("Please log in first");

                    const response = await fetch(`${API_BASE}/api/products/${editId}`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    });

                    if (!response.ok) throw new Error(`Failed to load product (${response.status})`);

                    const data = await response.json();
                    if (data.success && data.data) {
                        const product = data.data;
                        setFormData({
                            title: product.title || "",
                            price: product.price || "",
                            category: product.category || "Electronics",
                            images: product.images && product.images.length > 0
                                ? product.images.map(img => ({ url: img.url || "", type: "link", file: null }))
                                : product.image
                                    ? [{ url: typeof product.image === "string" ? product.image : (product.image.url || ""), type: "link", file: null }]
                                    : [{ url: "", type: "link", file: null }],
                            description: product.description || "",
                            stock: product.stock || 0
                        });
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProduct();
        }
    }, [editId]);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(".add-product-header", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
            .fromTo(".form-section", { opacity: 0, scale: 0.98, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2 }, "-=0.4");
    }, { scope: containerRef });

    const handleImageChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index].url = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleFileChange = (index, file) => {
        if (!file || !file.type.startsWith('image/')) {
            setError("Please select a valid image file");
            return;
        }
        const newImages = [...formData.images];
        newImages[index] = { file, url: URL.createObjectURL(file), type: "upload" };
        setFormData({ ...formData, images: newImages });
        setError("");
    };

    const toggleImageType = (index) => {
        const newImages = [...formData.images];
        newImages[index] = { url: "", type: newImages[index].type === "link" ? "upload" : "link", file: null };
        setFormData({ ...formData, images: newImages });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, { url: "", type: "link", file: null }] });
    };

    const removeImageField = (index) => {
        if (formData.images.length === 1) return;
        setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        if (!formData.title.trim() || !formData.price || !formData.description.trim()) {
            setError("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        const validImagesCount = formData.images.filter(img => img.url.trim() !== "" || img.file).length;
        if (validImagesCount === 0) {
            setError("Please add at least one image");
            setIsSubmitting(false);
            return;
        }

        try {
            const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
            if (!token) throw new Error("Authentication required.");

            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('description', formData.description.trim());
            formDataToSend.append('stock', formData.stock || 0);

            // Append images
            formData.images.forEach((img) => {
                if (img.type === 'upload' && img.file) {
                    formDataToSend.append('images', img.file);
                } else if (img.url && img.url.trim() !== "") {
                    formDataToSend.append('images', img.url);
                }
            });

            console.log("Submitting FormData...");

            const url = editId ? `${API_BASE}/api/products/${editId}` : `${API_BASE}/api/products`;

            const response = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formDataToSend
            });

            const result = await response.json();

            if (!response.ok || !result.success) throw new Error(result.message || "Submission failed");

            showToast(`Product ${editId ? 'updated' : 'created'} successfully!`, "success");
            setIsSuccess(true);
            gsap.fromTo(".success-check", { scale: 0, rotate: -45 }, { scale: 1.2, rotate: 0, duration: 0.5 });

            setTimeout(() => {
                router.push("/admin/products");
                setIsSuccess(false);
            }, 2000);

        } catch (err) {
            setError(err.message || "Something went wrong");
            showToast(err.message || "Submission failed", "error");
            setIsSubmitting(false);
        }
    };
    const debugConnection = () => {
        testBackendConnection().then(ok => showToast(ok ? "Backend Online" : "Backend Offline", ok ? "success" : "error"));
    };

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto p-4 md:p-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 add-product-header gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">{editId ? "Edit Product" : "Add New Product"}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-zinc-500 font-medium text-sm">Create or modify products in your store</p>
                        <div className="size-2 rounded-full" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={debugConnection} variant="outline" size="sm" className="rounded-full"><Server className="size-4 mr-2" />Status</Button>
                    <Button variant="ghost" onClick={() => router.push("/admin/products")} className="rounded-full">Cancel</Button>
                </div>
            </div>

            {error && <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3"><AlertCircle className="size-5" />{error}</div>}

            {isLoading ? <div className="py-20 text-center"><div className="size-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin mx-auto pb-4" />Loading...</div> : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6 form-section">
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Product Title *</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-black transition-all" placeholder="Modern Eames Chair" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Price (Rs.) *</label>
                                    <input type="number" required step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-black transition-all" placeholder="1500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-700">Stock *</label>
                                    <input type="number" required value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-black transition-all" placeholder="100" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Category *</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full h-12 px-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-black transition-all appearance-none cursor-pointer">
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-zinc-700">Description *</label>
                                <textarea rows={5} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 rounded-xl bg-zinc-50 border border-zinc-200 outline-none focus:border-black transition-all resize-none" placeholder="Elevate your space with this timeless piece..." />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 form-section">
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-zinc-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between"><label className="text-sm font-bold text-zinc-700">Images</label><Button type="button" variant="ghost" size="sm" onClick={addImageField}><Plus className="size-3 mr-1" />Add</Button></div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                {formData.images.map((img, idx) => (
                                    <div key={idx} className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3">
                                        <div className="flex gap-1 mb-2">
                                            <button type="button" onClick={() => toggleImageType(idx)} className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all", img.type === "link" ? "bg-black text-white" : "bg-white border")}>URL</button>
                                            <button type="button" onClick={() => toggleImageType(idx)} className={cn("flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all", img.type === "upload" ? "bg-black text-white" : "bg-white border")}>FILE</button>
                                        </div>
                                        <div className="aspect-square rounded-xl bg-zinc-100 overflow-hidden relative border border-zinc-200">
                                            {img.url ? <Image src={img.url} alt="Preivew" fill className="object-cover" unoptimized /> : <div className="absolute inset-0 flex items-center justify-center text-zinc-300"><ImageIcon className="size-8" /></div>}
                                        </div>
                                        <div className="flex gap-2">
                                            {img.type === "link" ? (
                                                <input type="url" value={img.url} onChange={e => handleImageChange(idx, e.target.value)} className="flex-1 h-9 px-3 text-xs rounded-lg border border-zinc-200 outline-none focus:border-black transition-all" placeholder="https://..." />
                                            ) : (
                                                <div className="flex-1 relative">
                                                    <input type="file" accept="image/*" onChange={e => handleFileChange(idx, e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                                    <div className="h-9 px-3 flex items-center rounded-lg border border-zinc-200 bg-white text-zinc-500 text-[10px] truncate"><Upload className="size-3 mr-2" />{img.file ? img.file.name : "Choose File"}</div>
                                                </div>
                                            )}
                                            {formData.images.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeImageField(idx)} className="h-9 w-9 text-red-500 hover:bg-red-50"><Trash2 className="size-4" /></Button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="submit" disabled={isSubmitting || isSuccess} className={cn("w-full h-12 rounded-xl font-bold shadow-lg transition-all active:scale-95", isSuccess ? "bg-green-500 text-white" : (isSubmitting ? "bg-zinc-400" : "bg-black text-white"))}>{isSubmitting ? "Processing..." : isSuccess ? "Success!" : editId ? "Update Product" : "Add Product"}</Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}