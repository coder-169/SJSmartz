"use client";
// package
import { notFound } from "next/navigation";
import { Loader2, MinusIcon, PlusIcon } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// lib
import { formatCurrency } from "@/lib/utils";

// ui
import { MoneyIcon, StarIcon, WishlistIcon } from "@/ui/assets/svg";
import Button from "@/ui/button";
import ProductSlider from "@/ui/slider/productSlider";
import ProductTab from "@/app/(subroot)/products/productTab";
import ProductVariant from "@/app/(subroot)/products/productVariant";
import ProductRecommendation from "@/app/(subroot)/products/productRecommendation";
import { Product, Variant } from "@/types/product";
import Offer from "@/components/Offer";
import { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { CiMoneyBill } from "react-icons/ci";
import { useGlobalContext } from "@/hooks/AppContext";
import toast from "react-hot-toast";
import ReviewSection from "@/components/Reviews";
import Rating from "@/components/Rating";

function formatDeliveryDate(r1: number, r2: number) {
  const now = new Date(); // Get current date and time
  const dt1 = new Date(now.getTime() + r1 * 24 * 60 * 60 * 1000); // Calculate future date
  const dt2 = new Date(now.getTime() + r2 * 24 * 60 * 60 * 1000); // Calculate future date
  const dr1 = dt1.toLocaleString("en-US", {
    day: "numeric",
  });
  const dr2 = dt2.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
  });
  return dr1 + " - " + dr2.split(" ").reverse().join(" ");
}
function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}
export default function Page({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(product?.variants[0] as Variant);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { incrementQty, decrementQty, removeFromCart } = useGlobalContext() as {
    incrementQty: (title: string) => void;
    decrementQty: (title: string) => void;
    removeFromCart: (title: string) => void;
  };
  const [qty, setQty] = useState(1);
  const { addToCart } = useGlobalContext();
  const getProductById = async () => {
    try {
      const res = await fetch(
        `/api/products?slug=` + params.slug,
      );

      if (res.status === 404) return notFound();
      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      setProduct(data.product);
      setSelectedVariant(data.product.variants[0]);
      setRelatedProducts(data.relatedProducts);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleAddQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  const handleMinusQty = () => {
    if (qty > 1) setQty((prevQty) => prevQty - 1);
  };
  useEffect(() => {
    getProductById();
    document.title = 'SJ Smartz ' + capitalize(params.slug.split('-').join(' ')) || "Product";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return product && !loading ? (
    <SectionLayout>
      <div className="mx-auto space-y-6 p-8 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(min-content,_400px)_1fr_280px]">
          <div className="relative h-full w-full">
            <ProductSlider images={product.images} />
          </div>

          <div className="mx-auto max-w-[420px] md:max-w-[520px] lg:max-w-none">
            <div className="space-y-4 border-b border-[#E8ECEF] pb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  <Rating rating={product.rating} />
                </div>

                <span className="font-inter text-xs font-normal text-[#141718]">
                  {product?.noOfReviews} Reviews
                </span>
              </div>

              <h1 className="font-poppins text-2xl font-medium text-[#141718]">
                {product.title}
              </h1>


              <p className="font-poppins text-[28px] font-medium text-[#141718]">
                <span className="align-middle">

                  {selectedVariant &&
                    selectedVariant.discount > 0 ?
                    formatCurrency(
                      Math.round(selectedVariant.price -
                        (selectedVariant.price * selectedVariant.discount) /
                        100)) : formatCurrency(selectedVariant.price)
                  }
                </span>
                {selectedVariant && selectedVariant.discount > 0 ?
                  <span className="ml-3 align-middle text-xl text-[#6C7275] line-through decoration-2">
                    {selectedVariant.price}
                  </span> : ""
                }
              </p>
            </div>

            {/* <Offer /> */}

            <div className="space-y-6 py-6">
              {/* <div className="space-y-2">
                <p className="font-inter text-base font-semibold text-[#6C7275]">
                  Measurements
                </p>
                <p className="font-inter text-xl font-normal text-[#141718]">
                  17 1/2x20 5/8
                </p>
              </div> */}

              {selectedVariant && (
                <ProductVariant
                  selected={selectedVariant}
                  setSelected={setSelectedVariant}
                  variants={product?.variants}
                />
              )}
            </div>

            {/* <div className="space-y-4 border-b border-[#E8ECEF] py-6 lg:hidden">
              <div className="flex h-10 gap-2 lg:h-[52px]">
                <div className="flex h-full w-1/2 items-center justify-between rounded bg-[#F5F5F5] px-2 md:w-3/5 lg:px-4">
                  <MinusIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-5 lg:w-6"
                  />
                  <span className="font-inter text-sm font-semibold text-[#141718] lg:text-base">
                    1
                  </span>
                  <PlusIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-5 lg:w-6"
                  />
                </div>

                <Button
                  variant="ghost"
                  width="full"
                  className="flex h-full items-center justify-center gap-2 rounded border border-[#141718]"
                >
                  <WishlistIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-6 lg:w-6"
                  />
                  <span className="font-inter text-sm font-medium text-[#141718] lg:text-base">
                    Wishlist
                  </span>
                </Button>
              </div>

              <Button
                width="full"
                fontSize="sm"
                className="h-10 rounded lg:h-[52px] lg:text-base"
              >
                Add to Cart
              </Button>
            </div> */}

            <div className="space-y-2 pt-6">
              {/* <div className="grid grid-cols-[100px_1fr] font-inter text-xs lg:grid-cols-[140px_1fr] lg:text-sm">
                <span className="text-[#6C7275]">SKU</span>
                <span className="text-[#141718]">1117</span>
              </div> */}
              <p className="font-inter text-base font-normal text-[#6C7275]">
                {product.description}
              </p>

              <div className="grid grid-cols-[100px_1fr] font-inter text-xs lg:grid-cols-[140px_1fr] lg:text-sm">
                <span className="text-[#6C7275]">CATEGORY</span>
                <span className="text-[#141718]">
                  {
                    <span className="after:ml-0.5 after:mr-1 after:content-[','] last:after:mx-0 last:after:content-['']">
                      {product.category}
                    </span>
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="h-fit space-y-4">
            <div className="flex-col gap-8 rounded border border-[#E8ECEF] p-4 lg:flex">
              <div className="space-y-2">
                <p className="font-poppins font-semibold text-[#141718]">
                  Quantity
                </p>
                <div className="flex items-end justify-between">
                  <p className="font-inter text-sm text-[#6C7275]">Subtotal</p>
                  <div className="space-y-1 text-right">
                    <p className="font-inter text-sm text-[#6C7275] line-through">

                      {selectedVariant &&
                        selectedVariant.discount > 0 ? formatCurrency(qty * selectedVariant.price)
                        : ""
                      }
                    </p>
                    <p className="font-poppins text-xl font-semibold text-[#141718]">
                      {selectedVariant &&
                        selectedVariant.discount > 0 ?
                        formatCurrency(
                          qty * Math.round(selectedVariant.price -
                            (selectedVariant.price * selectedVariant.discount) /
                            100)) : formatCurrency(qty * selectedVariant.price)
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex h-10 items-center justify-between rounded bg-[#F5F5F5] px-2 lg:px-4">
                  <button onClick={() => handleMinusQty()}>
                    <MinusIcon
                      stroke="#141718"
                      className="h-4 w-4 lg:h-5 lg:w-6"
                    />
                  </button>
                  <span className="font-inter text-sm font-semibold text-[#141718]">
                    {qty}
                  </span>
                  <button
                    disabled={qty >= 5}
                    className="disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={() => handleAddQty()}
                  >
                    <PlusIcon
                      stroke="#141718"
                      className="h-4 w-4 lg:h-5 lg:w-6"
                    />
                  </button>
                </div>
                {/* <Button
                  variant="ghost"
                  width="full"
                  className="flex h-10 items-center justify-center gap-2 rounded border border-[#141718]"
                >
                  <WishlistIcon stroke="#141718" className="h-4 w-4" />
                  <span className="font-inter text-sm font-medium text-[#141718]">
                    Wishlist
                  </span>
                </Button> */}
                <Button
                  onClick={() =>
                    addToCart({
                      ...product,
                      ...selectedVariant,
                      qty,
                    })
                  }
                  width="full"
                  fontSize="sm"
                  className="h-10 rounded"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            <div className="hidden h-fit flex-col gap-8 rounded border border-[#E8ECEF] p-4 lg:flex">
              <div className="space-y-2">
                <p className="font-poppins font-semibold text-[#141718]">
                  Delivery Options
                </p>
                <div className="!mt-8 space-y-4">
                  <div className="flex items-center gap-2 space-y-1">
                    {/* < className="w-4 h-4"/> */}
                    <CiMoneyBill className="h-6 w-6 font-bold" />
                    <p className="font-inter text-sm text-[#262626]">
                      Cash on Delivery Available
                    </p>
                  </div>
                  <div className="flex items-center gap-2 space-y-1">
                    {/* < className="w-4 h-4"/> */}
                    <CiDeliveryTruck className="h-6 w-6 font-bold" />
                    <div>
                      <p className="font-inter text-sm text-[#262626]">
                        Standard Delivery
                      </p>
                      <small className=" text-xs text-[#716b6b]">
                        Guaranteed By {formatDeliveryDate(4, 7)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <ProductTab tabs={product.tabs} /> */}
        {/* <ProductRecommendation products={relatedProducts}/> */}
        <ReviewSection rating={product.rating} reviews={product.reviews} />
      </div>
    </SectionLayout>
  ) : (
    <SectionLayout>
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 size={40} className="animate-spin duration-300 repeat-infinite" />
      </div>
    </SectionLayout>
  );
}
