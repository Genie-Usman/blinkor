"use client";
import React, { useState } from "react";
import Header from "./layout/header/DashboardHeader";
import Sidebar from "./layout/sidebar/DashboardSidebar";
import Footer from "./layout/footer/DashboardFooter";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f6f2f0]/80">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Header */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 py-1 mx-auto w-full">
          <div className="min-h-[calc(100vh-170px)]">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
