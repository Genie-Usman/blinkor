import { connectDB } from "../../lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Something went wrong. Try again later." }, { status: 500 });
  }
}
