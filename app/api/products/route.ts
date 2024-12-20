import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    await dbConnect();
    const slug = req.nextUrl.searchParams.get("slug");

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
      {
        $lookup: {
          from: "reviews", // The name of the reviews collection
          localField: "_id", // Field from Product
          foreignField: "productId", // Field from Review
          as: "reviews", // Name of the array in the result
        },
      },
    ]);

    if (!productData)
      return NextResponse.json(
        { success: false, error: "Product Not Found" },
        { status: 404 },
      );
    const currentProduct = productData[0];
    const { category } = currentProduct; // Assuming products have a `category` field

    // Fetch related products by matching the category, excluding the current product
    const relatedProducts = await Product.find({
      category,
      slug: { $ne: slug }, // Exclude the current product
    })
      .limit(5) // Limit the number of related products
      .select("_id title slug rating noOfReviews images"); 
    return NextResponse.json({
      success: true,
      product: productData[0],
      relatedProducts,
    });
  } catch (error) {
    return NextResponse.json(error);
  }
}
