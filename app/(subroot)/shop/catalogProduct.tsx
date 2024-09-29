"use client";

// ui
import { WishlistIcon } from "@/ui/assets/svg";
import * as ProductCard from "@/ui/card/productCard";

// stores
import { useProductDetail } from "@/stores/zustand";

// lib
import { cn } from "@/lib/utils";
import { useGlobalContext } from "@/hooks/AppContext";
import Link from "next/link";

const CatalogProduct = ({ products }) => {
  const { addToCart } = useGlobalContext();
  const showDetail = useProductDetail((state) => state.showDetail);
  return (
    <div className="space-y-8 py-20 pt-8 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 lg:gap-x-4 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {products.map((product) => (
          <ProductCard.Root
            key={product.id}
            data={product}
            className={
              showDetail ? "sm:grid-cols-2 sm:place-items-center" : undefined
            }
          >
            {/* product card thumbnail */}
            <Link href={`/products/${product.slug}`}>
              <ProductCard.Thumbnail>
                {/* badge */}
                <ProductCard.ThumbnailBadge>
                  {product.discount > 0 && (
                    <div className="space-y-1.5">
                      <ProductCard.Badge intent="discount">
                        {product.discount}% off
                      </ProductCard.Badge>
                    </div>
                  )}

                  {!showDetail && <ProductCard.WishlistButton />}
                </ProductCard.ThumbnailBadge>

                {/* image */}
                <ProductCard.Image />
              </ProductCard.Thumbnail>
            </Link>

            {/* product card content */}
            <ProductCard.Content className="md:p-6">
              <ProductCard.Ratings />
              <div className="flex items-center justify-between gap-1">
                <Link href={`/products/${product.slug}`}>
                  <ProductCard.Name />
                </Link>
                <button
                  className={`flex items-center justify-center p-1.5 md:hidden ${
                    !showDetail && "hidden"
                  }`}
                >
                  <WishlistIcon className="h-7 w-7" />
                </button>
              </div>
              <ProductCard.Price />
              {showDetail && (
                <div className="space-y-4 pt-1 lg:space-y-6">
                  <ProductCard.Description className="line-clamp-3 md:text-sm" />

                  <div className="flex flex-col gap-2">
                    <ProductCard.Button
                      width="full"
                      fontSize="sm"
                      className="lg:text-base"
                      onClick={() => addToCart({ ...product, qty: 1 })}
                    >
                      Add to cart
                    </ProductCard.Button>
                    <ProductCard.Button
                      variant="ghost"
                      width="full"
                      fontSize="sm"
                      className="flex items-center justify-center gap-1 lg:text-base"
                    >
                      <WishlistIcon fill="#141718" className="h-5 w-5" />
                      Wishlist
                    </ProductCard.Button>
                  </div>
                </div>
              )}
            </ProductCard.Content>
          </ProductCard.Root>
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
