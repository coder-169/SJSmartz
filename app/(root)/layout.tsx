import type { Metadata } from "next";

import PageLayout from "@/layouts/pageLayout";
export const metadata: Metadata = {
  title: "Sj Smartz - Electronics Store",
  description: "We are a Electronics Selling Store having variety of products in Electronics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout root={true}>{children}</PageLayout>;
}
