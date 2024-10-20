import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await User.findById(body.userId);
    user.addresses.push(body);
    await user.save();
    console.log(body);
    return NextResponse.json({ success: true, message: "Address added" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const user = await User.findById(body.userId);
    user.addresses.map((address: any) => {
      if (address._id.toString() === body._id)
      {
        address.address_line = body.address_line;
        address.city = body.city;
        address.postal_code = body.postal_code;
        address.state = body.state;
      }
    });
    await user.save();
    return NextResponse.json({ success: true, message: "Address updated" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
