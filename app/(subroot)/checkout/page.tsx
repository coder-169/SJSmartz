"use client";
// package
import { ChevronLeft, MapPin, Option } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import { DiscountIcon } from "@/ui/assets/svg";
// import PaymentMethod from "@/app/(subroot)/checkout/checkoutPaymentMethod";
import CheckoutOrders from "@/app/(subroot)/checkout/checkoutOrders";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import Button from "@/components/ui/button";
import Input from "@/components/form/input";
import BtnLoader from "@/components/BtnLoader";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function Page() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const createOrder = async () => {
    try {
      setLoading(true);
      const { address_line, city, state, postal_code } = values;
      const res = await fetch("/api/user/order", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          products: JSON.parse(localStorage.getItem("sjsmartz-cart-items")!),
          address: { postal_code, state, address_line, city },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setOrderPlaced(true);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error:any) {}
  };
  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const updateAddress = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    console.log(values);
  };
  const { status, data: session } = useSession();
  return (
    <SectionLayout className="relative px-8 py-20">
      <div className="absolute left-8 top-4 inline-flex items-center gap-1 align-baseline lg:hidden">
        <ChevronLeft stroke="#605F5F" className="h-3 w-3" />
        <p className="font-inter text-sm font-medium text-[#605F5F]">back</p>
      </div>
      <div className="space-y-6 pb-20 lg:space-y-10">
        <h1 className="text-center font-poppins text-[40px] font-medium text-[#141718]">
          Check Out
        </h1>
        <div className="flex items-center justify-center gap-4 align-baseline">
          <p className="relative line-clamp-1 pr-4 font-inter text-sm font-medium text-[#38CB89] before:absolute before:right-0 before:content-['/']">
            <span className="mr-2 hidden h-6 w-6 items-center justify-center rounded-full bg-[#38CB89] font-inter text-xs text-white md:inline-flex">
              1
            </span>
            Shopping cart
          </p>
          <p
            className={`relative line-clamp-1 pr-4 font-inter text-sm font-medium ${orderPlaced ? "text-[#38CB89]" : "text-[#141718]"}  before:absolute before:right-0 before:content-['/']`}
          >
            <span
              className={`mr-2 hidden h-6 w-6 items-center justify-center rounded-full ${orderPlaced ? "bg-[#38CB89]" : "bg-[#141718]"} font-inter text-xs text-white md:inline-flex`}
            >
              2
            </span>
            Checkout details
          </p>

          <p
            className={`relative line-clamp-1 pr-4 font-inter text-sm font-normal before:absolute before:right-0 before:content-['/'] last:before:content-[''] ${orderPlaced ? "text-[#38CB89]" : "text-[#605F5F]"}`}
          >
            <span
              className={`${orderPlaced ? "bg-[#38CB89]" : "bg-[#605F5F]"} mr-2 hidden h-6 w-6 items-center justify-center rounded-full  font-inter text-xs text-white md:inline-flex`}
            >
              3
            </span>
            Order complete
          </p>
        </div>
      </div>
      {orderPlaced ? (
        <div className="mx-auto w-4/5 md:w-3/5">
          <h3 className="mb-4 text-center text-2xl font-bold">
            Thanks! Your Ordered Placed Successfully
          </h3>
          <h3 className="mb-4 text-center text-xl font-bold">Total 2500PKR</h3>
          <div className="space-y-6">
            <CheckoutOrders />
          </div>
        </div>
      ) : (
        <div className="grid gap-y-6 lg:grid-cols-[2fr_1fr] lg:gap-x-8 xl:gap-x-16">
          <div className="space-y-6">
            <div className="space-y-6 rounded-md border border-[#6C7275] p-6">
              <p className="font-poppins text-lg font-semibold text-[#141718]">
                Shipping Address
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin stroke="#141718" className="h-4 w-4" />
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    House
                  </p>
                </div>

                <p className="font-inter text-sm font-normal text-[#6C7275]">
                  {!open && (
                    <>
                      {values.address_line +
                        ", " +
                        values.city +
                        ", " +
                        values.state +
                        ", " +
                        values.postal_code}
                    </>
                  )}
                </p>

                <button
                  onClick={() => setOpen(true)}
                  className="h-10 rounded-md bg-[#141718] px-6 font-inter text-sm font-normal text-white"
                >
                  Change Address
                </button>
              </div>
            </div>

            <CheckoutOrders />

            {/* <PaymentMethod /> */}
          </div>

          <div className="h-fit space-y-6">
            <div className="space-y-6 rounded-md border border-[#6C7275] p-6">
              <p className="font-poppins text-lg font-semibold text-[#141718]">
                Order Summary
              </p>

              <div className="flex gap-3">
                <input
                  className="h-10 w-full rounded-md border border-[#6C7275] px-4 font-inter text-sm font-normal text-[#141718] outline-none placeholder:text-[#6C7275] placeholder:opacity-100"
                  placeholder="Coupon code"
                />
                <button className="h-10 w-fit rounded-md bg-[#141718] px-6 font-inter text-sm font-medium text-white">
                  Apply
                </button>
              </div>

              <div>
                <div className="flex justify-between border-b border-[#6C7275] py-3">
                  <div className="flex items-center gap-2">
                    <DiscountIcon fill="#141718" className="h-6 w-6" />
                    <p className="line-clamp-1 font-inter text-sm font-normal text-[#141718]">
                      JenkateMW
                    </p>
                  </div>

                  <p className="font-inter text-sm font-semibold text-[#38CB89]">
                    -$25.00 [Remove]
                  </p>
                </div>

                <div className="flex items-center justify-between py-3">
                  <p className="font-inter text-sm font-normal text-[#141718]">
                    Shipping
                  </p>
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    Free
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="font-inter text-sm font-normal text-[#141718]">
                    Subtotal
                  </p>
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    $99.00
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="font-poppins text-lg font-semibold text-[#141718]">
                    Total
                  </p>
                  <p className="font-poppins text-lg font-semibold text-[#141718]">
                    $234.00
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={createOrder}
              disabled={loading}
              className="h-10 w-full rounded-md bg-[#141718] px-10 font-inter text-sm font-medium text-white disabled:opacity-70 lg:h-[50px] lg:text-base"
            >
              {loading ? (
                <>
                  Placing Order
                  <BtnLoader />{" "}
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      )}
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-32 py-32 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <form
                onSubmit={updateAddress}
                className={cn([
                  "w-full",
                  "flex flex-col gap-4 lg:justify-center",
                  "w-full px-8 py-4",
                ])}
              >
                <div className="space-y-6">
                  <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                    <Input
                      intent="secondary"
                      type="text"
                      placeholder="Address line"
                      name="address_line"
                      value={values.address_line}
                      onChange={handleValueChange}
                      autoComplete="off"
                    />
                  </div>
                  <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                    <Input
                      intent="secondary"
                      type="text"
                      placeholder="State"
                      name="state"
                      value={values.state}
                      autoComplete="off"
                      onChange={handleValueChange}
                    />
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="w-1/2 border-b border-[#E8ECEF] pb-2 transition-all duration-200 focus-within:border-[#141718]">
                      <Input
                        intent="secondary"
                        type="text"
                        placeholder="City"
                        name="city"
                        autoComplete="off"
                        value={values.city}
                        onChange={handleValueChange}
                      />
                    </div>
                    <div className="w-1/2 border-b border-[#E8ECEF] pb-2 transition-all duration-200 focus-within:border-[#141718]">
                      <Input
                        intent="secondary"
                        type="text"
                        placeholder="Postal/Zip Code"
                        name="postal_code"
                        autoComplete="off"
                        value={values.postal_code}
                        onChange={handleValueChange}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  disabled={loading}
                  width="full"
                  type="submit"
                  className="relative mt-12 py-2.5 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="">
                      Updating
                      <BtnLoader classes={`!absolute !top-2 !right-4`} />
                    </span>
                  ) : (
                    "Change"
                  )}
                </Button>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </SectionLayout>
  );
}
