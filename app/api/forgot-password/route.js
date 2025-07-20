import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { connectDB } from "../../../lib/database/mongodb";
import User from "../../../lib/database/models/User";
import Forgot from "../../../lib/database/models/Forgot";

export async function POST(req) {
  try {
    await connectDB()
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Valid email is required" }, { status: 400 })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const rawToken = randomBytes(32).toString("hex")
    const hashedToken = await bcrypt.hash(rawToken, 10)

    await Forgot.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 60 * 60 * 1000,
      },
      { upsert: true, new: true }
    );

    const resetLink = `https://blinkor.vercel.app/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
          <div style="font-family: Arial, sans-serif; background-color: #eeeae6; padding: 40px 0;">
            <!-- Centered Container -->
            <div style="max-width: 600px; margin: 0 auto; text-align: center;">
              <!-- Logo -->
              <img src="https://blinkor.vercel.app/Blinkor.png" 
     alt="Brand Logo" 
     style="width: 200px; height: auto; margin-bottom: 24px;">

      
              <!-- Heading -->
              <h2 style="font-size: 28px; font-weight: bold; color: #000000; margin-bottom: 16px;">
                Reset Your Password
              </h2>
      
              <!-- Description -->
              <p style="font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 32px;">
                We received a request to reset your password. Click the button below to proceed. If you didn't request this, you can safely ignore this email.
              </p>
      
              <!-- Reset Button -->
              <a href="${resetLink}" style="display: inline-block; background-color: #000000; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 16px 32px; border-radius: 8px; margin-bottom: 32px;">
                Reset Password
              </a>
      
              <!-- Expiration Notice -->
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px;">
                This link will expire in <strong>1 hour</strong>.
              </p>
      
              <!-- Support Info -->
              <p style="font-size: 14px; color: #6b7280;">
                Need help? Contact us at 
                <a href="mailto:support@blinkor.com" style="color: #000000; text-decoration: none; font-weight: 600;">
                  support@blinkor.com
                </a>
              </p>
      
              <!-- Footer -->
              <div style="margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <p style="font-size: 12px; color: #6b7280;">
                  &copy; 2023 Your Brand. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Password reset link sent to your email." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to send email. Please try again later." }, { status: 500 });
  }
}
