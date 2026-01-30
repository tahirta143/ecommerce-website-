"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
        const body = isSignUp ? formData : { email: formData.email, password: formData.password };

        try {
            const response = await fetch(`https://backend-with-node-js-ueii.onrender.com${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Action failed");
            }

            // Store authentication data
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Redirect to appropriate page
            const redirectPath = data.redirectTo || "/";
            router.push(redirectPath);

        } catch (error) {
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10 bg-card/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{isSignUp ? "Create Account" : "Welcome Back"}</h1>
                    <p className="text-muted-foreground">
                        {isSignUp ? "Join us and start your journey" : "Sign in to your account to continue"}
                    </p>
                    {!isSignUp && <p className="text-xs text-primary mt-2">Mock: test@example.com / password123</p>}
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}

                    {isSignUp && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                        >
                            <label className="text-sm font-medium ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            />
                        </motion.div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="hello@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between ml-1">
                            <label className="text-sm font-medium">Password</label>
                            {!isSignUp && <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>}
                        </div>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full text-lg rounded-xl h-12"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (isSignUp ? "Creating..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" type="button" className="rounded-xl">Google</Button>
                        <Button variant="outline" type="button" className="rounded-xl">GitHub</Button>
                    </div>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary font-bold hover:underline ml-1"
                    >
                        {isSignUp ? "Sign In" : "Sign up"}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}