import dbConnect from "@/lib/db";
import Address from "@/models/Address";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    await Address.create({ ...body, userId: body._id });
    return NextResponse.json({ success: true, message: "Address added" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    console.log(body)
    await Address.findByIdAndUpdate(body._id, { ...body });

    return NextResponse.json({ success: true, message: "Address updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
