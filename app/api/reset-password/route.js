import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../lib/mongodb";
import User from "../../../models/User";
import Forgot from "../../../models/Forgot";

export async function POST(req) {
  try {
    await connectDB()

    const { token, email, password } = await req.json()

    if (!token || !email || !password) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const forgotRecord = await Forgot.findOne({ email })

    if (!forgotRecord || !forgotRecord.resetPasswordToken) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    const isTokenValid = await bcrypt.compare(token, forgotRecord.resetPasswordToken);
    if (!isTokenValid) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    if (forgotRecord.resetPasswordExpires && forgotRecord.resetPasswordExpires < Date.now()) {
      return NextResponse.json({ message: "Token expired" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ email }, { $set: { password: hashedPassword } });
    await Forgot.deleteOne({ email });
    return NextResponse.json({ message: "Password successfully reset!" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
