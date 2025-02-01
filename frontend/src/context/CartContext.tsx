import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    sku: string;
    size: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, removeAll?: boolean) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([
        {
            id: '1',
            name: 'Тренч из натуральной кожи',
            sku: '432432543',
            size: '48',
            image: '/images/coat3.jpg',
            price: 1000,
            quantity: 1,
        },
        {
            id: '2',
            name: 'Шампунь для волос',
            sku: '678678123',
            size: '52',
            image: '/images/coat4.jpg',
            price: 599,
            quantity: 2,
        },
    ]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            const existingItem = prev.find((i) => i.id === item.id);
            if (existingItem) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (id: string, removeAll?: boolean) => {
        setItems((prev) => {
            if (removeAll) {
                return prev.filter((i) => i.id !== id);
            } else {
                const existingItem = prev.find((i) => i.id === id);
                if (existingItem && existingItem.quantity > 1) {
                    return prev.map((i) =>
                        i.id === id ? { ...i, quantity: i.quantity - 1 } : i
                    );
                }
                return prev.filter((i) => i.id !== id);
            }
        });
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
