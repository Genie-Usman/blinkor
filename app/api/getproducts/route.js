import { connectDB } from "../../lib/mongodb";
import Products from "@/models/Products";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const products = await Products.find({});

    const tshirts = {};

    for (const item of products) {
      if (tshirts[item.title]) {
        if (!tshirts[item.title].color.includes(item.color) && item.availableQuantity > 0) {
          tshirts[item.title].color.push(item.color);
        }
        if (!tshirts[item.title].size.includes(item.size) && item.availableQuantity > 0) {
          tshirts[item.title].size.push(item.size);
        }
      } else {
        tshirts[item.title] = {
          ...item.toObject(),
          color: item.availableQuantity > 0 ? [item.color] : [],
          size: item.availableQuantity > 0 ? [item.size] : [],
        };
      }
    }
    return NextResponse.json(Object.values(tshirts), { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}