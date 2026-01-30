"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LogIn, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminSignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const containerRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(".signup-card",
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1 }
        )
            .fromTo(".signup-field",
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, stagger: 0.1, duration: 0.6 },
                "-=0.5"
            )
            .fromTo(".signup-button",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6 },
                "-=0.4"
            );
    }, { scope: containerRef });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("https://backend-with-node-js-ueii.onrender.com/api/admin/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Successfully registered, redirect to login page
            router.push("/admin/login");
        } catch (error) {
            setError(error.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 signup-card">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
                        <div className="size-10 rounded-xl bg-black flex items-center justify-center text-white font-bold text-xl shadow-xl">
                            L
                        </div>
                        <span className="text-2xl font-bold tracking-tight">LuxeMarket</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-zinc-900">Create Admin Account</h1>
                    <p className="text-zinc-500 mt-2">Join the administrative team</p>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-zinc-100 signup-card">
                    <form onSubmit={handleSignUp} className="space-y-5">
                        <div className="space-y-2 signup-field">
                            <label className="text-sm font-semibold text-zinc-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 signup-field">
                            <label className="text-sm font-semibold text-zinc-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="admin@luxemarket.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 signup-field">
                            <label className="text-sm font-semibold text-zinc-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full h-14 pl-12 pr-12 rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-black focus:ring-0 outline-none transition-all placeholder:text-zinc-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="signup-button pt-2">
                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 text-lg font-bold shadow-lg shadow-black/20"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating account..." : (
                                    <span className="flex items-center gap-2">
                                        Create Account <LogIn className="size-5" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <p className="text-center mt-6 text-sm text-zinc-500 signup-field">
                        Already have an account?{" "}
                        <Link href="/admin/login" className="text-black font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                <div className="text-center mt-8 text-sm text-zinc-500 signup-card">
                    <p>Protected by LuxeMarket Admin Security</p>
                </div>
            </div>
        </div>
    );
}
