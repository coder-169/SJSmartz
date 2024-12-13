import { sendMail } from "@/lib/server_action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, message,phone,subject } = body;
    if (!email || !name || !phone || !message || !subject) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const resp = await sendMail(
      process.env.EMAIL!,
      subject,
      `Name: ${name} \nEmail: ${email} \nPhone: ${phone} \nSubject: ${subject} \nMessage: ${message}`,
    );
    if (!resp.success) {
      return NextResponse.json({ message: resp.message, success: false });
    } else {
      return NextResponse.json({
        success: true,
        message:
          "mail sent successfully! you will get replied soon. We typically reply in 24 hours.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
