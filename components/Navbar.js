"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import { CiShoppingCart, CiUser, CiLogin } from "react-icons/ci";
import SideCart from "./SideCart";
import { useCart } from "../app/context/CartContext";
import { useAuth } from "../app/context/AuthContext";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
    { name: "Tshirts", href: "/tshirts" },
    { name: "Hoodies", href: "/hoodies" },
    { name: "Caps", href: "/caps" },
    { name: "Mugs", href: "/mugs" },
];

const Navbar = () => {
    const { itemCount } = useCart();
    const { user, logout } = useAuth();
    const dropdownRef = useRef(null);
    const mobileNavRef = useRef(null);
    const pathname = usePathname();

    const [cartOpen, setCartOpen] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActiveLink = (href) => pathname === href;

    useEffect(() => {
        setDropdown(false);
        setMobileMenuOpen(false);
    }, [pathname]);

   useEffect(() => {
    const handleClickOutside = (event) => {
        // Close dropdown if open and click is outside
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdown(false);
        }

        // Close mobile nav if open and click is outside
        if (
            mobileNavRef.current &&
            !mobileNavRef.current.contains(event.target)
        ) {
            setMobileMenuOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
    };
}, [mobileMenuOpen, dropdownRef]); // Add dependencies


    const toggleCart = () => setCartOpen((prev) => !prev);
    const toggleDropdown = () => setDropdown((prev) => !prev);
    const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

    const DesktopNav = () => (
        <nav className="hidden md:flex space-x-6 text-lg font-bold">
            {navLinks.map((link) => (
                <CustomLink
                    key={link.href}
                    href={link.href}
                    className={`relative transition-all duration-300 ease-in-out group ${isActiveLink(link.href)
                            ? "text-devstyle"
                            : "text-gray-700 hover:text-devstyle"
                        }`}
                >
                    {link.name}
                    <span
                        className={`absolute left-0 bottom-0 h-0.5 ${isActiveLink(link.href)
                                ? "w-full bg-devstyle"
                                : "w-0 bg-devstyle"
                            } transition-all duration-300 ease-in-out group-hover:w-full`}
                    ></span>
                </CustomLink>
            ))}
        </nav>
    );

    const MobileNav = () => (
        mobileMenuOpen && (
            <div ref={mobileNavRef} className="md:hidden absolute top-14 left-0 w-full bg-[#eeeae6] shadow-md py-3 z-40">
                <nav className="flex flex-col items-center space-y-3 text-lg font-bold">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-700 hover:text-devstyle transition-all duration-300"
                            onClick={toggleMobileMenu}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        )
    );

    return (
        <header className="text-gray-600 body-font bg-[#eeeae6] fixed top-0 left-0 w-full z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <CustomLink href="/">
                        <Image
                            className="w-32 md:w-48"
                            src="/Blinkor.png"
                            alt="logo"
                            width={200}
                            height={50}
                            priority
                        />
                    </CustomLink>
                </div>

                {/* Desktop Navigation */}
                <DesktopNav />

                {/* Icons Section */}
                <div className="flex items-center space-x-5">
                    {/* User Dropdown or Login */}
                    {user?.value ? (
                        <div ref={dropdownRef} className="relative">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ rotate: 10, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CiUser
                                    onClick={toggleDropdown}
                                    className="text-2xl text-gray-700 hover:text-devstyle cursor-pointer transition-colors duration-300"
                                />
                            </motion.div>
                            {dropdown && (
                                <div className="absolute right-0 mt-3 py-4 px-3 bg-[#BCB8B1] text-sm rounded shadow-lg w-40">
                                    <ul className="flex flex-col text-left">
                                        <li className="p-2 hover:text-gray-800 cursor-pointer">
                                            <CustomLink href="/myaccount">My Account</CustomLink>
                                        </li>
                                        <li className="p-2 hover:text-gray-800 cursor-pointer">
                                            <CustomLink href="/myorders">Orders</CustomLink>
                                        </li>
                                        <li
                                            className="p-2 text-red-600 hover:text-red-900 cursor-pointer"
                                            onClick={logout}
                                        >
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <CustomLink href="/login">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9, rotate: -5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                className="cursor-pointer"
                            >
                                <CiLogin className="text-2xl text-gray-700 hover:text-devstyle" />
                            </motion.div>
                        </CustomLink>
                    )}

                    {/* Cart Icon */}
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative cursor-pointer"
                        onClick={toggleCart}
                    >
                        <CiShoppingCart className="text-gray-700 text-3xl hover:text-devstyle transition-all duration-200" />
                        {Number(itemCount) > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20,
                                    mass: 1,
                                }}
                                className="absolute top-[-6px] right-[-7px] transform translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white text-[8px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded-full"
                            >
                                {itemCount}
                            </motion.span>
                        )}
                    </motion.div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="text-2xl text-gray-700">
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Side Cart */}
            <SideCart cartOpen={cartOpen} toggleCart={toggleCart} />
        </header>
    );
};

export default Navbar;
