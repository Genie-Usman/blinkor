import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        await connectDB();
        const { productId, size, color, image, availableQuantity } = await request.json();

        if (!productId || !size || !color || !image || availableQuantity == null) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const product = await Products.findById(productId);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const variantExists = product.variants.some(
            (v) => v.size === size && v.color === color && v.image === image
        );

        if (variantExists) {
            return NextResponse.json({ message: "Variant already exists" }, { status: 400 });
        }
        product.variants.push({ size, color, image, availableQuantity });
        await product.save();

        return NextResponse.json(
            { message: "Variant added successfully", product },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding variant:", error);
        return NextResponse.json(
            { message: "Failed to add variant", error: error.message },
            { status: 500 }
        );
    }
}
