"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Zoom } from "react-toastify";
import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { useCart } from "../context/CartContext";

const Login = () => {
  const {login} = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('token')){
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
      toast.error("Email and password are required!", { autoClose: 2000 });
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
        toast.success("Login successful!", { position: "top-left", autoClose: 500, transition: Zoom });
        setFormData({ email: "", password: "" });
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(data.message || "Invalid credentials!", { autoClose: 2000 });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.", { autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg mt-16">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="logo" width={500} height={250} style={{ width: "22%", height: "auto" }} />
        </div>
        <h2 className="text-center text-2xl font-bold mt-2">Login to your account</h2>
        <div className="text-center text-gray-600">
          Or
          <CustomLink href="/signup" className="ml-2 text-devstyle font-bold text-sm hover:text-red-700">Sign up</CustomLink>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 mt-2 border-0 rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
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
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex justify-end items-center mt-4">
            <CustomLink href="/forgotpassword" className="text-devstyle font-bold text-sm hover:text-red-700">Forgot password?</CustomLink>
          </div>
          <button
            type="submit"
            className={`w-full mt-4 bg-devstyle text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
