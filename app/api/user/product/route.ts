import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const productId = headers().get("productId");
    // Define CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allow all origins
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Allowed headers
    };

    if (req.method === "OPTIONS") {
      // Handle preflight requests
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (!productId) {
      const products = await Product.aggregate([
        {
          $lookup: {
            from: "variants", // The name of the variant collection
            localField: "_id", // Field from Product
            foreignField: "productId", // Field from Variant
            as: "variants", // Name of the array in the result
          },
        },
      ]);
      if (products) {
        return NextResponse.json(
          { success: true, message: "Products Found", products },
          {
            status: 200,
            headers: corsHeaders,
          },
        );
      }
      return NextResponse.json(
        { success: false, message: "Products Not Found" },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    } else {
      const product = await Product.findById(productId);
      if (product) {
        return NextResponse.json(
          { success: true, message: "Product Found", product },
          {
            status: 200,
            headers: corsHeaders,
          },
        );
      }
      return NextResponse.json(
        { success: false, message: "Product Not Found" },
        {
          status: 404,
          headers: corsHeaders,
        },
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    );
  }
}
