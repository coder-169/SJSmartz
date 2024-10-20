import nodemailer from "nodemailer";
import crypto from "crypto";

export const sendMail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      host: process.env.HOST,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const res = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      headers: {
        "Content-Type": "text/html",
      },
    });
    return { success: true, message: "mail sent" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
export const generateCode = async () => {
  let code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};

export function hash_signature(query_string: string) {
  return crypto
    .createHmac("sha512", process.env.BIN_SECRET_KEY!)
    .update(query_string)
    .digest("hex");
}

export function random_string() {
  return crypto.randomBytes(32).toString("hex").substring(0, 32);
}

export async function generateCheckoutUrl(payload: any) {
  const timestamp = Date.now();
  const nonce = random_string();
  const payload_to_sign =
    timestamp + "\n" + nonce + "\n" + JSON.stringify(payload) + "\n";
  const url = "https://bpay.binanceapi.com/binancepay/openapi/order";
  const signature = hash_signature(payload_to_sign);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "BinancePay-Timestamp": timestamp.toString(),
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": process.env.BIN_API_KEY!,
      "BinancePay-Signature": signature.toUpperCase(),
    },
    body: JSON.stringify(payload),
  });
  console.log(response);
  const dt = await response.json();
  console.log(dt);
  if (response.ok) {
    return { error: false, data: dt.data };
  } else {
    return { error: true, message: dt.message };
  }
}

export function validateSignature(headers: any, data: any) {
  // Get the headers and body from the request
  const timestamp = headers["binancepay-timestamp"];
  const nonce = headers["binancepay-nonce"];
  const payload = JSON.stringify(data); // Assuming you're using body-parser or similar middleware

  // Concatenate timestamp, nonce, and payload
  const dataToSign = timestamp + nonce + payload;
  const secretKey = process.env.BIN_SECRET_KEY!; // Replace with your Binance Pay secret key
  const signature = crypto
    .createHmac("sha512", secretKey)
    .update(dataToSign)
    .digest("hex");
  const receivedSignature = headers["binancepay-signature"];
  console.log(receivedSignature, signature);
  if (signature === receivedSignature) {
    console.log("Signature is valid!");
  } else {
    console.log("Signature is invalid!");
  }
}
