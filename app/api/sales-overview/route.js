import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import Order from "../../../models/Order";

export async function GET() {
  try {
    await connectDB();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlySales = new Array(12).fill(0);
    const monthlyOrders = new Array(12).fill(0);

    salesData.forEach(({ _id, totalSales, totalOrders }) => {
      monthlySales[_id - 1] = totalSales
      monthlyOrders[_id - 1] = totalOrders
    });

    return NextResponse.json(
      {
        monthlySales,
        monthlyOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales data" },
      { status: 500 }
    );
  }
}