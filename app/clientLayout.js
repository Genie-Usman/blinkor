"use client";

import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <ToastContainer />
      {children}
    </CartProvider>
  );
}