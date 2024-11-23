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
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    const { newPassword, oldPassword, userId } = body;
    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ success: false, message: "User not found" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch)
      return NextResponse.json({ success: false, message: "Old Password is not correct!" });
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    
    return NextResponse.json({ success: true, message: "Password Updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
