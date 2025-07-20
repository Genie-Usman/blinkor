import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";
import { NextResponse } from "next/server";

export async function GET(req) {
  console.log("📥 API called:", req.method);
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    let products;
    if (productId) {
      products = await Products.findById(productId);
    } else {
      products = await Products.find({}, "title category price discount totalSold variants");
    }

    if (!products) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}

