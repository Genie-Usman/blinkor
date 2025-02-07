import { connectDB } from "../../lib/mongodb";
import Products from "@/models/Products";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        if (!Array.isArray(body) || body.length === 0) {
            return NextResponse.json(
                { message: "Invalid product data" },
                { status: 400 }
            );
        }

        for (let i = 0; i < body.length; i++) {
            const product = new Products({
                title: body[i].title,
                slug: body[i].slug,
                description: body[i].description,
                image: body[i].image,
                price: body[i].price,
                availableQuantity: body[i].availableQuantity,
            });
            await product.save();
        }

        return NextResponse.json(
            { message: "Products added successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error adding products:", error);
        return NextResponse.json(
            { message: "Failed to add products" },
            { status: 500 }
        );
    }
}
