import { connectDB } from "../../../lib/database/mongodb";
import User from "../../../lib/database/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; 

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();

        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 400 }
            );
        }

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
