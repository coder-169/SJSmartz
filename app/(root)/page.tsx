"use client";
// package
import Link from "next/link";
import Image from "next/image";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import Button from "@/ui/button";
import Heading from "@/ui/head";
import Text from "@/ui/text";
import {
  ArrowRightIcon,
  CallIcon,
  DeliveryIcon,
  LockIcon,
  MoneyIcon,
} from "@/ui/assets/svg";

// data
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../global/store";
import { loadProducts } from "../global/Reducers/ProductReducer";
import { Coins } from "lucide-react";

export default function Home() {
  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  const getProducts = async () => {
    await fetch("/api/user/product")
      .then((res) => res.json())
      .then((data) => {
        // setProducts(data.products);
        dispatch(
          loadProducts({
            noOfProducts: data.products.length,
            products: data.products,
          }),
        );
        // console.log(data);
      });
    // setLoading(false);
  };
  const { list: products, loading } = useSelector(
    (state: RootState) => state.products,
  );
  const dispatch = useDispatch();
  console.log(products, loading);
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      {/* Hero section */}
      <SectionLayout
        bg=""
        className="flex h-[110vh] flex-col items-center justify-between bg-[url('/images/hero-1.jpg')] bg-cover bg-no-repeat lg:grid lg:grid-cols-2 lg:pt-8"
      >
        <div className="hidden"></div>
      </SectionLayout>
      {/* Shop collection section */}
      <SectionLayout>
        <div className="space-y-4 px-8 py-10 sm:space-y-8 md:space-y-12">
          <Heading
            as="h2"
            intent="base-section"
            className="text-center md:text-left"
          >
            Shop Collection
          </Heading>

          <div className="grid grid-cols-1 place-items-center gap-4 sm:grid-cols-2 lg:h-[560px]">
            {/* Main collection */}
            <div className="relative aspect-[0.8/1] min-h-[377px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:row-span-2 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-2.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[80%] -translate-y-[10%] object-center md:w-[60%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Headphones
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Another collection */}
            <div className="relative aspect-[1/0.5] min-h-[180px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-4.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[50%] translate-x-1/2 md:w-[40%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Earbuds
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Another collection */}
            <div className="relative aspect-[1/0.5] min-h-[180px] w-full min-w-[311px] bg-[#F3F5F7] p-8 sm:aspect-auto sm:h-full sm:min-w-0">
              <div className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden">
                <Image
                  src="/images/sumplekuping-5.png"
                  width={262}
                  height={349}
                  alt="background collection"
                  className="aspect-[0.75/1] w-[50%] translate-x-1/2 md:w-[40%]"
                />
              </div>

              <div className="relative flex h-full flex-col justify-end gap-2">
                <Heading as="h3" intent="collection-card">
                  Accessories
                </Heading>
                <Link href="/shop" className="w-fit">
                  <span className="flex w-fit items-center gap-1 border-b border-[#121212]">
                    Collection{" "}
                    <ArrowRightIcon stroke="#121212" className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionLayout>
      {/* Best seller section */}
      <SectionLayout>
        <div className="space-y-4 px-8 py-10 sm:space-y-8 md:space-y-12 lg:pb-24">
          <Heading
            as="h2"
            intent="base-section"
            className="text-center md:text-left"
          >
            Best Seller
          </Heading>

          <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-8 xl:grid-cols-5">
            {products.map((product: any, index: number) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </SectionLayout>
      {/* Promotion section */}
      <div className="grid overflow-hidden md:grid-cols-2 lg:h-full lg:max-h-[500px] lg:place-items-center">
        {/* <div className="w-full justify-end bg-gray-400 md:flex">
          <Image
            src="/images/promotion-card.png"
            width={1250}
            height={1080}
            alt="promotion-card"
            className="h-auto w-full object-cover lg:w-[460px]"
          />
        </div> */}

        {/* <div className="order-1 w-full bg-[#ffdd99] md:order-2">
          <div className="w-full max-w-[720px] space-y-6 p-8">
            <div className="space-y-4">
              <Text weight={700} transform="uppercase" color="blue">
                promotion
              </Text>
              <Heading as="h2" intent="base-section">
                Hurry up! 40% OFF
              </Heading>
              <Text size="sm">Thousands of high tech are waiting for you</Text>
            </div>
            <div className="space-y-3">
              <Text>Offer expires in:</Text>
              <div className="flex gap-4">
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-white">
                    <Text
                      size="3xl"
                      weight={500}
                      family="poppins"
                      color="black/800"
                    >
                      02
                    </Text>
                  </div>
                  <Text size="xs" color="black/800" className="text-center">
                    Days
                  </Text>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-white">
                    <Text
                      size="3xl"
                      weight={500}
                      family="poppins"
                      color="black/800"
                    >
                      12
                    </Text>
                  </div>
                  <Text size="xs" color="black/800" className="text-center">
                    Hours
                  </Text>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-white">
                    <Text
                      size="3xl"
                      weight={500}
                      family="poppins"
                      color="black/800"
                    >
                      45
                    </Text>
                  </div>
                  <Text size="xs" color="black/800" className="text-center">
                    Minutes
                  </Text>
                </div>
                <div className="w-fit">
                  <div className="flex h-[60px] w-[60px] items-center justify-center bg-white">
                    <Text
                      size="3xl"
                      weight={500}
                      family="poppins"
                      color="black/800"
                    >
                      05
                    </Text>
                  </div>
                  <Text size="xs" color="black/800" className="text-center">
                    Seconds
                  </Text>
                </div>
              </div>
            </div>
            <Button fontSize="sm" className="py-1.5 md:text-base">
              Shop now
            </Button>
          </div>
        </div> */}
      </div>
      {/* Features section */}
      <SectionLayout>
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 p-8 md:grid-cols-4 lg:gap-6 lg:py-10">
          <div className="space-y-4 rounded-3xl bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <DeliveryIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Free Shipping
              </Text>
              <Text size="sm" color="gray">
                Order above 4000PKR
              </Text>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <Coins className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Cash-back
              </Text>
              <Text size="sm" color="gray">
                cash in form of coins{" "}
              </Text>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <LockIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                Secure Payments
              </Text>
              <Text size="sm" color="gray">
                Crypto and Bank Transfer
              </Text>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl bg-[#F3F5F7] px-4 py-8 lg:px-8 lg:py-12">
            <CallIcon className="h-12 w-12" />
            <div className="space-y-1 md:space-y-2">
              <Text
                size="sm"
                weight={600}
                family="poppins"
                color="black/800"
                className="lg:text-xl"
              >
                24/7 Support
              </Text>
              <Text size="sm" color="gray">
                Phone and Email support
              </Text>
            </div>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}
