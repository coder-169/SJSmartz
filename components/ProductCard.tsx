import { useGlobalContext } from "@/hooks/AppContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";
function shortenTitle(title: string, maxWords = 4) {
  const words = title.split(" "); // Split the title into words
  if (words.length <= maxWords) {
    return title; // Return the title if it's already short
  }
  return words.slice(0, maxWords).join(" "); // Take the first maxWords words and join them
}

const ProductCard = ({ product }) => {
  const { addToCart } = useGlobalContext();
  return (
    product && (
      <div key={product.id} className="rounded-lg p-2 shadow-xl">
        <div className="aspect-h-1 aspect-w-1 lg:aspect-none w-full overflow-hidden rounded-md  group-hover:opacity-75">
          <Image
            width={200}
            height={200}
            src={product?.image.src}
            alt={product?.image.alt}
            className="h-full w-full object-contain object-center lg:h-full lg:w-full"
          />
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
          <p className="text-sm font-medium text-gray-900">
            Rs.{product.price}
          </p>
        </div>
        <button
          onClick={() => addToCart({ ...product, qty: 1 })}
          className="mx-auto mt-4 block w-4/5 rounded-xl bg-blue-950 px-4 py-2 text-center text-sm font-semibold text-white"
        >
          Add To Cart
        </button>
      </div>
    )
  );
};

export default ProductCard;
