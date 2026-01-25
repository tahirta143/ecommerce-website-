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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState("bank");
    const [paymentDetails, setPaymentDetails] = useState({
        senderName: "",
        transactionId: "",
        senderNumber: "",
        accountNumber: ""
    });

    const handleCheckoutInit = () => {
        if (cartItems.length > 0) {
            setIsCheckoutOpen(true);
        }
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        // Here you would typically validate the transaction ID with a backend
        setIsCheckoutOpen(false);
        setShowReceipt(true);
    };

    const closeReceipt = () => {
        setShowReceipt(false);
        clearCart();
        setPaymentDetails({ senderName: "", transactionId: "", senderNumber: "", accountNumber: "" });
    };

    const paymentMethods = [
        { id: "bank", name: "Bank Transfer", icon: "🏦", color: "bg-blue-50 text-blue-600 border-blue-100" },
        { id: "easypaisa", name: "Easypaisa", icon: "📱", color: "bg-green-50 text-green-600 border-green-100" },
        { id: "jazzcash", name: "JazzCash", icon: "🔴", color: "bg-red-50 text-red-600 border-red-100" },
    ];

    const getAccountDetails = () => {
        switch (selectedMethod) {
            case "bank":
                return {
                    title: "Bank Al Habib",
                    account: "1234 5678 9012 3456",
                    name: "LuxeMarket Pvt Ltd"
                };
            case "easypaisa":
                return {
                    title: "Easypaisa Account",
                    account: "0300 1234567",
                    name: "LuxeMarket Merchant"
                };
            case "jazzcash":
                return {
                    title: "JazzCash Account",
                    account: "0300 9876543",
                    name: "LuxeMarket Merchant"
                };
            default:
                return {};
        }
    };

    if (cartItems.length === 0 && !showReceipt && !isCheckoutOpen) {
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

            {/* Payment Modal */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
                        >
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 transition-colors z-10"
                            >
                                <X className="size-6 text-zinc-500" />
                            </button>

                            <div className="p-6 md:p-8 border-b shrink-0">
                                <h2 className="text-xl md:text-2xl font-black">Select Payment Method</h2>
                                <p className="text-sm md:text-base text-zinc-500">Choose how you want to pay</p>
                            </div>

                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                                {/* Methods Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                                    {paymentMethods.map((method) => (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedMethod === method.id
                                                ? "border-black bg-zinc-50"
                                                : "border-zinc-100 hover:border-zinc-200 hover:bg-white"
                                                }`}
                                        >
                                            <div className={`size-10 rounded-full flex items-center justify-center text-xl ${method.color} bg-opacity-20`}>
                                                {method.icon}
                                            </div>
                                            <span className={`font-bold text-sm ${selectedMethod === method.id ? "text-black" : "text-zinc-500"}`}>
                                                {method.name}
                                            </span>
                                            {selectedMethod === method.id && (
                                                <div className="bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Selected</div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                {/* Account Details Card */}
                                <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-100 mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Send Money To</p>
                                            <h3 className="text-lg font-black text-zinc-900">{getAccountDetails().title}</h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Amount</p>
                                            <h3 className="text-lg font-black text-primary">${totalPrice.toFixed(2)}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-white p-3 rounded-2xl border border-zinc-100 flex justify-between items-center text-sm">
                                            <span className="text-zinc-500 font-medium">Account Number</span>
                                            <span className="font-mono font-bold select-all">{getAccountDetails().account}</span>
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl border border-zinc-100 flex justify-between items-center text-sm">
                                            <span className="text-zinc-500 font-medium">Account Name</span>
                                            <span className="font-bold">{getAccountDetails().name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Inputs (Visual only, state handled in footer or shared) */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-base">Enter Transaction Details</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-zinc-700 ml-1">Sender Name</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                className="w-full h-10 rounded-xl border-zinc-200 focus:border-black focus:ring-0 text-sm"
                                                value={paymentDetails.senderName}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, senderName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-zinc-700 ml-1">
                                                {selectedMethod === 'bank' ? 'Sender Account No' : 'Sender Mobile No'}
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder={selectedMethod === 'bank' ? "e.g. 1234..." : "e.g. 0300..."}
                                                className="w-full h-10 rounded-xl border-zinc-200 focus:border-black focus:ring-0 text-sm"
                                                value={paymentDetails.accountNumber}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-bold text-zinc-700 ml-1">
                                                {selectedMethod === 'bank' ? 'Transaction ID' : 'TID / Trx ID'}
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="e.g. 82736182"
                                                className="w-full h-10 rounded-xl border-zinc-200 focus:border-black focus:ring-0 text-sm"
                                                value={paymentDetails.transactionId}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fixed Footer */}
                            <div className="p-6 md:p-8 border-t bg-white shrink-0">
                                <Button
                                    onClick={handleConfirmPayment}
                                    disabled={!paymentDetails.senderName || !paymentDetails.transactionId || !paymentDetails.accountNumber}
                                    className="w-full h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 text-lg font-bold shadow-xl active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Verify & Confirm Payment
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Receipt Modal (Existing) */}
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
