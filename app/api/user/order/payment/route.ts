import { NextRequest, NextResponse } from "next/server";
const BASE = "";
import crypto from "crypto";
import axios from "axios";
import { generateCheckoutUrl, random_string } from "@/lib/server_action";
import Order from "@/models/Order";

// sec = 8scr5jcSELffqS3BZMz4FOtxALJG339nGYpjmk4yvWtZ5lnz1EyXC1JcpcohVCRL
const getProductNames = (prods: [{ title: string }]) => {
  let name = "";
  for (let i = 0; i < prods.length - 1; i++) {
    const e = prods[i];
    name += prods[i].title.slice(0, 20);
    if (i < prods.length - 2) name += ", ";
  }
  name += "& " + prods[prods.length - 1].title;
  return name;
};
export async function POST(req: NextRequest) {
  try {
    const body = JSON.parse((await req.json()).data);
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=pkr",
    );
    if (!data)
      return NextResponse.json(
        { success: false, message: "Invalid response! Please try again" },
        {
          status: 200,
        },
      );
    const pkrRate = data.tether.pkr + 3;
    const totalAmount = Number((body.fees / pkrRate).toFixed(2));
    const host = req.headers.get("host");
    const payload = {
      merchantId: "480498369",
      merchantTradeNo: random_string(),
      tradeType: "WEB",
      // totalFee: "0.000005",
      totalFee: totalAmount,
      currency: "USDT",
      // productType: body.orderId,
      productName: getProductNames(body.products),
      productDetail: `Payment for ${body.orderId}`,
      returnUrl: host + "/dashboard",
      webhookUrl: `https://sjsmartz.com/api/webhooks/binance?id=${body.orderId}`,
    };
    const response = await generateCheckoutUrl(payload);
    if (response.error) {
      return NextResponse.json({ success: false, message: response.message });
    } else {
      return NextResponse.json({
        success: true,
        checkoutUrl: response.data.checkoutUrl,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      },
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = JSON.parse((await req.json()).data);
    const order = await Order.findById(body.orderId);
    order.paymentScreenshot = body.url;
    await order.save();
    if (!order)
      return NextResponse.json({
        success: false,
        message: "Order not Found!",
      });
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 400,
      },
    );
  }
}
