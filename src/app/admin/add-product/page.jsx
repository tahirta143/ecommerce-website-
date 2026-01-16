"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, Plus, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Electronics",
        image: "",
        description: "",
        isNew: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const containerRef = useRef(null);

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
            )
            .fromTo(".form-field",
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.4, stagger: 0.05 },
                "-=0.6"
            );
    }, { scope: containerRef });

    const categories = ["Electronics", "Furniture", "Wearables", "Lighting", "Photography", "Accessories", "Kitchen"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Adding Product:", formData);
        setIsSubmitting(false);
        setIsSuccess(true);

        // Success animation for checkmark
        gsap.fromTo(".success-check",
            { scale: 0, rotate: -45 },
            { scale: 1.2, rotate: 0, duration: 0.5, ease: "back.out(1.7)" }
        );

        setTimeout(() => {
            setIsSuccess(false);
            setFormData({
                name: "",
                price: "",
                category: "Electronics",
                image: "",
                description: "",
                isNew: true
            });
        }, 3000);
    };

    return (
        <div ref={containerRef} className="max-w-4xl mx-auto flex flex-col min-h-screen">
            <div className="flex items-center justify-between mb-8 add-product-header">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Add New Product</h1>
                    <p className="text-zinc-500 font-medium">List a new item in your curated store.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Form Fields */}
                <div className="lg:col-span-2 space-y-6 form-section">
                    <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
                        <div className="space-y-2 form-field">
                            <label className="text-sm font-bold text-zinc-700 ml-1">Product Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black outline-none transition-all placeholder:text-zinc-300"
                                placeholder="e.g. Minimalist Ceramic Vase"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 form-field">
                                <label className="text-sm font-bold text-zinc-700 ml-1">Price ($)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black outline-none transition-all placeholder:text-zinc-300"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-2 form-field">
                                <label className="text-sm font-bold text-zinc-700 ml-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full h-14 px-5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black outline-none transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 form-field">
                            <label className="text-sm font-bold text-zinc-700 ml-1">Description</label>
                            <textarea
                                rows={5}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-5 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black outline-none transition-all resize-none placeholder:text-zinc-300"
                                placeholder="Tell the story of this product..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6 form-section">
                    <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm space-y-6">
                        <div className="space-y-2 form-field">
                            <label className="text-sm font-bold text-zinc-700 ml-1">Product Image URL</label>
                            <div className="aspect-square rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                                {formData.image ? (
                                    <Image
                                        src={formData.image}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt="Preview"
                                        fill
                                        unoptimized
                                    />
                                ) : (
                                    <>
                                        <Upload className="size-8 text-zinc-300 mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="text-xs text-zinc-400 text-center">Paste image URL below</p>
                                    </>
                                )}
                            </div>
                            <input
                                required
                                type="url"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full h-12 px-4 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:border-black outline-none placeholder:text-zinc-300"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 form-field">
                            <span className="text-sm font-bold">New Arrival</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isNew: !formData.isNew })}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-all relative outline-none",
                                    formData.isNew ? "bg-black" : "bg-zinc-200"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 size-4 rounded-full bg-white transition-all",
                                    formData.isNew ? "right-1" : "left-1"
                                )} />
                            </button>
                        </div>

                        <div className="form-field">
                            <Button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className={cn(
                                    "w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-95",
                                    isSuccess ? "bg-green-500 hover:bg-green-600 text-white" : "bg-black text-white hover:bg-zinc-800"
                                )}
                            >
                                {isSubmitting ? "Creating..." : isSuccess ? (
                                    <span className="flex items-center gap-2 italic">
                                        Success <Check className="size-5 success-check" />
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">Publish <Plus className="size-5" /></span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
