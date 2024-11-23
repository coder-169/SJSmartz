import dbConnect from "@/lib/db";
import Address from "@/models/Address";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body)
    await User.findByIdAndUpdate(body.user_id, body.user);
    await Address.findByIdAndUpdate(body.address.add_id, body.address);

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
