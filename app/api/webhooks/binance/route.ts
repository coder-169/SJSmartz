import dbConnect from "@/lib/db";
import { validateSignature } from "@/lib/server_action";
import Order from "@/models/Order";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const body = {
  bizType: "PAY",
  data: {
    merchantTradeNo: "1b90ace4bf8ac224a34defbd1da80e25",
    productType: "Headphones",
    productName: "P47 Wireless",
    transactTime: 1729172351253,
    tradeType: "WEB",
    totalFee: 0.00005,
    currency: "USDT",
    transactionId: "P_A1P1RMZJ8PW7111H",
    openUserId: "8f70abafa67b12b9464e13ed826bfe5c",
    commission: 5.0e-7,
    orderId: "id",
    paymentInfo: {
      payerId: 480498369,
      payMethod: "funding",
      paymentInstructions: [{ currency: "USDT", amount: 0.00005, price: 1.0 }],
      channel: "DEFAULT",
    },
  },
  bizIdStr: "324990440776253440",
  bizStatus: "PAY_SUCCESS",
  url: "/ehl",
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await dbConnect();
    const id = req.nextUrl.searchParams.get("id");
    const host = req.headers.get("host");
    // validateSignature(req.headers, (await req.json()).data);
    // const url = "/";
    // if (url !== body.url) {
    //   return NextResponse.json(
    //     { success: false, message: "Invalid request" },
    //     { status: 400 },
    //   );
    // }
    await Order.findByIdAndUpdate(id, {
      payment: "paid",
      paymentMethod: "Binance Pay",
    });
    return NextResponse.json({
      success: true,
      message: "Order payment successful and order updated",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "" });
  }
}
