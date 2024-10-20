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
      <header>
        <div className="flex items-center justify-center py-4">
          <Image
            width={100}
            height={100}
            src="/images/sj-black.png"
            alt="Logo"
          />
        </div>
      </header>
      <div className="mx-32 my-12 grid place-content-start gap-y-6 lg:grid-cols-[1fr_3fr] lg:gap-x-4 xl:gap-x-8">
        <DashSidebar />
        {children}
      </div>
      <Footer />
    </>
  );
}
