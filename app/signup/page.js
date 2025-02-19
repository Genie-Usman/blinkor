"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Image from "next/image";
import CustomLink from "../../components/CustomLink";

const Signup = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/')
    }
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Your account has been created!", {
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

        setFormData({ name: "", email: "", password: "" });
        setLoading(false);
      } else {
        toast.error(data.message || "Signup failed!", {
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
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg md:mt-16">
        <div className="flex justify-center">
          <Image
            className="m-auto"
            src="/logo.png"
            alt="logo"
            width={500}
            height={250}
            style={{ width: "22%", height: "auto" }}
          />
        </div>
        <h2 className="text-center text-2xl font-bold mt-2">
          Sign up for your account
        </h2>
        <div className="text-center text-gray-600">
          Or
          <CustomLink
            href="/login"
            className="ml-2 text-[#ec698f] font-bold text-sm hover:text-devstyle"
          >
            Login
          </CustomLink>
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="w-full px-4 py-2 mt-2 border-0 rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="mt-4">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-1 focus:outline-none focus:ring-devstyle"
              placeholder="Email Address"
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
          <button
            type="submit"
            className={`w-full mt-4 bg-gray-700 text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#686763] "
            }`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
