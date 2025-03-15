"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
  const [salesData, setSalesData] = useState({
    series: [
      { name: "Sales", data: new Array(12).fill(0) },
      { name: "Orders", data: new Array(12).fill(0) },
    ],
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const res = await fetch("/api/sales-overview");

        if (!res.ok) throw new Error("Failed to fetch sales data");

        const data = await res.json();
        setSalesData({
          series: [
            { name: "Sales", data: data.monthlySales },
            { name: "Orders", data: data.monthlyOrders },
          ],
          loading: false,
          error: false,
        });
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setSalesData((prev) => ({ ...prev, loading: false, error: true }));
      }
    };

    fetchSalesData();
  }, []);

  const optionssalesoverview = {
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      padding: { left: 10, right: 10, bottom: 0 },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        endingShape: "rounded",
        borderRadius: 6,
      },
    },
    colors: ["#2C3E50", "#F97316"],
    fill: { type: "solid", opacity: 1 },
    chart: {
      toolbar: { show: false },
      foreColor: "#6B7280",
      fontFamily: "Inter, sans-serif",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    legend: { show: false },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        seriesName: "Sales",
        min: 0,
        max: 10000,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
          formatter: (value) => `$${value}`,
        },
        title: {
          text: "Sales ($)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
      {
        seriesName: "Orders",
        opposite: true,
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
          formatter: (value) => `${value}`,
        },
        title: {
          text: "Orders",
          style: {
            color: "#6B7280",
            fontSize: "12px",
            fontFamily: "Inter, sans-serif",
          },
        },
      },
    ],
    stroke: { show: true, width: 3, colors: ["transparent"] },
    tooltip: {
      theme: "light",
      style: {
        fontFamily: "Inter, sans-serif",
      },
      y: {
        formatter: (value, { seriesIndex }) => {
          if (seriesIndex === 0) return `$${value}`;
          return `${value}`;
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f6f2f0]/80 py-6 px-4 md:px-10 lg:px-28"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-6">
        Sales Overview
      </h2>

      {salesData.loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-48 md:h-64"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-indigo-500"
          ></motion.div>
        </motion.div>
      ) : salesData.error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center h-48 md:h-64"
        >
          <p className="text-red-500 text-center text-sm md:text-base">
            Error loading sales data.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="border border-gray-200 rounded-lg p-3 md:p-4 bg-white/50">
            <Chart
              options={optionssalesoverview}
              series={salesData.series}
              type="bar"
              height={window.innerWidth < 768 ? "250px" : "350px"}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SalesOverview;
