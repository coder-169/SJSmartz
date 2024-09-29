import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
function createSlug(title: string) {
  return title
    .toLowerCase() // Convert the string to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const product = await Product.create({
      ...body,
      slug: createSlug(body.title),
    });
    if (product)
      return NextResponse.json(
        { success: true, message: "Product Created" ,product},
        { status: 201 },
      );

    return NextResponse.json(
      { success: false, message: "Error creating product" },
      { status: 400 },
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
export async function GET() {
  try {
    await dbConnect();
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
