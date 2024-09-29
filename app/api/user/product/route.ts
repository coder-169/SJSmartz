import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect()
    const productId = headers().get("productId");
    if (!productId) {
      const products = await Product.find({});
      if (products)
        return NextResponse.json(
          { success: true, message: "Products Found", products },
          { status: 200 },
        );
      return NextResponse.json(
        { success: false, message: "Products Not Found" },
        { status: 404 },
      );
    } else {
      console.log(productId);
      const product = await Product.findById(productId);
      if (product)
        return NextResponse.json(
          { success: true, message: "Product Found", product },
          { status: 200 },
        );
      return NextResponse.json(
        { success: false, message: "Product Not Found" },
        { status: 404 },
      );
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
