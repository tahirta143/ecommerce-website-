"use client";

import { Package, Users, DollarSign, ArrowUpRight, TrendingUp, FolderTree } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        products: [],
        categories: [],
        isLoading: true
    });
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch("https://backend-with-node-js-ueii.onrender.com/api/products"),
                    fetch("https://backend-with-node-js-ueii.onrender.com/api/categories")
                ]);
                const prodData = await prodRes.json();
                const catData = await catRes.json();

                setStatsData({
                    products: prodData.data || [],
                    categories: catData.data || [],
                    isLoading: false
                });
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setStatsData(prev => ({ ...prev, isLoading: false }));
            }
        };
        fetchData();
    }, []);

    useGSAP(() => {
        if (statsData.isLoading) return;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".dashboard-header",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 }
        )
            .fromTo(".stat-card",
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1 },
                "-=0.4"
            )
            .fromTo(".dashboard-content-card",
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2 },
                "-=0.4"
            );
    }, { scope: containerRef });

    const stats = [
        { label: "Total Products", value: statsData.products.length, icon: <Package />, color: "bg-blue-50 text-blue-600" },
        { label: "Categories", value: statsData.categories.length, icon: <FolderTree />, color: "bg-purple-50 text-purple-600" },
        { label: "Revenue", value: "Rs. 42,850", icon: <DollarSign />, color: "bg-green-50 text-green-600" },
        { label: "Growth", value: "+12.5%", icon: <TrendingUp />, color: "bg-orange-50 text-orange-600" },
    ];

    if (statsData.isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="size-12 border-4 border-zinc-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="space-y-8 flex flex-col min-h-screen">
            <div className="flex items-center justify-between dashboard-header">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Overall Overview</h1>
                    <p className="text-zinc-500 font-medium">Welcome back, here&apos;s what&apos;s happening with your store.</p>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold flex items-center gap-2">
                        Last 7 Days <ArrowUpRight className="size-4" />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="stat-card bg-white p-6 rounded-[2rem] border border-zinc-100 shadow-sm flex items-center gap-6">
                        <div className={`size-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <div className="text-sm font-medium text-zinc-500">{stat.label}</div>
                            <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Products / Activity placeholder */}
            <div className="grid lg:grid-cols-2 gap-8 flex-1">
                <div className="dashboard-content-card bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-6">Recent Products</h2>
                    <div className="space-y-4">
                        {statsData.products.slice(0, 5).map(product => (
                            <div key={product._id} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl overflow-hidden bg-zinc-200 relative">
                                        <Image
                                            src={product.images && product.images[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm truncate max-w-[200px]">{product.title}</div>
                                        <div className="text-xs text-zinc-500">{product.category}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-sm">${product.price}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-content-card bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="size-20 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-zinc-400">
                        <TrendingUp className="size-8" />
                    </div>
                    <h3 className="text-lg font-bold">Analytics Coming Soon</h3>
                    <p className="text-zinc-500 text-sm max-w-xs mt-2">
                        We&apos;re building advanced charts and performance data for your store.
                    </p>
                </div>
            </div>
        </div>
    );
}
