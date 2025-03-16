"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Home, PlusCircle, Pencil, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const pathname = usePathname(); // Get active route

  // Menu items with proper icon sizing
  const menuItems = [
    { id: 1, title: "Dashboard", icon: Home, href: "/adminDashboard" },
    { id: 2, title: "Add Products", icon: PlusCircle, href: "/adminDashboard/add-products" },
    { id: 3, title: "Update Products", icon: Pencil, href: "/adminDashboard/update-products" },
    { id: 4, title: "View Products", icon: Eye, href: "/adminDashboard/view-products" },
    { id: 5, title: "Orders", icon: ShoppingCart, href: "/adminDashboard/all-orders" },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle link click (close sidebar on mobile)
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) setIsMobileOpen(false);
  };

  // Check if a link is active
  const isActiveLink = (href) => pathname === href;

  // Sidebar animation variants
  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "4rem" },
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isMobileOpen && (
        <motion.button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-md shadow-sm hover:bg-white z-50 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}

      {/* Desktop Sidebar */}
      <motion.div
        ref={sidebarRef}
        className="hidden lg:flex flex-col z-[500] fixed top-0 left-0 h-screen bg-[#eeeae6] backdrop-blur-md shadow-lg"
        initial={isSidebarOpen ? "open" : "closed"}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-full flex flex-col p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {isSidebarOpen && (
              <motion.div
                className="font-bold text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Image
                  className="w-32"
                  src="/Blinkor.png"
                  alt="logo"
                  width={200}
                  height={50}
                  priority
                />
              </motion.div>
            )}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-lg hover:bg-gray-200/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>

          {/* Divider */}
          {isSidebarOpen && (
            <motion.div
              className="w-full h-px bg-gray-200 my-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          )}

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-100/50 transition-colors duration-200 ${
                    isActiveLink(item.href)
                      ? "bg-gray-300 text-gray-900 font-semibold"
                      : "text-gray-700"
                  } ${isSidebarOpen ? "space-x-3 pl-2" : "justify-center"}`}
                  onClick={handleLinkClick}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isSidebarOpen && <span>{item.title}</span>}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer */}
          {isSidebarOpen && (
            <motion.div
              className="mt-auto pt-4 border-t border-gray-200 w-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-500">© 2025 Blinkor</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar Content */}
            <motion.div
              className="fixed top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-md shadow-lg p-4 z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <Image
                  className="w-32"
                  src="/Blinkor.png"
                  alt="logo"
                  width={200}
                  height={50}
                  priority
                />
                <motion.button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200/50 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gray-900 my-2" />
              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100/50 text-gray-700"
                    onClick={handleLinkClick}
                  >
                    <item.icon size={24} />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;