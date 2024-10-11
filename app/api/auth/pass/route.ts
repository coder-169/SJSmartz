import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";

export async function POST(req:NextRequest) {
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.findOne({
      email: { $regex: body.email, $options: "i" },
    });
    user.password = hashedPassword;
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "invalid request user not found",
      });
    }
    await user.save();
    return NextResponse.json({
      success: true,
      message: "password created you can login to your account now",
      user,
    });
  } catch (error :any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
