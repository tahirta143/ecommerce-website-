"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, LogOut, Save } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminProfile() {
    const [adminData, setAdminData] = useState({
        name: "Admin User",
        email: "admin@luxemarket.com",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setAdminData(prev => ({
                    ...prev,
                    name: parsed.name || prev.name,
                    email: parsed.email || prev.email,
                }));
            } catch (e) {
                console.error("Failed to parse admin user", e);
            }
        }
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

        tl.fromTo(".profile-header",
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0 }
        )
            .fromTo(".profile-card",
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1 },
                "-=0.4"
            )
            .fromTo(".profile-field",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, stagger: 0.1 },
                "-=0.4"
            );
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="profile-header flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Admin Profile</h1>
                    <p className="text-zinc-500 mt-1">Manage your administrative account settings</p>
                </div>
                <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                    <LogOut className="size-4" /> Sign Out
                </Button>
            </div>

            <div className="profile-card bg-white rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-zinc-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 relative">
                    <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
                        <div className="relative group">
                            <div className="size-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                <Image
                                    src={adminData.avatar}
                                    alt="Admin Avatar"
                                    width={200}
                                    height={200}
                                    className="object-cover"
                                />
                            </div>
                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full text-white">
                                <Camera className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-16 p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="profile-field space-y-2">
                                <label className="text-sm font-semibold text-zinc-500 ml-1 flex items-center gap-2">
                                    <User className="size-4" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={adminData.name}
                                    readOnly
                                    className="w-full h-14 px-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none text-zinc-900 font-medium"
                                />
                            </div>

                            <div className="profile-field space-y-2">
                                <label className="text-sm font-semibold text-zinc-500 ml-1 flex items-center gap-2">
                                    <Mail className="size-4" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={adminData.email}
                                    readOnly
                                    className="w-full h-14 px-4 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none text-zinc-900 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="profile-field space-y-2">
                                <label className="text-sm font-semibold text-zinc-500 ml-1 flex items-center gap-2">
                                    <Shield className="size-4" /> Account Role
                                </label>
                                <div className="w-full h-14 px-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center text-zinc-900 font-bold">
                                    <span className="px-3 py-1 bg-black text-white text-xs rounded-full uppercase tracking-wider">
                                        {adminData.role}
                                    </span>
                                </div>
                            </div>

                            <div className="profile-field space-y-2">
                                <label className="text-sm font-semibold text-zinc-500 ml-1">Account Permissions</label>
                                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <div className="size-1.5 rounded-full bg-green-500" /> Full System Access
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <div className="size-1.5 rounded-full bg-green-500" /> Manage Products & Orders
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                                        <div className="size-1.5 rounded-full bg-green-500" /> User Management
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="profile-field mt-12 pt-8 border-t border-zinc-100 flex justify-end">
                        <Button className="h-14 px-8 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold gap-2">
                            <Save className="size-5" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
