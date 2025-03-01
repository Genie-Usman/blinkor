"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !email) {
      setMessage("Invalid reset link. Please request a new one.");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Reset Password
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
};

export default ResetPassword;
