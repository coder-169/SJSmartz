import Coupon from "@/models/Coupon";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const coupon = await Coupon.findOne({ couponCode: body.coupon });
    if (coupon.status && coupon.uses > 0) {
      return NextResponse.json({ success: true, message: "Coupon Applied",coupon });
    }
    return NextResponse.json({
      success: false,
      message: "Invalid coupon or Expired!",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
