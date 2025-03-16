"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const router = useRouter();
  const { adminLogin, admin } = useAuth()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin?.value) {
      router.push("/adminDashboard");
    }
  }, [admin, router]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        adminLogin(data.adminToken)

        toast.success("Login successful!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        });

        setFormData({ username: "", password: "" });
        setLoading(false);
        router.push("/adminDashboard");
      } else {
        toast.error(data.error || "Login failed!", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#000",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "bold",
            borderRadius: "8px",
            padding: "12px 20px",
          },
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        duration: 2000,
        position: "top-right",
        style: {
          background: "#000",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "12px 20px",
        },
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f2f0]">
      <div className="w-full max-w-md bg-white/50 p-8 shadow-lg md:mt-16">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            className="m-auto"
            src="/Blinkor.png"
            alt="Admin Portal"
            width={180}
            height={180}
          />
        </motion.div>
        <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              placeholder="Admin Username"
              required
            />
          </div>
          <div className="mt-4">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              placeholder="Admin Password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 transition-all duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                Logging in
                <Loader2 className="animate-spin w-5 h-5" />
              </>
            ) : (
              "Login as Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
