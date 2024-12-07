import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ordersReducer } from "@/states/Reducers/OrderReducer";
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
      const variant = await Variant.findById(element._id);
      const variantPrice = Math.round(
        variant?.price - (variant?.price * variant.discount) / 10,
      );
      const elementPrice = Math.round(
        element?.price - (element?.price * element.discount) / 10,
      );
      if (variantPrice !== elementPrice)
        return NextResponse.json({
          success: false,
          message: "Some error occurred please clear cart! and checkout again",
        });
      if (variant.stock > element.qty) {
        variant.stock -= element.qty;
      }

      await variant.save();
    }
    const coupon = await Coupon.findOne({ couponCode: body.coupon.value });
    if (coupon) {
      if (coupon.discount > 0 && coupon.uses > 0 && coupon.status) {
        body.totalPayment -= body.totalPayment * (coupon.discount / 100);
        body.totalPayment = Math.round(body.totalPayment)
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
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = headers().get("userId");
    const orderId = headers().get("orderId");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Invalid Authorization!",
      });
    }
    if (orderId) {
      const order = await Order.aggregate([
        {
          $match: { _id: new ObjectId(orderId) }, // Match orders with the provided userId
        },
        {
          $lookup: {
            from: "users", // Name of the users collection
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user", // Flatten the `user` array from `$lookup`
        },
      ]);
      return NextResponse.json({
        success: true,
        order: order[0],
        message: "Order found successfully",
      });
    }

    const orders = await Order.aggregate([
      {
        $match: { userId: new ObjectId(userId) }, // Match orders with the provided userId
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Flatten the `user` array from `$lookup`
      },
    ]);
    if (orders.length > 0) {
      return NextResponse.json({
        success: true,
        orders,
        message: "Orders found successfully",
      });
    }
    return NextResponse.json({
      success: false,
      message: "Orders not found",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const userId = headers().get("userId");
    const orderId = headers().get("orderId");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Invalid Authorization!",
      });
    }
    if (!orderId) {
      return NextResponse.json({
        success: true,
        message: "Invalid Order Id",
      });
    }
    await Order.findByIdAndUpdate(orderId, body);
    const order = await Order.aggregate([
      {
        $match: { userId: new ObjectId(userId) }, // Match orders with the provided userId
      },
      {
        $lookup: {
          from: "users", // Name of the users collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Flatten the `user` array from `$lookup`
      },
    ]);

    if (!order)
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    return NextResponse.json({
      success: true,
      order: order[0],
      message: "Order updated successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
