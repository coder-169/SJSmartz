import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log('I am here')
  try {
    await dbConnect()
    const slug = req.nextUrl.searchParams.get("slug");
    console.log(slug)
    const productData = await Product.aggregate([
      {
        $match: { slug }, // Match the product by slug
      },
      {
        $lookup: {
          from: "variants", // The name of the variant collection
          localField: "_id", // Field from Product
          foreignField: "productId", // Field from Variant
          as: "variants", // Name of the array in the result
        },
      },
    ]);
    console.log("pr", productData);
    if (!productData)
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });

    return NextResponse.json(productData[0]);
  } catch (error) {
    return NextResponse.json(error);
  }
}
