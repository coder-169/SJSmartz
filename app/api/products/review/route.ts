import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Review from "@/models/Review";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.productId)
      return NextResponse.json({
        success: false,
        message: "Product Id is required!",
      });
    const product = await Product.findById(body.productId);
    if (!product)
      return NextResponse.json({
        success: false,
        message: "Product not Found!",
      });
    await Review.create(body);
    const totalRating = product.rating * product.noOfReviews + body.rating; // Total sum of all ratings
    product.noOfReviews += 1; // Increment the number of reviews
    product.rating = (totalRating / product.noOfReviews).toFixed(1);
    
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Review Posted Successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
