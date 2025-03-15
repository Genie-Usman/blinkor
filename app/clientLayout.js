"use client";

import { useEffect, useMemo } from "react";
import { CartProvider } from "./context/CartContext";
import { FilterProvider } from "./context/FilterContext";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Head from "next/head";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdminDashboard = pathname.startsWith("/adminDashboard")

  const title = useMemo(() => {
    const titles = {
      "/login": "Blinkor - Login",
      "/signup": "Blinkor - Sign up",
      "/forgot-password": "Blinkor - Forgot Password",
      "/reset-password": "Blinkor - Reset Password",
      "/checkout": "Blinkor - Checkout",
      "/order": "Blinkor - Your Order is Confirmed",
      "/myorders": "Blinkor - My Orders",
      "/myaccount": "Blinkor - My Account",
      "/minionscollection": "Blinkor - Minions Collection",
      "/allproducts": "Blinkor - Hot Deals: You Can't Miss",
      "/tshirts": "Blinkor - T-Shirts",
      "/hoodies": "Blinkor - Hoodies",
      "/caps": "Blinkor - Caps",
      "/mugs": "Blinkor - Mugs",
      "/adminDashboard": "Blinkor - Admin",
      "/adminDashboard/add-products": "Blinkor - Add Products",
      "/adminDashboard/update-products": "Blinkor - Update Products",
      "/adminDashboard/view-products": "Blinkor - Product Inventory",
      "/adminDashboard/all-orders": "Blinkor - All Orders",
      "/adminDashboard": "Blinkor - Admin",
      "/admin-login": "Blinkor - Login as an Admin",
      "/admin-registration": "Blinkor - Register as an Admin",
    };
    return titles[pathname] || "Blinkor - Drip. Blink. Style";
  }, [pathname]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <CartProvider>
        <FilterProvider>
          {!isAdminDashboard && <Navbar />}
          <Toaster position="top-right" reverseOrder={false} />
          {children}
          {!isAdminDashboard && <Footer />}
        </FilterProvider>
      </CartProvider>
    </>
  );
}
