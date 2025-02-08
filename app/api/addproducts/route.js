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

        for (const item of body) {
            // Check if the product with the same slug already exists
            let existingProduct = await Products.findOne({ slug: item.slug });

            if (existingProduct) {
                // If the product exists, update the variants
                item.variants.forEach(variant => {
                    const existingVariant = existingProduct.variants.find(
                        v => v.size === variant.size && v.color === variant.color
                    );

                    if (existingVariant) {
                        existingVariant.availableQuantity += variant.availableQuantity;
                    } else {
                        existingProduct.variants.push(variant);
                    }
                });

                await existingProduct.save();
            } else {
                // Create a new product entry
                const newProduct = new Products({
                    title: item.title,
                    slug: item.slug,
                    description: item.description,
                    image: item.image,
                    category: item.category,
                    price: item.price,
                    variants: item.variants,  // Now storing all sizes/colors inside the variants array
                });

                await newProduct.save();
            }
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
