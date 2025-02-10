import { connectDB } from "../../lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newUser = new User(body)
        await newUser.save();

        return NextResponse.json(
            { message: "User has been created successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
        );
    }
}