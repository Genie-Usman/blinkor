"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, CreditCard, Shield, Mail, Menu, Bell, Search } from "lucide-react";
import Link from "next/link";

const Header = ({ toggleMobileSidebar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New order received", read: false },
    { id: 2, text: "Payment successful", read: false },
    { id: 3, text: "New message from Julia", read: false },
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    // Add your search logic here
    console.log("Searching for:", e.target.value)
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profileOptions = [
    {
      href: "/",
      title: "My Profile",
      subtitle: "Account Settings",
      icon: <Mail size={18} />,
    },
    {
      href: "/",
      title: "My Inbox",
      subtitle: "Messages & Emails",
      icon: <Shield size={18} />,
    },
    {
      href: "/",
      title: "My Tasks",
      subtitle: "To-do and Daily Tasks",
      icon: <CreditCard size={18} />,
    },
  ];

  return (
    <header className="sticky top-0 bg-[#eeeae6] shadow-lg z-50 border-gray-100">
      <nav className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
          aria-label="Open Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center flex-grow mx-6 md:ml-20">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition relative"
            >
              <Bell size={20} />
              {notifications.some((notification) => !notification.read) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#eeeae6] shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <ul className="py-2">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        onClick={() => markNotificationAsRead(notification.id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center gap-3"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            !notification.read ? "bg-indigo-500" : "bg-transparent"
                          }`}
                        ></span>
                        <p className="text-sm">{notification.text}</p>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-100 p-2">
                  <button
                    onClick={clearNotifications}
                    className="w-full py-2 text-center text-sm text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="relative" ref={menuRef}>
            {/* Profile Button */}
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition"
            >
              <Image
                src="/user.jpg"
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:flex items-center">
                <span className="text-gray-600">Hi,</span>
                <span className="font-semibold ml-1">Admin</span>
                <ChevronDown size={18} className="ml-1 text-gray-500" />
              </span>
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#eeeae6] shadow-lg rounded-lg overflow-hidden z-50 border border-gray-100">
                <ul className="py-2">
                  {profileOptions.map((option, index) => (
                    <li key={index}>
                      <Link
                        href={option.href}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition"
                      >
                        {option.icon}
                        <div>
                          <p className="text-sm font-medium">{option.title}</p>
                          <p className="text-xs text-gray-500">{option.subtitle}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-100 p-2">
                  <button className="w-full py-2 text-center text-red-600 rounded-md hover:bg-red-100 transition">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;