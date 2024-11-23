// ui
import Navbar from "@/ui/navbar";
import Footer from "@/ui/footer";

// hooks
import { RootContextProvider } from "@/hooks/rootContext";
import Image from "next/image";
import DashSidebar from "@/components/DashSidebar";

interface PageLayoutProps {
  root: boolean;
  children: React.ReactNode;
}

export default function DashLayout({ root, children }: PageLayoutProps) {
  return (
    <>
      <div className="mx-32 flex items-start gap-4 ">
        <DashSidebar />
        <div className="w-4/5 h-screen overflow-scroll">{children}</div>
      </div>
    </>
  );
}
