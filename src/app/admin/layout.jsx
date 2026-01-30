"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ClipboardList, ShoppingBag, PlusCircle, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AdminLayout({ children }) {
    const [adminData, setAdminData] = useState({
        isAuthenticated: false,
        isLoading: true,
        user: null
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem("admin_auth") === "true";
        const storedUser = localStorage.getItem("admin_user");
        let user = null;

        if (storedUser) {
            try {
                user = JSON.parse(storedUser);
            } catch (e) {
                console.error("Failed to parse admin user");
            }
        }

        setAdminData({
            isAuthenticated: auth,
            isLoading: false,
            user: user
        });

        if (!auth && pathname !== "/admin/login" && pathname !== "/admin/signup") {
            router.push("/admin/login");
        }
    }, [pathname, router]);

    if (adminData.isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    // If on login or signup page, just show children without the sidebar/layout
    if (pathname === "/admin/login" || pathname === "/admin/signup") return <>{children}</>;

    // If not authenticated, we're redirecting
    if (!adminData.isAuthenticated) return null;

    const handleLogout = () => {
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAdminData({ isAuthenticated: false, isLoading: false, user: null });
        router.push("/admin/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="size-5" /> },
        { name: "Orders", href: "/admin/orders", icon: <ClipboardList className="size-5" /> },
        { name: "All Products", href: "/admin/products", icon: <ShoppingBag className="size-5" /> },
        { name: "Add Product", href: "/admin/add-product", icon: <PlusCircle className="size-5" /> },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-8 border-b border-zinc-100">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-8 rounded-lg bg-black flex items-center justify-center text-white font-bold text-lg">
                                L
                            </div>
                            <span className="text-xl font-bold tracking-tight">Admin Portal</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-6 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-black text-white shadow-lg shadow-black/10"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-black"
                                    )}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-zinc-100">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="size-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 hover:bg-zinc-100 rounded-lg"
                    >
                        {isSidebarOpen ? <X /> : <Menu />}
                    </button>

                    <div className="flex-1 text-center lg:text-left mx-4 font-semibold text-zinc-900">
                        {navItems.find(item => item.href === pathname)?.name || "Admin"}
                    </div>

                    <Link href="/admin/profile" className="flex items-center gap-4 hover:bg-zinc-50 p-2 rounded-xl transition-colors">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold">{adminData.user?.name || "Admin User"}</div>
                            <div className="text-xs text-zinc-500">{adminData.user?.role || "Super Admin"}</div>
                        </div>
                        <div className="size-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
                                alt="Admin Avatar"
                                width={100}
                                height={100}
                            />
                        </div>
                    </Link>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
