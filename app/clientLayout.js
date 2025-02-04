"use client";

import { CartProvider } from './context/CartContext';

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}