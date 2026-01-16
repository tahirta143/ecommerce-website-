"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogIn, Lock, User } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".login-card",
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1 }
        )
            .fromTo(".login-field",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, stagger: 0.1, duration: 0.6 },
                "-=0.5"
            )
            .fromTo(".login-button",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            );
    }, { scope: containerRef });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Mock login delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock credentials
        if (email === "admin@gmail.com" && password === "admin123") {
            localStorage.setItem("admin_auth", "true");
            router.push("/admin");
        } else {
            setError("Invalid credentials. Try admin@gmail.com / admin123");
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 login-card">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
                        <div className="size-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-xl">
                            L
                        </div>
                        <span className="text-2xl font-bold tracking-tight">LuxeMarket</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
                    <p className="text-zinc-500 mt-2">Sign in to manage your store</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 login-card">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 login-field">
                            <label className="text-sm font-semibold text-zinc-700 ml-1">Email Address</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="admin@luxemarket.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 login-field">
                            <label className="text-sm font-semibold text-zinc-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="login-button">
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 text-lg font-bold shadow-lg shadow-black/20"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : (
                                    <span className="flex items-center gap-2">
                                        Sign In <LogIn className="size-5" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-8 text-sm text-zinc-500 login-card">
                    <p>Protected by LuxeMarket Admin Security</p>
                </div>
            </div>
        </div>
    );
}
