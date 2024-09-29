// package
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
// lib
import { cn } from "@/lib/utils";

// css
import "./globals.css";
import AppContextProvider from "@/hooks/AppContext";
import AuthProvider from "@/hooks/AuthContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sj Smartz - Electronics Store",
  description:
    "We are a Electronics Selling Store having variety of products in Electronics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, poppins.variable)}>
      <body>
        <AppContextProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}
