import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await User.findOne(body.userId);
    const hash = await bcrypt.hash(body.password, 10);
    user.password = hash;
    await user.save();
    return NextResponse.json({ success: true, message: "Password created" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
