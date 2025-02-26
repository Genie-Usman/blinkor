import { NextResponse } from "next/server";
import {connectDB} from "../../lib/mongodb.js";
import Products from "../../../models/Products";

export const GET = async () => {
    await connectDB();
    try {
        console.log("Database connected successfully");

        const products = await Products.aggregate([
            { 
                $match: { 
                    category: { 
                        $in: ["coding tshirts", "minions tshirts", "coding hoodies", "stylish hoodies", 
                              "cartoon caps", "comic caps", "comic sips", "screen sips", "toon sips"] 
                    } 
                } 
            },
            { $sample: { size: 12 } }
        ]);

        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching recommended products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
};
