import { connectDB } from "../../lib/mongodb";
import Products from "@/models/Products";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        await connectDB();

        const body = await request.json();

        // Validate request body
        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { message: "Invalid product data. Expected a non-empty array." },
                { status: 400 }
            );
        }

        // Process updates
        const results = await Promise.allSettled(
            body.map(async (product) => {
                if (!product._id) throw new Error("Missing product ID");

                return Products.findByIdAndUpdate(product._id, product, {
                    new: true, // Return the updated document
                    upsert: false, // Do not create a new document if not found
                });
            })
        );

        // Separate successful and failed updates
        const updatedProducts = results
            .filter(result => result.status === "fulfilled" && result.value)
            .map(result => result.value);

        const failedUpdates = results
            .filter(result => result.status === "rejected")
            .map(result => result.reason.message);

        return NextResponse.json(
            {
                message: "Products update process completed",
                updatedProducts,
                failedUpdates,
            },
            { status: failedUpdates.length > 0 ? 207 : 200 } // 207: Multi-Status (some failures)
        );
    } catch (error) {
        console.error("Error updating products:", error);
        return NextResponse.json(
            { message: "Failed to update products", error: error.message },
            { status: 500 }
        );
    }
}
