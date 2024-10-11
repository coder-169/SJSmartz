import { sendMail } from "@/lib/server_action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, subject, message, id } = body;
    if (!email || !name || !subject || !message) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const resp = await sendMail(
      process.env.EMAIL!,
      "Report Issue",
      `Name: ${name} \nEmail: ${email} \nSubject: ${subject} \nMessage: ${message}`,
    );
    if (!resp.success) {
      return NextResponse.json({ message: resp.message, success: false });
    } else {
      return NextResponse.json({
        success: true,
        message:
          "mail sent successfully. We will resolve your issue as soon as possible.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
