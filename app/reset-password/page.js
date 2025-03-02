"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setToken(searchParams.get("token"));
        setEmail(searchParams.get("email"));
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token || !email) {
            toast.error("Invalid reset link. Please request a new one.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setTimeout(() => router.push("/login"), 1500);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
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
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/blinkor.png"
                        alt="logo"
                        width={500}
                        height={250}
                        className="m-auto w-[45%] h-auto"
                    />
                </motion.div>
                <h2 className="text-center text-2xl font-semibold text-gray-800 mt-4">
                    Reset Your <span className="text-gray-600">Password!</span>
                </h2>

                <form onSubmit={handleSubmit} className="mt-6">
                    <input
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-800"
                        placeholder="New Password"
                        required
                    />
                    <input
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-800"
                        placeholder="Confirm Password"
                        required
                    />
                    <button
                        type="submit"
                        className={`w-full mt-4 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg transition-all duration-300 ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-700"
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                Resetting <Loader2 className="animate-spin w-5 h-5" />
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
