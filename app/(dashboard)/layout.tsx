import type { Metadata } from "next";

import PageLayout from "@/layouts/pageLayout";
import DashLayout from "@/layouts/Dashlayout";
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
  return <DashLayout root={true}>{children}</DashLayout>;
}
