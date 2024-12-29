import dbConnect from "@/lib/db";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Variant from "@/models/Variant";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { ordersReducer } from "@/states/Reducers/OrderReducer";
import { sendMail } from "@/lib/server_action";
import User from "@/models/User";
import Refer from "@/models/Refer";

export async function GET(req: NextRequest) {
    try {
      await dbConnect();
      const userId = headers().get("userId");
      const referId = headers().get("orderId");
      if (!userId) {
        return NextResponse.json({
          success: false,
          message: "Invalid Authorization!",
        });
      }
      if (referId) {
        const refer = await Refer.aggregate([
          {
            $match: { _id: new ObjectId(referId) }, // Match orders with the provided userId
          },
          {
            $lookup: {
              from: "referrals", // Name of the users collection
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
          refer: refer[0],
          message: "Refer found successfully",
        });
      }
  
      const refers = await Refer.aggregate([
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
      if (refers.length > 0) {
        return NextResponse.json({
          success: true,
          refers,
          message: "Refers found successfully",
        });
      }
      return NextResponse.json({
        success: false,
        message: "Refers not found",
      });
    } catch (error: any) {
      return NextResponse.json({ success: false, message: error.message });
    }
  }