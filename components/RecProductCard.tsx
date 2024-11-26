import { RootState } from "@/app/global/store";
import { useGlobalContext } from "@/hooks/AppContext";
import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
function shortenTitle(title: string, maxWords = 4) {
  const words = title.split(" "); // Split the title into words
  if (words.length <= maxWords) {
    return title; // Return the title if it's already short
  }
  return words.slice(0, maxWords).join(" "); // Take the first maxWords words and join them
}

const RecProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useGlobalContext() as any;
  return (
    product && (
      <div key={product._id} className="col-span-1 rounded-lg p-2 shadow-xl">
        <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md  group-hover:opacity-75">
          <Link href={`/products/${product.slug}`}>
            <Image
              width={200}
              height={200}
              src={product?.images[0]}
              alt={product?.title}
              className="h-full w-full object-contain object-center lg:h-full lg:w-full"
            />
          </Link>
        </div>
        <div>
          <h3 className="text-sm text-gray-700">
            <Link href={`/products/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {shortenTitle(product.title, 3)}
            </Link>
          </h3>
        </div>
        <div className="mt-4 flex justify-between">
          <p className="mt-1 text-xs text-gray-500">{product.category}</p>
          {/* <p className="text-sm font-medium text-gray-900">
            Rs.{product?.variants[0]?.price}
          </p> */}
        </div>
      </div>
    )
  );
};

export default RecProductCard;
