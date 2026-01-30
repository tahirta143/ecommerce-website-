"use client";

import { orders } from "@/lib/orders";
import { Search, Filter, MoreHorizontal, Eye, Download, CheckCircle2, Clock, Truck, XCircle, Package } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const statusStyles = {
    "Delivered": "bg-green-50 text-green-600 border-green-100",
    "Processing": "bg-blue-50 text-blue-600 border-blue-100",
    "Shipped": "bg-purple-50 text-purple-600 border-purple-100",
    "Pending": "bg-orange-50 text-orange-600 border-orange-100",
    "Cancelled": "bg-red-50 text-red-600 border-red-100",
};

const statusIcons = {
    "Delivered": <CheckCircle2 className="size-4" />,
    "Processing": <Clock className="size-4" />,
    "Shipped": <Truck className="size-4" />,
    "Pending": <Package className="size-4" />,
    "Cancelled": <XCircle className="size-4" />,
};

export default function AdminOrders() {
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".orders-header",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 }
        )
            .fromTo(".orders-filters",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            )
            .fromTo(".order-row",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.05 },
                "-=0.2"
            );
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 orders-header">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Orders</h1>
                    <p className="text-zinc-500 font-medium">Manage and track all customer orders in one place.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10">
                    <Download className="size-5" />
                    Export Orders
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-3xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 orders-filters">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer name..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-zinc-50 border-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-3 bg-zinc-50 text-zinc-600 rounded-2xl font-medium hover:bg-zinc-100 transition-all text-sm border border-zinc-100">
                        <Filter className="size-4" />
                        Filters
                    </button>
                    <select className="px-4 py-3 bg-zinc-50 text-zinc-600 rounded-2xl font-medium hover:bg-zinc-100 transition-all text-sm border border-zinc-100 outline-none">
                        <option>Last 30 days</option>
                        <option>Last 7 days</option>
                        <option>Lifetime</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-50">
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">Order ID</th>
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">Customer</th>
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">Date</th>
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">Total</th>
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-6 text-sm font-bold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="order-row group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-zinc-900">#{order.id}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full overflow-hidden bg-zinc-100 relative">
                                                <Image
                                                    src={order.customer.avatar}
                                                    alt={order.customer.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-zinc-900">{order.customer.name}</div>
                                                <div className="text-xs text-zinc-500">{order.customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-medium text-zinc-600">{order.date}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-zinc-900">${order.total.toFixed(2)}</span>
                                        <div className="text-[10px] text-zinc-400">{order.items} {order.items === 1 ? 'item' : 'items'}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyles[order.status]}`}>
                                            {statusIcons[order.status]}
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-400 hover:text-black">
                                            <MoreHorizontal className="size-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
