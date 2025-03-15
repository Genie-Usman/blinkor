"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SalesOverview from "./components/dashboard/SalesOverview";
import ProductPerformance from "./components/dashboard/ProductPerformance";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      router.push("/admin-login");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <div className="w-full md:ml-8 bg-[#f6f2f0]/80 shadow-sm overflow-hidden">
        <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-2xl ml-10 font-bold text-white">Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
          <div className="col-span-1 lg:col-span-2">
            <SalesOverview />
          </div>
          <div className="col-span-2">
            <ProductPerformance />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
