import { connectDB } from "../../lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const { email, password } = await request.json();
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json(
                { message: "No such user exists!" },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { message: "You are successfully logged in" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { message: "Failed to log in" },
            { status: 500 }
        );
    }
}
