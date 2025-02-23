"use client";

import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
  return (
    <CartProvider>
      <FilterProvider> {/* Wrap with FilterProvider */}
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </FilterProvider>
    </CartProvider>
  );
}