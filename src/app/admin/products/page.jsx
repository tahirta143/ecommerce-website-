"use client";

import { products } from "@/lib/data";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function ProductsList() {
    const containerRef = useRef(null);

    useGSAP(() => {
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
            <div className="flex items-center justify-between products-header">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Inventory Management</h1>
                    <p className="text-zinc-500 font-medium">Manage and update your products.</p>
                </div>
                <Link href="/admin/add-product">
                    <Button className="rounded-full shadow-lg h-12 px-6 active:scale-95 transition-transform">Add New Product</Button>
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden products-table-container">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-zinc-100">
                            <th className="px-8 py-5 text-sm font-bold text-zinc-500">Product</th>
                            <th className="px-8 py-5 text-sm font-bold text-zinc-500">Category</th>
                            <th className="px-8 py-5 text-sm font-bold text-zinc-500">Price</th>
                            <th className="px-8 py-5 text-sm font-bold text-zinc-500">Status</th>
                            <th className="px-8 py-5 text-sm font-bold text-zinc-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="product-row group hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
                                <td className="px-8 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-14 rounded-xl overflow-hidden bg-zinc-100 shadow-inner relative">
                                            <Image
                                                src={product.image}
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt={product.name}
                                                fill
                                            />
                                        </div>
                                        <div className="font-bold text-zinc-900">{product.name}</div>
                                    </div>
                                </td>
                                <td className="px-8 py-4">
                                    <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-4 font-bold text-zinc-900">${product.price}</td>
                                <td className="px-8 py-4">
                                    {product.isNew ? (
                                        <span className="text-green-600 flex items-center gap-1 text-sm font-bold">
                                            <div className="size-1.5 rounded-full bg-green-600 animate-pulse" /> New
                                        </span>
                                    ) : (
                                        <span className="text-zinc-400 flex items-center gap-1 text-sm font-medium">
                                            <div className="size-1.5 rounded-full bg-zinc-400" /> Regular
                                        </span>
                                    )}
                                </td>
                                <td className="px-8 py-4">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 active:scale-90 transition-transform">
                                            <Edit className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 active:scale-90 transition-transform">
                                            <Trash2 className="size-4" />
                                        </Button>
                                        <Link href={`/product/${product.id}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="active:scale-90 transition-transform">
                                                <ExternalLink className="size-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
