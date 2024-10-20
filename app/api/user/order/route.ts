import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function formatDeliveryDate(days: number) {
  const now = new Date(); // Get current date and time
  const dt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000); // Calculate future date
  const deliveryDate = dt.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // Display full weekday name
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const createdAt = new Date(now.getTime()).toLocaleString("en-US", options);
  return { createdAt, deliveryDate };
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    for (let i = 0; i < body.products.length; i++) {
      const element = body.products[i];
      // console.log(element);
      const variant = await Variant.findById(element._id);
      if (variant.price !== element.price)
        return NextResponse.json({
          success: false,
          message: "Some error occurred please clear cart! and checkout again",
        });
      if (variant.stock > element.qty) {
        variant.stock -= element.qty;
        console.log(variant.stock);
      }

      await variant.save();
    }
    console.log(body.coupon)
    const coupon = await Coupon.findOne({ couponCode: body.coupon.value });
    console.log(coupon)
    if (coupon) {
      if (coupon.discount > 0 && coupon.uses > 0 && coupon.status) {
        console.log('here')
        body.totalPayment -= body.totalPayment * (coupon.discount / 100);
      }
    }

    // return NextResponse.json({});
    const order = await Order.create({
      ...body,
      deliveryDate: formatDeliveryDate(8).deliveryDate,
      createdAt: formatDeliveryDate(8).createdAt,
    });
    if (order)
      return NextResponse.json({
        success: true,
        order,
        message: "Order created Successfully",
      });
    return NextResponse.json({
      success: true,
      message: "Error creating order",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
