"use client";

import { useEffect } from "react";
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext';
import { Toaster } from 'react-hot-toast';
import { usePathname } from "next/navigation";
import Head from "next/head";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const getTitle = (path) => {
    switch (path) {
      case "/login":
        return "Blinkor - Login";
      case "/signup":
        return "Blinkor - Sign up";
      case "/forgot-password":
        return "Blinkor - Forgot Password";
      case "/reset-password":
        return "Blinkor - Reset Password";
      case "/checkout":
        return "Blinkor - Checkout";
      case "/order":
        return "Blinkor - Your Order is Confirmed";
      case "/myorders":
        return "Blinkor - My Orders";
      case "/myaccount":
        return "Blinkor - My Account";
      case "/minionscollection":
        return "Blinkor - Minions Collection";
      case "/allproducts":
        return "Blinkor - Hot Deals: You Can't Miss";
      case "/tshirts":
        return "Blinkor - T-Shirts";
      case "/hoodies":
        return "Blinkor - Hoodies";
      case "/caps":
        return "Blinkor - Caps";
      case "/mugs":
        return "Blinkor - Mugs";
      default:
        return "Blinkor - Drip.Blink.Style";
    }
  };

  useEffect(() => {
    document.title = getTitle(pathname);
  }, [pathname]);


  return (
    <>
      <Head>
        <title>{getTitle(pathname)}</title>
      </Head>
      <CartProvider>
        <FilterProvider>
          <Toaster position="top-right" reverseOrder={false}/>
          {children}
        </FilterProvider>
      </CartProvider>
    </>
  );
}