import { connectDB } from "../../../lib/database/mongodb";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Order from "../../../lib/database/models/Order";

export async function POST(request) {
    try {
        await connectDB();

        const { token } = await request.json();
        if (!token) {
            return NextResponse.json({ message: "Unauthorized. Token missing." }, { status: 401 });
        }

        let data;
        try {
            data = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
        }

        const orders = await Order.find({ customerEmail: data.email, status: 'paid' });

        return NextResponse.json({ message: "Orders Fetched!!", orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong. Try again later." }, { status: 500 });
    }
}
