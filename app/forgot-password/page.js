"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from 'react-hot-toast';
import { Loader2 } from "lucide-react";
import CustomLink from "../../components/CustomLink";

export const dynamic = "force-dynamic";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-store"
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message, {
            duration: 2500,
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
        setEmail("")
    } else {
        toast.error(data.message, {
            duration: 1500,
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
    }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        duration: 1500,
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
      <div className="flex min-h-screen items-center justify-center bg-[#f6f2f0]">
        <div className="w-full max-w-md bg-white/50 p-8 shadow-lg mt-16">
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Image
              className="m-auto"
              src="/Blinkor.png"
              alt="logo"
              width={500}
              height={250}
              style={{ width: "45%", height: "auto" }}
            />
          </motion.div>
          <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
            Forgot <span className="text-gray-600">Password!</span>
          </h2>
          <div className="text-center text-gray-600 mt-1">
                Already have an account? 
                <CustomLink
                  href="/login"
                  className="ml-2 text-[#1e3a8a] font-semibold text-sm hover:underline"
                >
                  Log in
                </CustomLink>
              </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
                placeholder="Email Address"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
                }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  Sending
                  <Loader2 className="animate-spin w-5 h-5" />
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </div>
      </div>
  );
};

export default ForgotPassword;