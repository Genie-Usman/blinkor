import { connectDB } from "../../lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; 

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.password, salt);
        const newUser = new User({ ...body, password: hashedPassword });
        await newUser.save();

        return NextResponse.json(
            { message: "User has been created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { message: "Failed to create user" },
            { status: 500 }
        );
    }
}
