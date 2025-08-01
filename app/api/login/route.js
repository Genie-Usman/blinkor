import { connectDB } from "../../../lib/database/mongodb";
import User from "../../../lib/database/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required!" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials!" }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json({ message: "Invalid credentials!" }, { status: 401 });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '24h' })
    return NextResponse.json({ message: "Login successful!", token }, { status: 200 }, token);
    
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Something went wrong. Try again later." }, { status: 500 });
  }
}
