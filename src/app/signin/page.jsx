// "use client";

// import { Button } from "@/components/ui/Button";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignIn() {
//     const router = useRouter();
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setIsLoading(true);

//         // Mock delay for realism
//         await new Promise(resolve => setTimeout(resolve, 800));

//         if (email === "test@gmail.com" && password === "123") {
//             router.push("/");
//         } else {
//             setError("Invalid email or password");
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
//             <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="w-full max-w-md relative z-10 bg-card/50 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
//             >
//                 <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
//                     <p className="text-muted-foreground">Sign in to your account to continue</p>
//                     <p className="text-xs text-primary mt-2">Mock: test@example.com / password123</p>
//                 </div>

//                 <form className="space-y-6" onSubmit={handleSubmit}>
//                     {error && (
//                         <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
//                             {error}
//                         </div>
//                     )}
//                     <div className="space-y-2">
//                         <label className="text-sm font-medium ml-1">Email</label>
//                         <input
//                             type="email"
//                             placeholder="hello@example.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <div className="flex justify-between ml-1">
//                             <label className="text-sm font-medium">Password</label>
//                             <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
//                         </div>
//                         <input
//                             type="password"
//                             placeholder="••••••••"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
//                         />
//                     </div>

//                     <Button
//                         size="lg"
//                         className="w-full text-lg rounded-xl h-12"
//                         type="submit"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? "Signing In..." : "Sign In"}
//                     </Button>

//                     <div className="relative">
//                         <div className="absolute inset-0 flex items-center">
//                             <div className="w-full border-t border-border"></div>
//                         </div>
//                         <div className="relative flex justify-center text-xs uppercase">
//                             <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <Button variant="outline" type="button" className="rounded-xl">Google</Button>
//                         <Button variant="outline" type="button" className="rounded-xl">GitHub</Button>
//                     </div>
//                 </form>

//                 <p className="text-center mt-8 text-sm text-muted-foreground">
//                     Don&apos;t have an account? <Link href="#" className="text-primary font-bold hover:underline">Sign up</Link>
//                 </p>
//             </motion.div>
//         </div>
//     );
// }
"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // 🔐 REAL LOGIN with your backend API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("https://backend-with-node-js-ueii.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Save token to localStorage/sessionStorage
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("user", JSON.stringify(data.user || {}));
                
                // Redirect to dashboard/home
                router.push("/");
            } else {
                setError(data.message || "Invalid email or password");
            }
        } catch (err) {
            setError("Network error. Please try again.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 🔵 GOOGLE OAUTH - Redirect method
    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        
        // Save current page to return after login
        sessionStorage.setItem("redirectUrl", window.location.pathname);
        
        // Redirect to Google OAuth endpoint
        window.location.href = "https://backend-with-node-js-ueii.onrender.com/api/auth/google";
    };

    // 🔵 GITHUB OAUTH (placeholder - implement when ready)
    const handleGitHubLogin = () => {
        alert("GitHub login will be implemented soon!");
        // window.location.href = "https://backend-with-node-js-ueii.onrender.com/api/auth/github";
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
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account to continue</p>
                    <p className="text-xs text-primary mt-2">
                        API: https://backend-with-node-js-ueii.onrender.com
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email</label>
                        <input
                            type="email"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-12 px-4 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between ml-1">
                            <label className="text-sm font-medium">Password</label>
                            <Link href="#" className="text-xs text-primary hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            type="button"
                            className="rounded-xl flex items-center justify-center gap-2"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading}
                        >
                            {/* Google SVG Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            {isGoogleLoading ? "Redirecting..." : "Google"}
                        </Button>
                        
                        <Button
                            variant="outline"
                            type="button"
                            className="rounded-xl flex items-center justify-center gap-2"
                            onClick={handleGitHubLogin}
                        >
                            {/* GitHub SVG Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </form>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link 
                        href="/signup" 
                        className="text-primary font-bold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
