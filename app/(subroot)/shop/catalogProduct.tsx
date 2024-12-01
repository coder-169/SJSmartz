"use client";

// ui
import { WishlistIcon } from "@/ui/assets/svg";

// stores
import { useProductDetail } from "@/stores/zustand";

// lib
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/hooks/AppContext";
import Link from "next/link";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";

const CatalogProduct = ({ products }: { products: Product[] }) => {
  const { addToCart } = useGlobalContext() as any;
  const showDetail = useProductDetail((state) => state.showDetail);
  
  return (
    <div className="overflow-hidden space-y-8 py-20 pt-8 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 lg:gap-x-4 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {products.slice(0,1).map((product: any) => (
          <ProductCard product={product} key={product._id}/>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="rounded-full border border-[#141718] px-10 py-1.5 font-inter text-base font-medium text-[#141718]">
          Show more
        </button>
      </div>
    </div>
  );
};

export default CatalogProduct;
