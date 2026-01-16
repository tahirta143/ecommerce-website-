"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignIn() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10 bg-card/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account to continue</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between ml-1">
                            <label className="text-sm font-medium">Password</label>
                            <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>

                    <Button size="lg" className="w-full text-lg rounded-xl h-12">Sign In</Button>

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
                    Don&apos;t have an account? <Link href="#" className="text-primary font-bold hover:underline">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
}
