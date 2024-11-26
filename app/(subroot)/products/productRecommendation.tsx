"use client";

// ui
import * as ProductCard from "@/ui/card/productCard";

// data
// import products from "@/data/product.json";
import { Product } from "@/types/product";
import RecProductCard from "@/components/RecProductCard";

const ProductRecommendation = ({ products }: { products: Product[] }) => {
  return (
    <div className="space-y-10 lg:space-y-12">
      <h2 className="font-poppins text-[28px] font-medium text-[#141718]">
        You might also like
      </h2>

      <div className="grid grid-cols-7 gap-4 pb-10 scrollbar scrollbar-track-[#E8ECEF] scrollbar-thumb-[#343839] scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-h-2 lg:pb-12">
        {products.map((product: any) => (
          <RecProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendation;
