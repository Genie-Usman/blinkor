import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";

export async function GET() {
  await connectDB();

  try {
    const products = await Products.find()
      .sort({ "variants.totalSold": -1 })
      .limit(10)
      .select("title category price discount variants")

    return Response.json(products);
  } catch (error) {
    console.error("Error fetching most sold products:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), { status: 500 });
  }
}
