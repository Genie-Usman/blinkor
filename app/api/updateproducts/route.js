import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";
import { NextResponse } from "next/server";

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size", "Generic"];

const sortVariantsBySize=(variants)=> {
    return variants.sort((a, b) => {
        const sizeIndexA = sizeOrder.indexOf(a.size);
        const sizeIndexB = sizeOrder.indexOf(b.size);
        return sizeIndexA - sizeIndexB;
    });
}

export async function PUT(request) {
    try {
        await connectDB();
        const body = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { message: "Invalid product data. Expected a non-empty array." },
                { status: 400 }
            );
        }

        const results = await Promise.allSettled(
            body.map(async (product) => {
                if (!product._id) throw new Error("Missing product ID");

                if (Array.isArray(product.variants)) {
                    product.variants = sortVariantsBySize(product.variants);
                }

                return Products.findByIdAndUpdate(product._id, product, {
                    new: true,
                    upsert: false,
                });
            })
        );

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
            { status: failedUpdates.length > 0 ? 207 : 200 }
        );
    } catch (error) {
        console.error("Error updating products:", error);
        return NextResponse.json(
            { message: "Failed to update products", error: error.message },
            { status: 500 }
        );
    }
}
