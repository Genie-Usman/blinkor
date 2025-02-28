"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function MyAccount() {
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "", phone: "", address: "", zipcode: "" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return router.push("/login");

        const res = await fetch("/api/getuser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) setUser(data);
        else toast.error(data.message || "Failed to fetch user", {
          duration: 1000,
          position: 'top-right',
          style: {
              background: '#000',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '2px',
              padding: '12px 20px',
          }});
      } catch (error) {
        toast.error("Error fetching user", {
          duration: 1000,
          position: 'top-right',
          style: {
              background: '#000',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '2px',
              padding: '12px 20px',
          }});
      }
    }
    fetchUser();
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!", {
        duration: 1000,
        position: 'top-right',
        style: {
            background: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '2px',
            padding: '12px 20px',
        }});
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/updateuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, password, confirmPassword, token }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully!", {
          duration: 1000,
          position: 'top-right',
          style: {
              background: '#000',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '2px',
              padding: '12px 20px',
          }});
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to update profile", {
          duration: 1000,
          position: 'top-right',
          style: {
              background: '#000',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 'bold',
              borderRadius: '2px',
              padding: '12px 20px',
          }});
      }
    } catch (error) {
      toast.error("Error updating profile", {
        duration: 1000,
        position: 'top-right',
        style: {
            background: '#000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            borderRadius: '2px',
            padding: '12px 20px',
        }});
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f2f0]/100 to-[#f6f2f0]/80 flex justify-center items-center py-10">
      <div className="w-full bg-[#f6f2f0]/80 shadow-sm overflow-hidden mt-10">
        <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">My Account</h2>
        </div>
        <form onSubmit={handleUpdate} className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border-b border-gray-300 bg-transparent cursor-not-allowed outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Zipcode</label>
              <input
                type="text"
                value={user.zipcode}
                onChange={(e) => setUser({ ...user, zipcode: e.target.value })}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password (optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password (optional)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-b border-gray-300 focus:border-gray-600 outline-none bg-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={loading}
          className={`w-32 ${
            loading ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 hover:bg-gray-800 active:bg-gray-700"
          } text-white py-2 rounded-lg font-base transition-all transform hover:scale-105 active:scale-95`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </div>
          ) : (
            "Update Profile"
          )}
        </button>
      </div>
        </form>
      </div>
    </div>
  );
}
