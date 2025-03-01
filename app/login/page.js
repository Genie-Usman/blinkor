"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { useCart } from "../context/CartContext";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";


const Login = () => {
  const { login } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/')
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required!", {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '12px 20px',
        },
      });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        login(data.token);
        toast.success("Login successful!", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '12px 20px',
          },
        });
        setFormData({ email: "", password: "" });
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(data.message || "Invalid credentials!", {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '12px 20px',
          },
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#000',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '12px 20px',
        },
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-16">
        <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                className="m-auto"
                src="/blinkor.png"
                alt="logo"
                width={500}
                height={250}
                style={{ width: "45%", height: "auto" }}
              />
            </motion.div>
        <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
          Welcome Back! <span className="text-gray-600">Continue Your Shopping</span>
        </h2>
        <div className="text-center text-gray-600 mt-1">
          New to us?
          <CustomLink href="/signup" className="ml-2 text-[#1e3a8a] font-semibold text-sm hover:underline">
            Join Now
          </CustomLink>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-800"
              placeholder="Email address"
              required
            />
          </div>
          <div className="mt-4">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-800"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex justify-end items-center mt-4">
            <CustomLink href="/forgot-password" className="text-[#1e3a8a] font-semibold text-sm hover:underline">
              Forgot password?
            </CustomLink>
          </div>
          <button
            type="submit"
            className={`w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
              }`}
            disabled={loading}
          >
            {loading ? (
              <>
                Logging in
                <Loader2 className="animate-spin w-5 h-5" />
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>

  );
};

export default Login;
