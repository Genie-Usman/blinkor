import { NextResponse } from "next/server";
import User from "../../../lib/database/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "../../../lib/database/mongodb";

export async function PUT(request) {
    await connectDB()
    try {
        const { token, name, address, phone, zipcode, password, confirmPassword } = await request.json();

        if (!token) {
            return NextResponse.json({ message: "Unauthorized. Token missing." }, { status: 401 });
        }

        let data;
        try {
            data = jwt.verify(token, process.env.JWT_SECRET);
            if (!data?.id) {
                return NextResponse.json({ message: "Unauthorized. Invalid token payload." }, { status: 401 })
            }
        } catch (error) {
            return NextResponse.json({ message: "Unauthorized. Invalid token." }, { status: 401 })
        }

        if (password && password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 })
        }

        const updateData = { name, phone, address, zipcode };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt)
        }

        const updatedUser = await User.findByIdAndUpdate(
            data.id,
            updateData,
            { new: true, runValidators: true, select: "-password" }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        return NextResponse.json(updatedUser, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
    }
}
