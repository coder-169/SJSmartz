import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function formatDeliveryDate(days) {
  const now = new Date(); // Get current date and time
  const dt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000); // Calculate future date
  const deliveryDate = dt.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const options = {
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
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    for (const product in body.products) {
      console.log(product);
    }
    const order = await Order.create({
      ...body,
      deliveryDate: formatDeliveryDate(8).deliveryDate,
      createdAt: formatDeliveryDate(8).createdAt,
    });
    if (order)
      return NextResponse.json({
        success: true,
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
