import { NextResponse } from "next/server";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { connectDB } from "../../lib/mongodb";


export async function POST(request) {
    await connectDB();
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json({ message: "Unauthorized. Token missing." }, { status: 401 });
        }

        let data;
        try {
            data = jwt.verify(token, process.env.JWT_SECRET);
            if (!data?.id) {
                return NextResponse.json({ message: "Unauthorized. Invalid token payload." }, { status: 401 });
            }
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 });
        }

        const foundUser = await User.findById(data.id).select("-password");
        if (!foundUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json(foundUser, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}