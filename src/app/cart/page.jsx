"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
    const [showReceipt, setShowReceipt] = useState(false);

    const handleCheckoutInit = () => {
        if (cartItems.length > 0) {
            setShowReceipt(true);
        }
    };

    const handleWhatsAppOrder = () => {
        let message = "Hi, I would like to place an order:\n\n";

        cartItems.forEach(item => {
            message += `- ${item.name} (x${item.quantity}): $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        message += `\nTotal Amount: $${totalPrice.toFixed(2)}`;
        message += `\n\nPlease confirm my order.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/923254828492?text=${encodedMessage}`, '_blank');

        // Optional: clear cart after ordering? keeping it for now in case user comes back
        // clearCart(); 
        // setShowReceipt(false);
    };

    const closeReceipt = () => {
        setShowReceipt(false);
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
                            onClick={handleCheckoutInit}
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
                            className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
                        >
                            <button
                                onClick={closeReceipt}
                                className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors z-10"
                            >
                                <X className="size-5" />
                            </button>

                            <div className="p-8 pb-4 border-b border-zinc-100 bg-zinc-50/50">
                                <div className="text-center">
                                    <h2 className="text-2xl font-black text-zinc-900">Bill Receipt</h2>
                                    <p className="text-zinc-500 text-sm font-medium mt-1">Review your order details</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                                {cartItems.map((item, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (i * 0.05) }}
                                        key={item.id}
                                        className="flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-100"
                                    >
                                        <div className="size-14 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200">
                                            <Image src={item.image} alt={item.name} width={64} height={64} className="object-cover w-full h-full" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-zinc-900 text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-zinc-400 font-bold">{item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <div className="font-black text-zinc-900 text-sm">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </motion.div>
                                ))}

                                <div className="pt-4 border-t border-dashed border-zinc-200 space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500 font-medium">Subtotal</span>
                                        <span className="font-bold text-zinc-900">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-500 font-medium">Shipping</span>
                                        <span className="font-bold text-green-600">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl mt-4 pt-4 border-t border-zinc-100">
                                        <span className="font-black text-zinc-900">Total</span>
                                        <span className="font-black text-black">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={closeReceipt}
                                    className="flex-1 h-14 rounded-2xl text-base font-bold bg-white hover:bg-zinc-100 border-zinc-200"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleWhatsAppOrder}
                                    className="flex-[2] h-14 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white text-base font-bold shadow-lg shadow-green-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-5 fill-current stroke-none"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Order WhatsApp
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
