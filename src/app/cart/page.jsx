"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckCircle2, Package, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const [showReceipt, setShowReceipt] = useState(false);

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            setShowReceipt(true);
        }
    };

    const closeReceipt = () => {
        setShowReceipt(false);
        clearCart();
    };

    if (cartItems.length === 0 && !showReceipt) {
        return (
            <div className="container mx-auto px-4 py-24 text-center space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400"
                >
                    <ShoppingBag className="size-10" />
                </motion.div>
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <p className="text-zinc-500 font-medium">Looks like you haven&apos;t added anything yet.</p>
                <Link href="/shop">
                    <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-zinc-800 border-none transition-all active:scale-95">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 relative min-h-[60vh]">
            <h1 className="text-4xl font-black mb-12 flex items-center gap-4 tracking-tight">
                Shopping Cart <span className="text-xl font-medium text-zinc-400">({cartItems.length})</span>
            </h1>

            <div className="grid lg:grid-cols-3 gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                className="flex gap-6 p-6 rounded-[2.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-md transition-shadow relative group"
                            >
                                <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-zinc-50 shrink-0 border border-zinc-100 shadow-inner">
                                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-xl text-zinc-900 leading-tight">{item.name}</h3>
                                            <p className="font-black text-xl text-black">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4 bg-zinc-50 rounded-2xl p-1.5 border border-zinc-100">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="size-8 flex items-center justify-center bg-white shadow-sm hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"><Minus className="size-4" /></button>
                                            <span className="text-lg font-bold w-6 text-center text-zinc-900">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="size-8 flex items-center justify-center bg-white shadow-sm hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"><Plus className="size-4" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-red-500 p-2 rounded-xl transition-all flex items-center gap-1 text-sm font-bold group/del">
                                            <Trash2 className="size-4 group-hover/del:scale-110 transition-transform" />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 p-10 rounded-[3rem] border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/50 space-y-8">
                        <h2 className="text-2xl font-black text-zinc-900">Order Summary</h2>
                        <div className="space-y-5">
                            <div className="flex justify-between text-zinc-500 font-medium">
                                <span>Subtotal</span>
                                <span className="text-zinc-900 font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-green-600 font-bold uppercase text-xs tracking-widest">Free</span>
                            </div>
                            <div className="flex justify-between text-zinc-500 font-medium">
                                <span>Estimated Tax</span>
                                <span className="text-zinc-900 font-bold">$0.00</span>
                            </div>
                            <div className="h-px bg-zinc-100 my-4" />
                            <div className="flex justify-between items-end">
                                <span className="text-zinc-900 font-bold">Total Amount</span>
                                <span className="font-black text-3xl text-black tracking-tighter">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            onClick={handleCheckout}
                            className="w-full text-lg h-16 rounded-[1.5rem] bg-black text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <ArrowRight className="size-5" />
                        </Button>
                        <div className="flex items-center justify-center gap-3 text-sm font-bold text-zinc-400">
                            <span className="size-5 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                            </span>
                            Secure Payment SSL
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            <AnimatePresence>
                {showReceipt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={closeReceipt}
                                className="absolute top-8 right-8 size-12 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors z-10"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="p-12">
                                <div className="text-center mb-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                        className="size-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                                    >
                                        <CheckCircle2 className="size-10" />
                                    </motion.div>
                                    <h2 className="text-3xl font-black text-zinc-900 mb-2">Order Confirmed!</h2>
                                    <p className="text-zinc-500 font-medium">Thank you for your purchase. Your receipt is below.</p>
                                </div>

                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + (i * 0.1) }}
                                            key={item.id}
                                            className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100"
                                        >
                                            <div className="size-16 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200">
                                                <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-zinc-900">{item.name}</h4>
                                                <p className="text-sm text-zinc-400 font-bold">{item.quantity} × ${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="font-black text-zinc-900">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-dashed border-zinc-200">
                                    <div className="flex justify-between items-center mb-8">
                                        <span className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Total Amount Paid</span>
                                        <span className="text-4xl font-black text-black tracking-tighter">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <Button
                                        onClick={closeReceipt}
                                        className="w-full h-16 rounded-2xl bg-black text-white hover:bg-zinc-800 text-lg font-bold shadow-xl shadow-black/10 active:scale-95 transition-all"
                                    >
                                        Done, Continue Shopping
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
