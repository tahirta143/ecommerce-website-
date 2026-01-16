"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        if (typeof window !== "undefined") {
            const savedCart = localStorage.getItem("cart");
            return savedCart ? JSON.parse(savedCart) : [];
        }
        return [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save cart to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true); // Optional: open cart drawer or show toast
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCartItems((prev) =>
            prev.map((item) => {
                if (item.id === productId) {
                    return { ...item, quantity: Math.max(1, item.quantity + delta) };
                }
                return item;
            })
        );
    };

    const clearCart = () => setCartItems([]);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
