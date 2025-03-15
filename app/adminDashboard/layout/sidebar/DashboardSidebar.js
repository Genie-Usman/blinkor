"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Home, PlusCircle, Pencil, Eye, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation"

const menuItems = [
  { id: 1, title: "Dashboard", icon: <Home size={20} />, href: "/adminDashboard" },
  { id: 2, title: "Add Products", icon: <PlusCircle size={20} />, href: "/adminDashboard/add-products" },
  { id: 3, title: "Update Products", icon: <Pencil size={20} />, href: "/adminDashboard/update-products" },
  { id: 4, title: "View Products", icon: <Eye size={20} />, href: "/adminDashboard/view-products" },
  { id: 5, title: "Orders", icon: <ShoppingCart size={20} />, href: "/adminDashboard/all-orders" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isSidebarOpen) setIsSidebarOpen(false);
        if (isMobileOpen) setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isMobileOpen]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false)
    } else {
      setIsSidebarOpen(false)
    }
  };

  const isActiveLink = (href) => {
    return router.pathname === href;
  };

  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "4rem" },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const mobileSidebarVariants = {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isMobileOpen && (
        <motion.button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 lg:hidden p-2 rounded-lg bg-white/80 backdrop-blur-md shadow-sm hover:bg-white z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </motion.button>
      )}

      {/* Desktop Sidebar */}
      <motion.div
        ref={sidebarRef}
        className="hidden lg:block z-[500] fixed top-0 left-0 h-screen bg-[#eeeae6] backdrop-blur-md shadow-lg"
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
                  priority={true}
                  loading="eager"
                />
              </motion.div>
            )}
            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200/50"
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
                  className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100/50 transition-colors duration-200 ${
                    isActiveLink(item.href)
                      ? "bg-blue-50/50 text-blue-600 font-semibold"
                      : "text-gray-700"
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.icon}
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Footer (Optional) */}
          {isSidebarOpen && (
            <motion.div
              className="mt-auto pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-500">© 2023 Blinkor</p>
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
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar Content */}
            <motion.div
              className="fixed top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-md shadow-lg p-4 z-50"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileSidebarVariants}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between">
                <Image
                  className="w-32"
                  src="/Blinkor.png"
                  alt="logo"
                  width={200}
                  height={50}
                  priority={true}
                  loading="eager"
                />
                <motion.button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-200/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>

              {/* Divider */}
              <motion.div
                className="w-full h-px bg-gray-900 my-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <nav className="mt-6 space-y-2">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100/50 transition-colors duration-200 text-gray-700`}
                      onClick={handleLinkClick}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <motion.div
                className="mt-auto pt-4 border-t border-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-gray-500">© 2025 Blinkor</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;