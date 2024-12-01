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
import Image from "next/image";
import Rating from "@/components/Rating";
function shortenTitle(title: string, maxWords = 4) {
  const words = title.split(" "); // Split the title into words
  if (words.length <= maxWords) {
    return title; // Return the title if it's already short
  }
  return words.slice(0, maxWords).join(" "); // Take the first maxWords words and join them
}
const CatalogProduct = ({ products }: { products: Product[] }) => {
  const { addToCart } = useGlobalContext() as any;
  const showDetail = useProductDetail((state) => state.showDetail);

  return (
    <div className="h-[100vh] space-y-8 overflow-hidden py-20 pt-8 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 lg:gap-x-4 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {products.slice(0, 1).map((product: any) => (
          <div key={product._id} className="overflow-hidden rounded-lg p-2">
            <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md  group-hover:opacity-75">
              {/* <Link href={`/products/${product.slug}`}> */}
              <Image
                width={200}
                height={200}
                src={product?.images[0]}
                alt={product?.title}
                className="h-full w-full object-contain object-center lg:h-full lg:w-full"
              />
              {/* </Link> */}
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm !font-semibold text-gray-700">
                  <Link href={`/products/${product.slug}`}>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 font-semibold"
                    />
                    {shortenTitle(product.title, 3)}
                  </Link>
                </h3>
              </div>
              <div className="mt-4 flex justify-between">
                <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                <p className="text-sm !font-semibold text-gray-900">
                  Rs.{product?.variants[0]?.price}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs">
                <span className="text-gray-500">
                  ({product.noOfReviews}) Reviews
                </span>
                <Rating rating={product.rating} />
              </div>
              <button
                onClick={() =>
                  addToCart({
                    ...product,
                    price: product.variants[0].price,
                    _id: product.variants[0]._id,
                    color: product.variants[0].color,
                    image: product.variants[0].image,
                    discount: product.variants[0].discount,
                    stock: product.variants[0].stock,
                    qty: 1,
                  })
                }
                className="m-4 mx-auto mt-4 block w-full rounded-xl bg-blue-950 p-4 text-center text-sm font-semibold text-white"
              >
                Add To Cart
              </button>
            </div>
          </div>
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
