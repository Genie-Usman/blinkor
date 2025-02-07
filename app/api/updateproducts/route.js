import { connectDB } from "../../lib/mongodb";
import Products from "@/models/Products";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { message: "Invalid product data" },
                { status: 400 }
            );
        }

        const updatedProducts = await Promise.all(
            body.map(async (product) => {
                const updatedProduct = await Products.findByIdAndUpdate(
                    product._id,
                    product,
                    { new: true, upsert: false } 
                );

                return updatedProduct ? updatedProduct : null;
            })
        );

        return NextResponse.json(
            { message: "Products updated successfully", updatedProducts: updatedProducts.filter(Boolean) },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating products:", error);
        return NextResponse.json(
            { message: "Failed to update products" },
            { status: 500 }
        );
    }
}
