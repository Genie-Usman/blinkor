"use client";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setEmail(""); // Clear input on success
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      {message && (
        <p className={`mt-4 ${message.includes("sent") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;