"use client";

import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </CartProvider>
  );
}