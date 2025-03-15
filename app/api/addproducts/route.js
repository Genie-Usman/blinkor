import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";
import { NextResponse } from "next/server";

const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size", "Generic"];

const sortVariantsBySize = (variants) => {
    return variants.sort((a, b) => {
        const sizeIndexA = sizeOrder.indexOf(a.size);
        const sizeIndexB = sizeOrder.indexOf(b.size);
        return sizeIndexA - sizeIndexB;
    });
}

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
            let existingProduct = await Products.findOne({ slug: item.slug });

            if (existingProduct) {
                item.variants.forEach(variant => {
                    const existingVariant = existingProduct.variants.find(
                        v => v.size === variant.size && v.color === variant.color && v.image === variant.image
                    );

                    if (existingVariant) {
                        existingVariant.availableQuantity += variant.availableQuantity;
                    } else {
                        existingProduct.variants.push(variant);
                    }
                });

                existingProduct.variants = sortVariantsBySize(existingProduct.variants);

                existingProduct.discount = item.discount || existingProduct.discount;
                existingProduct.price = item.price || existingProduct.price;
                await existingProduct.save();
            } else {
                const newProduct = new Products({
                    title: item.title,
                    slug: item.slug,
                    description: item.description,
                    image: item.image,
                    category: item.category,
                    price: item.price,
                    discount: item.discount || 0,
                    variants: sortVariantsBySize(item.variants),
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
