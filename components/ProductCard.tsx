import { RootState } from "@/app/global/store";
import { useGlobalContext } from "@/hooks/AppContext";
import { Product } from "@/types/product";
import { Star, StarHalf, StarIcon, StarOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Rating from "./Rating";
function shortenTitle(title: string, maxWords = 4) {
  if(!title)
    return;
  const words = title.split(" "); // Split the title into words
  if (words.length <= maxWords) {
    return title; // Return the title if it's already short
  }
  return words.slice(0, maxWords).join(" "); // Take the first maxWords words and join them
}

const getMinimumPrice = (product: Product): number => {
  // Collect product price and variant prices into one array
  const prices = [...product.variants.map((variant) => variant.price)];

  // Return the minimum price
  return Math.min(...prices);
};

const getMaxDiscount = (product: Product): number => {
  // Collect discounts from product and variants
  const discounts = [product.discount, ...product.variants.map((variant) => variant.discount)];

  // Return the maximum discount
  return Math.max(...discounts);
};


const ProductCard = ({ product }: { product: Product }) => {
  console.log(product)
  const { addToCart } = useGlobalContext() as any;
  return (
    product && (
      <div key={product._id} className="relative overflow-hidden rounded-lg p-2">
        {getMaxDiscount(product) > 0 &&
          <span className="font-bold absolute  md:left-2 md:top-2 top-1 left-1 text-green-500 bg-green-50 text-xs md:text-sm p-1 md:p-2">{Math.ceil(getMaxDiscount(product))}% OFF</span>
        }
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
        <div className="mt-1 md:mt-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm !font-semibold text-gray-700">
              <Link href={`/products/${product.slug}`}>
                {shortenTitle(product.title, 3)}
              </Link>
            </h3>
          </div>
          <div className="mt-4 flex justify-between">
            <p className="mt-1 text-xs text-gray-500">{product.category}</p>
            <p className="text-xs md:text-sm !font-semibold text-gray-900">
              Rs.{getMinimumPrice(product)}
            </p>
          </div>
          <div className="flex gap-1 items-center text-xs mt-2">
            <span className="text-gray-500">({product.noOfReviews}) Reviews</span>
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
                freeDelivery: product.freeDelivery
              })
            }
            className="mt-2 md:mt-4 mx-auto block w-full rounded-xl bg-blue-950 p-4 text-center text-xs md:text-sm font-semibold text-white"
          >
            Add To Cart
          </button>
        </div>
      </div>
    )
  );
};

export default ProductCard;
