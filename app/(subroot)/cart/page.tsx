"use client";
// package
import { ChevronLeft } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import CartSummary from "@/app/(subroot)/cart/cartSummary";
import CartCoupon from "@/app/(subroot)/cart/cartCoupon";
import CartTable from "@/app/(subroot)/cart/cartTable";
import { useGlobalContext } from "@/hooks/AppContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { loadCart } = useGlobalContext();
  const [step, setStep] = useState(1);
  const router = useRouter();
  useEffect(() => {
    loadCart();
    if (
      localStorage.getItem("sjsmartz-cart-items")! &&
      JSON.parse(localStorage.getItem("sjsmartz-cart-items")!).length === 0
    ) {
      router.push("/");
    }
  }, []);
  return (
    <SectionLayout className="relative px-8 py-20">
      <div className="absolute left-8 top-4 inline-flex items-center gap-1 align-baseline lg:hidden">
        <ChevronLeft stroke="#605F5F" className="h-3 w-3" />
        <p className="font-inter text-sm font-medium text-[#605F5F]">back</p>
      </div>

      <div className="space-y-6 pb-20 lg:space-y-10">
        <h1 className="text-center font-poppins text-[40px] font-medium text-[#141718]">
          Cart
        </h1>
        <div className="flex items-center justify-center gap-4 align-baseline">
          <p
            className={`relative min-w-max pr-4 font-inter text-sm font-medium ${step === 1 ? "text-[#141718]" : "text-[#605F5F]"} before:absolute before:right-0 before:content-['/']`}
          >
            <span
              className={`mr-2 hidden h-6 w-6 items-center justify-center rounded-full 
            ${step === 1 ? "bg-[#141718] " : "bg-[#605F5F]"} font-inter text-xs text-white md:inline-flex`}
            >
              1
            </span>
            Shopping cart
          </p>

          <p
            className={`relative line-clamp-1 pr-4 font-inter text-sm font-normal ${step === 2 ? "text-[#141718]" : "text-[#605F5F]"}   before:absolute before:right-0 before:content-['/']`}
          >
            <span
              className={`mr-2 hidden h-6 w-6 items-center justify-center rounded-full ${step === 2 ? "bg-[#141718]" : "bg-[#605F5F]"}  font-inter text-xs text-white md:inline-flex`}
            >
              2
            </span>
            Checkout details
          </p>

          <p
            className={`relative line-clamp-1 pr-4 font-inter text-sm font-normal ${step === 3 ? "text-[#141718]" : "text-[#605F5F]"} before:absolute before:right-0 before:content-['/'] last:before:content-['']`}
          >
            <span
              className={`mr-2 hidden h-6 w-6 items-center justify-center rounded-full ${step === 3 ? "bg-[#141718]" : "bg-[#605F5F]"}  font-inter text-xs text-white md:inline-flex`}
            >
              3
            </span>
            Order complete
          </p>
        </div>
      </div>

      <div className="grid gap-y-6 lg:grid-cols-[2fr_1fr] lg:gap-x-8 xl:gap-x-16">
        {/* Cart Table */}
        <CartTable />

        <div className="space-y-6">
          {/* Cart Coupon */}
          <CartCoupon />

          {/* Cart Summary */}
          <CartSummary />
        </div>
      </div>
    </SectionLayout>
  );
}
