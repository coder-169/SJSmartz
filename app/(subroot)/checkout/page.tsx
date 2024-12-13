"use client";
// package
import { ChevronLeft, Loader2, MapPin, Option, PlusCircle } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// ui
import { DiscountIcon } from "@/ui/assets/svg";
import PaymentMethod from "@/app/(subroot)/checkout/checkoutPaymentMethod";
import CheckoutOrders from "@/app/(subroot)/checkout/checkoutOrders";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Button from "@/components/ui/button";
import Input from "@/components/form/input";
import BtnLoader from "@/components/BtnLoader";
import { cn, formatCurrency } from "@/lib/utils";
import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { useGlobalContext } from "@/hooks/AppContext";
import Link from "next/link";
import Address from "@/models/Address";
import { useRouter } from "next/navigation";
// import PaymentMethod from "@/components/PaymentMethod";

export default function Page() {
  const { status, data: session } = useSession();
  const [selectedPayment, setSelectedPayment] = useState("binance");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [recName, setRecName] = useState('')
  const [recContact, setRecContact] = useState('')
  const { cartItems } = useGlobalContext() as any;
  const [values, setValues] = useState({
    address_line: "",
    city: "",
    state: "",
    area: "",
  });
  const [order, setOrder] = useState({ _id: '', totalPayment: 3 });
  const getProds = () => {
    // const cartItems = localStorage.getItem("sjsmartz-cart-items")
    //   ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
    //   : [];
    let val = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.check) {
        if (item.freeDelivery) {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty));

        } else {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty) + (item.qty * 200));
        }
      }
    }
    return { val, cartItems };
  }
  const createOrder = async () => {
    if (status === 'unauthenticated')
      return toast.error('Login to Checkout')
    if (session?.user && session.user.isVerified === false)
      return toast.error('Verify your email to checkout')
    try {
      if (values.address_line === '' || values.city === '' || values.state === '' || values.area === '' || recName === '' || recContact === '')
        return toast.error('Receiver Information is Required!')
      setLoading(true);
      const products = []
      const { cartItems, val } = getProds()
      for (let i = 0; i < cartItems.length; i++) {
        const element = cartItems[i];
        if (element.check) {
          products.push(element)
        }
      }
      const json = JSON.stringify({
        products,
        address: values,
        fullName: recName,
        contact: recContact,
        totalPayment: val,
        userId: session?.user?._id,
        paymentMethod: selectedPayment === 'binance' ? 'Binance Pay' : 'Bank Transfer',
        coupon,
      });
      const res = await fetch("/api/user/order", {
        method: "POST",
        body: json,
      });
      const dt = await res.json();
      if (dt.success) {
        toast.success(dt.message);
        setOrder(dt.order);
        setOrderPlaced(true);
        localStorage.removeItem('sjsmartz-cart-items')
        if (selectedPayment === "binance") {
          toast.loading("Redirecting you to checkout");
          const { data } = await axios.post("/api/user/order/payment", {
            data: JSON.stringify({
              orderId: dt.order._id,
              fees: dt.order.totalPayment,
              ...JSON.parse(json),
            }),
          });
          window.location.href = data.checkoutUrl;
        }
      } else {
        toast.error(dt.message);
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const handleValueChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target.value)
    console.log(e.target)
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const createAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const resp = await fetch("/api/user/profile/address", {
        method: "post",
        body: JSON.stringify({ ...values, userId: session?.user?._id }),
      });
      const data = await resp.json();
      if (data.success) {
        toast.success("New Address Added");
      } else {
        toast.error(data.message);
      }
      setOpen(false);
      setAddLoading(false);
    } catch (error) { }
  };
  const updateAddress = async () => {
    setAddLoading(true);
    try {
      const resp = await fetch("/api/user/profile/address", {
        method: "PUT",
        body: JSON.stringify({ ...values, userId: session?.user?._id }),
      });
      const data = await resp.json();
      if (data.success) {
        toast.success("Address updated");
      } else {
        toast.error(data.message);
      }
      setOpen(false);
      setAddLoading(false);
    } catch (error) { }
    // session = await getSession();
  };
  const [editAddress, setEditAddress] = useState<boolean>(false);
  const clickEditModal = async (address: any) => {
    setValues(address);
    setEditAddress(true);
    setOpen(true);
  };
  const [coupon, setCoupon] = useState({ value: "", discount: 0 });
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [applyingCoupon, setApplyingCoupon] = useState<boolean>(false);
  const clientSideDiscount = (coupon: any) => {

    setCoupon({ value: coupon.couponCode, discount: coupon.discount });
  };
  const getTotal = () => {
    // const items = localStorage.getItem("sjsmartz-cart-items")
    //   ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
    //   : [];
    let val = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.check) {
        if (item.freeDelivery) {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty));

        } else {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty) + (item.qty * 200));
        }
      }
    }
    const subTt = getSubTotal()
    if (subTt > 4000) {
      const discount = (coupon.discount / 100) * subTt;
      return subTt - discount;
    } else {
      const discount = Math.round((coupon.discount / 100) * val);
      return val - discount;
    }
    // return 1;
  }
  const getSubTotal = () => {
    // const items = localStorage.getItem("sjsmartz-cart-items")
    //   ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
    //   : [];
    let val = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.check) {
        if (item.freeDelivery) {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty));
        } else {
          val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty) + (item.qty * 200));
        }
      }
    }
    return val
  }
  const calculateShipping = () => {
    // const items = localStorage.getItem("sjsmartz-cart-items")
    //   ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
    //   : [];
    let val = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      if (item.check) {
        if (!item.freeDelivery) {
          val += item.qty * 200;
        }
      }
    }
    return val
  }
  const applyCoupon = async () => {
    if (coupon.value === "") return toast.error("Please enter code!");
    setApplyingCoupon(true);
    try {
      const resp = await fetch("/api/user/order/coupon", {
        method: "post",
        body: JSON.stringify({ coupon: coupon.value }),
      });
      const data = await resp.json();
      if (data.success) {
        toast.success(data.message);
        setCouponApplied(true);
        clientSideDiscount(data.coupon);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    setApplyingCoupon(false);
  };
  const removeCoupon = async () => {
    setCouponApplied(false);
    setCoupon({ value: "", discount: 0 });
    calculateSubtotal();
  };
  const [subTotal, setSubtotal] = useState(0);
  const { cartItems: cart } = useGlobalContext() as any;
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const calculateSubtotal = () => {
    // const cartItems = localStorage.getItem("sjsmartz-cart-items")
    //   ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
    //   : [];
    let val = 0;
    let val2 = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      val += item.price * item.qty;
      val2 += item.qty * 200;
    }
    setSubtotal(val);
    setTotal(val + val2);
    setShipping(val2);
  };


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
          <Link
            href="/cart"
            className="relative line-clamp-1 pr-4 font-inter text-sm font-medium text-[#38CB89] before:absolute before:right-0 before:content-['/']"
          >
            <span className="mr-2 hidden h-6 w-6 items-center justify-center rounded-full bg-[#38CB89] font-inter text-xs text-white md:inline-flex">
              1
            </span>
            Shopping cart
          </Link>
          <Link
            href={"/checkout"}
            className={`relative line-clamp-1 pr-4 font-inter text-sm font-medium ${orderPlaced ? "text-[#38CB89]" : "text-[#141718]"}  before:absolute before:right-0 before:content-['/']`}
          >
            <span
              className={`mr-2 hidden h-6 w-6 items-center justify-center rounded-full ${orderPlaced ? "bg-[#38CB89]" : "bg-[#141718]"} font-inter text-xs text-white md:inline-flex`}
            >
              2
            </span>
            Checkout details
          </Link>

          <p
            className={`relative line-clamp-1 cursor-pointer pr-4 font-inter text-sm font-normal before:absolute before:right-0 before:content-['/'] last:before:content-[''] ${orderPlaced ? "text-[#38CB89]" : "text-[#605F5F]"}`}
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
            <br />#{order?._id}
          </h3>
          <h3 className="mb-4 text-center text-xl font-bold">Total {formatCurrency(order?.totalPayment)}</h3>
          {selectedPayment === 'cod' ? "" : <div className="my-8 space-y-4 rounded-md border border-[#6C7275] p-6">
            <div className="flex gap-2">
              <h3 className="w-1/3 font-bold">Bank</h3>
              <span>Meezan Bank Limited</span>
            </div>
            <div className="flex gap-2">
              <h3 className="w-1/3 font-bold">Account Title</h3>
              <span>Sajid Ali</span>
            </div>
            <div className="flex gap-2">
              <h3 className="w-1/3 font-bold">IBAN</h3>
              <span>PK70MEZN0000300107944717</span>
            </div>
            <div className="flex gap-2">
              <h3 className="w-1/3 font-bold">Account Number </h3>
              <span>00300107944717</span>
            </div>

            <p className="mt-4 text-center text-sm">
              Transfer {formatCurrency(order?.totalPayment)} and upload Screenshot to your
              order
            </p>
          </div>}
          <div className="space-y-6">
            <CheckoutOrders />
          </div>
        </div>
      ) : (
        <div className="grid gap-y-6 lg:grid-cols-[2fr_1fr] lg:gap-x-8 xl:gap-x-16">
          <div className="space-y-6">
            {/* <div className="space-y-6 rounded-md border border-[#6C7275] p-6">
              <h4 className="font-poppins text-lg font-semibold text-[#141718]">
                Shipping Address
              </h4>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin stroke="#141718" className="h-4 w-4" />
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    House
                  </p>
                </div>

                {session?.user?.addresses?.length! > 0 ? (
                  <div>
                    {session?.user?.addresses.map((address: any) => {
                      return (
                        <div
                          key={address._id}
                          className="flex items-center justify-between"
                        >
                          <p className="font-inter text-sm font-normal text-[#6C7275]">
                            {!open && (
                              <>
                                {address.address_line +
                                  ", " +
                                  address.city +
                                  ", " +
                                  address.state +
                                  ", " +
                                  address.area}
                              </>
                            )}
                          </p>
                          <button
                            className="text-sm font-medium text-[#141718]"
                            onClick={() => clickEditModal(address)}
                          >
                            Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="font-inter text-sm font-normal text-[#6C7275]">
                      No Addresses
                    </p>
                    <button
                      onClick={() => setOpen(true)}
                      className="rounded-md bg-[#141718] px-2 py-2 font-inter text-xs font-normal text-white"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                )}
                {session?.user?.addresses?.length! <= 0 && (
                  <button
                    onClick={() => setOpen(true)}
                    className="h-10 rounded-md bg-[#141718] px-6 font-inter text-sm font-normal text-white"
                  >
                    Add Address
                  </button>
                )}
              </div>
            </div> */}
            <div>
              <h4 className="font-poppins mb-2 text-lg font-semibold text-[#141718]">
                Receiver Info
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">

                  <input
                    className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={recName}
                    onChange={(e) =>
                      setRecName(e.target.value)
                    }
                    placeholder="Full Name"
                  />
                </div>
                <div className="col-span-1">

                  <input
                    className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={recContact}
                    onChange={(e) =>
                      setRecContact(e.target.value)
                    }
                    placeholder="Phone"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={values.address_line}
                    onChange={handleValueChange}
                    placeholder="Address Line"
                    name='address_line'
                  />
                </div>
                <div className="col-span-1">

                  <select
                    onChange={(e) => handleValueChange(e)} name='state' value={values.state} className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]">
                    <option value={''} >Select State</option>
                    {states.map((state: { value: string, label: string }) => {
                      return <option key={state.value} value={state.value} >{state.label}</option>
                    })}
                  </select>
                </div>
                <div className="col-span-1">
                  <select
                    onChange={(e) => handleValueChange(e)} name='city' value={values.city} className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]">
                    <option value={''} >Select City</option>
                    {(cities[values.state as keyof typeof cities] || []).map((city) => {
                      return <option key={city} value={city} >{city}</option>
                    })}

                  </select>

                </div>
                <div className="col-span-1">
                  <input
                    className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={values.area}
                    onChange={handleValueChange}
                    placeholder="Area"
                    name='area'
                  />
                </div>
              </div>
            </div>
            <CheckoutOrders />
          </div>

          <div className="h-fit space-y-6">
            <PaymentMethod
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />
            <div className="space-y-6 rounded-md border border-[#6C7275] p-6">
              <p className="font-poppins text-lg font-semibold text-[#141718]">
                Order Summary
              </p>

              {!couponApplied && (
                <div className="flex gap-3">
                  <input
                    className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={coupon.value}
                    onChange={(e) =>
                      setCoupon({ ...coupon, value: e.target.value })
                    }
                    placeholder="Coupon code"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={applyingCoupon}
                    className="flex h-10 w-fit items-center gap-1 rounded-md bg-[#141718] px-6 font-inter text-sm font-medium text-white disabled:opacity-50"
                  >
                    {!applyingCoupon ? (
                      "Apply"
                    ) : (
                      <>
                        Applying
                        <Loader2 size={24} className="animate-spin" />
                      </>
                    )}
                  </button>
                </div>
              )}

              <div>
                {couponApplied && (
                  <div className="flex justify-between border-b border-[#6C7275] py-3">
                    <div className="flex items-center gap-2">
                      <DiscountIcon fill="#141718" className="h-6 w-6" />
                      <p className="line-clamp-1 font-inter text-sm font-normal text-[#141718]">
                        {coupon.value}
                      </p>
                    </div>

                    <button
                      onClick={removeCoupon}
                      className="font-inter text-sm font-semibold text-[#38CB89]"
                    >
                      {coupon.discount}% OFF [Remove]
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <p className="font-inter text-sm font-normal text-[#141718]">
                    Shipping
                  </p>
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    {getSubTotal() < 4000 ? calculateShipping() || 0 : 'Free Shipping'}

                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="font-inter text-sm font-normal text-[#141718]">
                    Subtotal
                  </p>
                  <p className="font-inter text-sm font-semibold text-[#141718]">
                    {formatCurrency(getSubTotal())}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <p className="font-poppins text-lg font-semibold text-[#141718]">
                    Total
                  </p>
                  <p className="font-poppins text-lg font-semibold text-[#141718]">
                    <span className="pr-2 text-sm text-[#212425] line-through opacity-80">
                      {couponApplied ? formatCurrency(getSubTotal() + calculateShipping()) : ""}
                      {!couponApplied && getSubTotal() > 4000 ? (getSubTotal() + calculateShipping()) : ""}
                    </span>
                    <span>
                      {formatCurrency(getTotal())}
                    </span>
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
                <span className="flex items-center gap-2">
                  Placing Order
                  <Loader2 size={20} />{" "}
                </span>
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
              className="relative transform overflow-hidden rounded-lg bg-white px-6 py-8 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <form
                onSubmit={createAddress}
                className={cn([
                  "w-full",
                  "flex flex-col gap-4 lg:justify-center",
                  "w-full px-8 py-4",
                ])}
              >
                <div className="space-y-6">
                  <div className="pb-2">
                    <Input
                      intent="secondary"
                      type="text"
                      placeholder="Address line"
                      name="address_line"
                      value={values.address_line}
                      onChange={handleValueChange}
                      autoComplete="off"
                      className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    />
                  </div>
                  <div className="pb-2">
                    <Input
                      intent="secondary"
                      type="text"
                      placeholder="State"
                      name="state"
                      value={values.state}
                      autoComplete="off"
                      onChange={handleValueChange}
                      className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    />
                  </div>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="pb-2">
                      <Input
                        intent="secondary"
                        type="text"
                        placeholder="City"
                        name="city"
                        autoComplete="off"
                        value={values.city}
                        onChange={handleValueChange}
                        className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                      />
                    </div>
                    <div className="pb-2">
                      <Input
                        intent="secondary"
                        type="text"
                        placeholder="Postal/Zip Code"
                        name="area"
                        autoComplete="off"
                        value={values.area}
                        onChange={handleValueChange}
                        className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                      />
                    </div>
                  </div>
                </div>

                {!editAddress ? (
                  <Button
                    disabled={addLoading}
                    width="full"
                    type="submit"
                    className="relative mx-auto mt-12 block w-1/2 py-2.5 disabled:opacity-60"
                  >
                    {addLoading ? (
                      <span className="">
                        Adding
                        <BtnLoader classes={`!absolute !top-2 !right-4`} />
                      </span>
                    ) : (
                      "Add"
                    )}
                  </Button>
                ) : (
                  <Button
                    disabled={addLoading}
                    width="full"
                    type="button"
                    onClick={() => updateAddress()}
                    className="relative mx-auto mt-12 block w-1/2 py-2.5 disabled:opacity-60"
                  >
                    {addLoading ? (
                      <span className="">
                        Updating
                        <BtnLoader classes={`!absolute !top-2 !right-4`} />
                      </span>
                    ) : (
                      "Update"
                    )}
                  </Button>
                )}
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </SectionLayout>
  );
}

const cities = {
  kashmir: [
    "Athmuqam",
    "Bagh",
    "Barnala",
    "Bhimber",
    "Chak Swari",
    "Dadyal",
    "Fatehpur",
    "Hajira",
    "Hattian Bala",
    "Islamgarh",
    "Jandala",
    "Jing",
    "Kalyal",
    "Kotli",
    "Mangla",
    "Mirpur A.K",
    "Muzafarabad",
    "Pallandri",
    "Rawalakot",
  ],
  islamabad: [
    "Islamabad – Airport New Societies",
    "Islamabad - Ali Pur",
    "Islamabad - B - 17",
    "Islamabad - Bahria Enclave",
    "Islamabad - Bahria Town",
    "Islamabad - Banni Gaala",
    "Islamabad - Bhara Kahu",
    "Islamabad - Chak Shahzad",
    "Islamabad - Chatta Bakhtawar",
    "Islamabad - D - 12",
    "Islamabad - D - 13",
    "Islamabad - D - 17",
    "Islamabad - DHA",
    "Islamabad - E - 10",
    "Islamabad - E - 11",
    "Islamabad - E - 18",
    "Islamabad - E - 7",
    "Islamabad - E - 8",
    "Islamabad - E - 9",
    "Islamabad - F - 10",
    "Islamabad - F - 11",
    "Islamabad - F - 17",
    "Islamabad - F - 5",
    "Islamabad - F - 6",
    "Islamabad - F - 7",
    "Islamabad - F - 8",
    "Islamabad - G - 10",
    "Islamabad - G - 11",
    "Islamabad - G - 12",
    "Islamabad - G - 13",
    "Islamabad - G - 14",
    "Islamabad - G - 15",
    "Islamabad - G - 5",
    "Islamabad - G - 6",
    "Islamabad - G - 7",
    "Islamabad - G - 8",
    "Islamabad - G - 9",
    "Islamabad - Ghauri Town",
    "Islamabad - Gulberg",
    "Islamabad - H - 10",
    "Islamabad - H - 11",
    "Islamabad - H - 12",
    "Islamabad - H -13",
    "Islamabad - H - 15",
    "Islamabad - H - 8",
    "Islamabad - H - 9",
    "Islamabad - I - 10",
    "Islamabad - I - 11",
    "Islamabad - I - 12",
    "Islamabad - I - 14",
    "Islamabad - I - 16",
    "Islamabad - I - 8",
    "Islamabad - I - 9",
    "Islamabad - Jhangi Syedian",
    "Islamabad - Jinnah Garden",
    "Islamabad - PWD",
    "Islamabad - Rawal Town",
    "Islamabad - Sihala",
    "Islamabad - Soan Garden",
    "Islamabad - Sohan",
    "Islamabad - Tarlai Kalan",
    "Islamabad - Tarnol",
  ],
  balochistan: [
    "Awaran",
    "Barkhan",
    "Chaman",
    "Dalbandin",
    "Dera Allahyar",
    "Dera Bugti",
    "Dera Murad Jamali",
    "Dhadar",
    "Gwadar",
    "Harnai",
    "Hub",
    "Jafarabad",
    "Kallat",
    "Kanozai",
    "Kharan",
    "Khuzdar",
    "Kohlu",
    "Kuchlak",
    "Lasbela",
    "Loralai",
    "Mastung",
    "Miri Kalat Kech",
    "Muslim Bagh",
    "Nushki",
    "Panj Gur",
    "Pasni",
    "Pishin",
    "Qila Abdullah",
    "Qila Saifullah",
    "Quetta - Airport",
    "Quetta - Alamdar Road",
    "Quetta - Bazaar Area",
    "Quetta - Brewery Road",
    "Quetta - Cantt",
    "Quetta - Nawakilli",
    "Quetta - Pishin Stop",
    "Quetta - Samungli",
    "Quetta - Sariab",
    "Quetta - Sattlite Town",
    "Quetta - Zarghoon Road",
    "Sibbi",
    "Sorab",
    "Sui",
    "Taftan",
    "Turbat",
    "Usta Mohammad",
    "Uthal",
    "Winder",
    "Zhob",
    "Zia Abad",
    "Ziarat",
  ],
  gilgit_baltistan: [
    "Chilas",
    "Gamba Skardu",
    "Gilgit",
    "Hunza",
    "Khaplu",
    "Skardu",
  ],
  khyber_pakhtun_khuwa: [
    "Abbottabad",
    "Abdara",
    "Aboha",
    "Akora Khattak",
    "Alpuri",
    "Aman Dara",
    "Aman Kot",
    "Bakshi Pul",
    "Bala Garhi",
    "Balakot",
    "Bannu",
    "Bara - Khyber Agency",
    "Bari Kot",
    "Bashir Abad",
    "Bat Khela",
    "Batrasi",
    "Battagram",
    "Buner",
    "Chak Dara",
    "Chamkani",
    "Char Bagh",
    "Charsadda",
    "Chitral",
    "D.I.Khan",
    "Dakota",
    "Dargai",
    "Dingi",
    "Dir",
    "Gadoon",
    "Gandaf",
    "Garhi Habibullah",
    "Garlat Balakot",
    "Ghazi",
    "Gujjar Garhi",
    "Gumbad Maria",
    "Gurmani",
    "Hangu",
    "Haripur",
    "Hattar",
    "Havelian",
    "Islampur",
    "Jalala",
    "Jamal Garhi",
    "Jamrud - Khyber Agency",
    "Jehangira",
    "Kamalia",
    "Kangra",
    "Karak",
    "Karnal Sher Kallay",
    "Katlang",
    "Khairabad",
    "Khushhal Kot",
    "Khwazakhela",
    "Kohat",
    "Kotla Mohsin Khan",
    "Kund",
    "Lachi",
    "Lakki Marwat",
    "Landikotal - Khyber Agency",
    "Malakand",
    "Malikabad",
    "Malikpura",
    "Mandian",
    "Mangora",
    "Mansehra",
    "Manyar",
    "Mardan",
    "Marghazar",
    "Matta",
    "Mingora",
    "Mouza Muhammad Khan",
    "Nissata",
    "Nizampur",
    "Nowshera",
    "Pabbi",
    "Pakhwal",
    "Panr",
    "Para Chinar",
    "Peshawar - Cantt",
    "Peshawar - Charsadda Road",
    "Peshawar - Dalazak Road",
    "Peshawar - GT Road Area",
    "Peshawar - Hayatabad",
    "Peshawar - Kohat Road",
    "Peshawar - Nasir Bagh",
    "Peshawar - Old City",
    "Peshawar - Pajjaggi Road",
    "Peshawar - Ring Road",
    "Peshawar - Saddar",
    "Peshawar - University Road",
    "Peshawar - Warsak Road",
    "Pir Piay",
    "Potha",
    "Qaboola Sharif",
    "Qalander Abad",
    "Qaldara",
    "Ranjai",
    "Rashakai",
    "Rawlakot",
    "Risalpur",
    "Sangota",
    "Sarae Norang",
    "Sathi Town",
    "Seni Gumbat",
    "Ser Dheri",
    "Shabqadar",
    "Shagai",
    "Shangla Hill",
    "Shirin Kotay",
    "Sobra City",
    "Swabi",
    "Swat",
    "Tajori",
    "Talash",
    "Tank",
    "Tappi",
    "Terbela Ghazi",
    "Timergera",
    "Topi",
    "Toru",
    "Totakan",
    "Umarzai",
    "Upper Dir",
    "Wazir Bagh",
  ],
  punjab: [
    "Abdul Hakim",
    "Adamke Cheema",
    "Adam Wehain",
    "Ahmadpur East",
    "Ahsanpur",
    "Alam Garh",
    "Alipur",
    "Ali Pur Chattha",
    "Allahabad",
    "Amara Kalan",
    "Aminabad",
    "Arif Wala",
    "Aroop Town",
    "Attock",
    "Attowala",
    "Awagat",
    "Baddomalhi",
    "Badiana",
    "Baglow Yatimwala",
    "Bagrianwala",
    "Bagwal Awan",
    "Bahawal Garh",
    "Bahawalnagar",
    "Bahawalpur - Baghdad Ul Jadeed",
    "Bahawalpur - Bindra Pulli",
    "Bahawalpur - Cantt",
    "Bahawalpur - Central Jail",
    "Bahawalpur - Chak",
    "Bahawalpur - Fauji Basti",
    "Bahawalpur - Model Town",
    "Bahawalpur - Old City",
    "Bahawalpur - Sadiq Colony",
    "Bahawalpur - Satellite Town",
    "Bahawalpur - Shadrah",
    "Bahawalpur - University Chowk",
    "Barian",
    "Barjah",
    "Baseerpur",
    "Bazurgwal",
    "Begowal",
    "Behal",
    "Bewal",
    "Bhabra",
    "Bhaddar",
    "Bhagtanwala",
    "Bhakkar",
    "Bhakoki",
    "Bhaun",
    "Bhawana",
    "Bhera",
    "Bhong",
    "Bhopalwala",
    "Bhowanj",
    "Bhung",
    "Bhurban",
    "Bhurch",
    "Biddar Marjan",
    "Bindi",
    "Bonga Hayyat",
    "Burewala",
    "Chachran Sharif",
    "Chakanwali",
    "Chak Dhillu",
    "Chak Gillan",
    "Chak Khalaas",
    "Chak Pindi",
    "Chakrian",
    "Chak Sadda",
    "Chakwal",
    "Changa Manga",
    "Chashma",
    "Chawinda",
    "Chechian",
    "Cheenab Nagar",
    "Chela",
    "Cheni Nikowani",
    "Chichawatni",
    "Chillianwala",
    "Chiniot",
    "Chiryawala",
    "Chishtian",
    "Chitti Sheikhan",
    "Chopala",
    "Choti",
    "Chowk Maitla",
    "Chowk Munda",
    "Chund Bharwana",
    "Cod Kala",
    "D.G Khan",
    "Dahranwala",
    "Daira Din Panah",
    "Daiwal",
    "Dajal",
    "Dalowali",
    "Dandot",
    "Daska",
    "Daud Khel",
    "Daultala",
    "Depalpur",
    "Dera Bakha",
    "Dera Faridi",
    "Dera Taj",
    "Dhannot",
    "Dhodak",
    "Dhool Khurd",
    "Dhoria",
    "Dhudial",
    "Dhunni",
    "Dijkot",
    "Dilawar Cheema",
    "Dina",
    "Dinga",
    "Din Garh",
    "Dodah",
    "Domel",
    "Domeli",
    "Dukki",
    "Dunga Bunga",
    "Dunyapur",
    "Duranpur",
    "Faisalabad - Chak",
    "Faisalabad Chak - Jhumra",
    "Faisalabad - Dasuha",
    "Faisalabad - Ghanta Ghar Market",
    "Faisalabad - Ghulam Muhammad Abad",
    "Faisalabad - GT Road",
    "Faisalabad - Jail Road",
    "Faisalabad - Jaranwala Road",
    "Faisalabad - Jhang Road",
    "Faisalabad - Jhumra Road",
    "Faisalabad - Khurianwala",
    "Faisalabad - Millat Road",
    "Faisalabad - Narwala Road",
    "Faisalabad - Samundri Road",
    "Faisalabad - Sargodha Road",
    "Faisalabad - Satayana Road",
    "Faisalabad - West Canal",
    "Faizabad",
    "Faqirwali",
    "Farooqa",
    "Fateh Jang",
    "Fazil Pur",
    "Feroz Watan",
    "Fortabbas",
    "Fort Abbas",
    "Gagoo Mandi",
    "Gailywal",
    "Gakhar Chanan",
    "Garh Maharaja",
    "Garh More",
    "Garjakh",
    "Ghakka Mitter",
    "Ghakkar",
    "Ghaniaan",
    "Gharial",
    "Ghazipur",
    "Ghunike",
    "Gillanwala",
    "Gohad Pur",
    "Gojra - Toba Tek Singh",
    "Gondal",
    "Gopalpur",
    "Gujar Khan",
    "Gujranwala - Canal View Housing Scheme",
    "Gujranwala - Citi Housing",
    "Gujranwala - City Area",
    "Gujranwala - Civil Lines",
    "Gujranwala - DC Colony",
    "Gujranwala - Fareed Town",
    "Gujranwala - Garden Town",
    "Gujranwala - G Magnolia Park",
    "Gujranwala - Gondla Wala Bazaar",
    "Gujranwala - Green Valley",
    "Gujranwala - Gulzar Colony",
    "Gujranwala - Guru Nanakpura",
    "Gujranwala - Industrial Estate 1",
    "Gujranwala - Industrial Estate 2",
    "Gujranwala - Jagna",
    "Gujranwala - Master City Housing Scheme",
    "Gujranwala - Model Town",
    "Gujranwala - Mohalla Noor Bawa",
    "Gujranwala - Peoples Colony",
    "Gujranwala - Quaid E Azam Town",
    "Gujranwala - Rahwali",
    "Gujranwala - Rahwali Cantonment",
    "Gujranwala - Satellite Town",
    "Gujranwala - Shaheenabad",
    "Gujranwala - Shalimar Town",
    "Gujranwala - University Town",
    "Gujranwala - Wapda Town",
    "Gujrat - Jalalpur Jattan",
    "Gujrat - Kunjah",
    "Gujrat - Main City",
    "Gujrat - Shadiwal",
    "Gullen Khel",
    "Gunna",
    "Hafizabad",
    "Haji Wala",
    "Harappa",
    "Hardas Pur",
    "Haroonabad",
    "Hasilpur",
    "Hassan Abdal",
    "Haveli Lakha",
    "Hazro",
    "Hidayatabad",
    "Hujra Shah Muqeem",
    "Hussain Abad",
    "Ikhlasgarh",
    "Iskandarabad",
    "Jahanian",
    "Jalal Pur Bhattian",
    "Jalalpur Pirwala",
    "Jamal Din Wali",
    "Jamalpur",
    "Jampur",
    "Jand",
    "Jaranwala",
    "Jasarwala",
    "Jaurah",
    "Jhairanwala",
    "Jhal Chakian",
    "Jhang",
    "Jhawarian",
    "Jhelum",
    "Jhewranwali",
    "Joharabad",
    "Kabirwala",
    "Kahror Pakka",
    "Kahuta",
    "Kalabagh",
    "Kallar Sayedan",
    "Kaloor Kot",
    "Kamalia",
    "Kamar Mushani",
    "Kamoke",
    "Kamra",
    "Karianwala",
    "Karim Daad",
    "Karimpura",
    "Karmabad",
    "Kasur",
    "Khairpur Tamewali",
    "Khambi",
    "Khan Bella",
    "Khanewal",
    "Khan Garh",
    "Khanpur",
    "Khanqah Dogran",
    "Khanqah Sharif",
    "Kharian",
    "Khaur",
    "Khawaja Gunj",
    "Khewra",
    "Khojianwali",
    "Khurianwala",
    "Khushab",
    "Kot Addu",
    "Kot Chandna",
    "Kot Fateh Din",
    "Kotha",
    "Kot Haleem Khan",
    "Kot Khizri",
    "Kotla Arab Ali Khan",
    "Kotli Loharan",
    "Kot Mithan",
    "Kot Momin",
    "Kot Nakka",
    "Kot Qutab",
    "Kot Rada Kishan",
    "Kundian",
    "Kung Bhudu",
    "Lahore - Agrics",
    "Lahore - Ali Raza Abad",
    "Lahore - Ali Town",
    "Lahore - Askari",
    "Lahore - Badami Bagh",
    "Lahore - Baghbanpura",
    "Lahore - Bahria Town",
    "Lahore - Barki",
    "Lahore - Barki Road",
    "Lahore - Bata Pur",
    "Lahore - Bedian",
    "Lahore - Bedian Road",
    "Lahore - Bhubtian",
    "Lahore - BOR Society",
    "Lahore - Canal City",
    "Lahore - Canal Garden",
    "Lahore - Cantt",
    "Lahore - Chaburji",
    "Lahore - China Scheme",
    "Lahore - Chung",
    "Lahore - Chungi Amer Sidhu",
    "Lahore - Daroghawala",
    "Lahore - DHA",
    "Lahore - DHA Rahbar",
    "Lahore - Dharampura",
    "Lahore - Eden",
    "Lahore - Eden Value Home",
    "Lahore - EME",
    "Lahore - Engineers Town",
    "Lahore - Faisal Town",
    "Lahore - Gajjumata",
    "Lahore - Garden Town",
    "Lahore - Garhi Shahu",
    "Lahore - Green Town",
    "Lahore - Gulberg",
    "Lahore - Gul-e-Daman",
    "Lahore - Gulshan-e-Ravi",
    "Lahore - Harbanspura",
    "Lahore - Iqbal Avenue",
    "Lahore - Iqbal Town",
    "Lahore - Islampura",
    "Lahore - Izmir Town",
    "Lahore - Jail Road",
    "Lahore - Jallo",
    "Lahore - Johar Town",
    "Lahore - Judicial Colony",
    "Lahore - Kahna",
    "Lahore - Kasoor Road",
    "Lahore - Khayaban-e-Jinnah Road",
    "Lahore - Kot Abdul Malik",
    "Lahore - Kot Lakh Pat",
    "Lahore - Lakshmi",
    "Lahore - Lawrence Road",
    "Lahore - LDA Avenue",
    "Lahore - Mall Road",
    "Lahore - Manawan",
    "Lahore - Manga Mandi",
    "Lahore - Mansoorah",
    "Lahore - Maraka",
    "Lahore - Military Accounts",
    "Lahore - Model Town",
    "Lahore - Mozang",
    "Lahore - Mughulpura",
    "Lahore - Muhafiz Town",
    "Lahore - Nespak",
    "Lahore - P&D Colony",
    "Lahore - Pak Arab Society",
    "Lahore - PCSIR Staff Colony",
    "Lahore - PIA Road PGECHS",
    "Lahore - PIA Society",
    "Lahore - Punjab Society",
    "Lahore - Qainchi",
    "Lahore - Railway Station",
    "Lahore - Rajpoot Town",
    "Lahore - River View Society",
    "Lahore - Sabzazar",
    "Lahore - Saddar",
    "Lahore - Saggian",
    "Lahore - Salamat Pura",
    "Lahore - Samnabad",
    "Lahore - Sanda",
    "Lahore - Shad Bagh",
    "Lahore - Shadman",
    "Lahore - Shahdra",
    "Lahore - Shahpur Kanjra",
    "Lahore - Shalimar Town",
    "Lahore - Shamkay Bhattian",
    "Lahore - Sharqpur Road",
    "Lahore - Sitara Colony",
    "Lahore - Sukh Chain Garden",
    "Lahore - Sundar Sharif",
    "Lahore - Thokar Canal Road",
    "Lahore - Thokar Multan Road",
    "Lahore - Thokar Niaz Baig",
    "Lahore - Town Ship",
    "Lahore - Triocon Village",
    "Lahore - Upper Mall",
    "Lahore - Valencia",
    "Lahore - Wahdat Road",
    "Lahore - Walled City",
    "Lahore - Walton",
    "Lahore - Wapda Town",
    "Lahore - Yateem Khana",
    "Lak Mor",
    "Lala Musa",
    "Lalian",
    "Langrial",
    "Layyah",
    "Liaquatpur",
    "Lodhran",
    "Lower Barian",
    "Lower Topa",
    "Luddhan",
    "Machiwala",
    "Mailsi",
    "Makhdoompur",
    "Makiana",
    "Malakwal",
    "Malowal",
    "Mananwala",
    "Mandi Bhauddin",
    "Mandi Faiz Abad",
    "Mandra",
    "Mari Lak",
    "Mehmood Kot",
    "Mehrabad",
    "Mehray Wala",
    "Mian Channu",
    "Miani",
    "Mianwali",
    "Minchinabad",
    "Mirpur",
    "Mithalak",
    "Mitha Tiwana",
    "Mitran Wala",
    "Mitro",
    "Moazzamabad",
    "Moch",
    "Mona",
    "Mona Depot",
    "More Emin Abad",
    "Mubarakpur",
    "Muhammadpur",
    "Mulhal Mughlan",
    "Multan - Bahawalpur Road",
    "Multan - Basti Nawabpur",
    "Multan - Basti Qadirpur",
    "Multan - Bosan Road",
    "Multan - Cantonment",
    "Multan - Gulgasht",
    "Multan - Inner City",
    "Multan - Khanewal Road",
    "Multan - MDA",
    "Multan - Mumtazabad",
    "Multan - Muzaffargarh Bypass",
    "Multan - New Multan",
    "Multan - Northern Bypass",
    "Multan - Shershah",
    "Multan - Vehari Chowk",
    "Multan - Vehari Road",
    "Muradabad",
    "Murad Wala",
    "Mureed",
    "Muridke",
    "Murree",
    "Musakamala",
    "Muslimabad",
    "Mustafa Abad",
    "Muzaffargarh",
    "Nagrianwala",
    "Nandipur",
    "Nangal",
    "Nankana Sahib",
    "Nanohanda",
    "Narang Mandi",
    "Narowal",
    "Naseera",
    "Naudero",
    "Nawab Pur",
    "Nawan Jandanwala",
    "Nawan Kot",
    "Nawan Pind",
    "Niaz Nagar",
    "Nizamabad",
    "Noor Jamal",
    "Noor Kot",
    "Nowshera Virkan",
    "Okara - Cantt",
    "Okara - Central City",
    "Okara - Depalpur",
    "Okara - Govt Colony",
    "Okara - Jawad Avenue",
    "Okara - Main City",
    "Okara - Renala",
    "Padhrar",
    "Pakhowal",
    "Pak Pattan",
    "Pasroor",
    "Pattoki",
    "Phalia",
    "Phool Nagar",
    "Phularwan",
    "Pind Dadan Khan",
    "Pindi Bhattian",
    "Pindi Gheb",
    "Pindi Gujran",
    "Pir Ghani",
    "Pir Mahal",
    "Puran",
    "Qadir Abad",
    "Qadir Pur",
    "Qadir Pur Rawan",
    "Qaidabad",
    "Qasba Gujrat",
    "Qasim Pur",
    "Qila Didar Singh",
    "Qila Kalar Wala",
    "Qila Ram Rang",
    "Qila Sahib Singh",
    "Qilladar",
    "Qudratabad",
    "Rahimabad",
    "Rahim Yar Khan",
    "Raiwind",
    "Rajana",
    "Rajanpur",
    "Rajar",
    "Raj Kot",
    "Rana Wahan",
    "Ranbarrian Wala",
    "Rangoo",
    "Rang Shah",
    "Rani Pur",
    "Raniwal Syedan",
    "Ratta Bajwa",
    "Rawalpindi - Adyala",
    "Rawalpindi - Airport Society",
    "Rawalpindi - Bahria Town",
    "Rawalpindi - CBR Town",
    "Rawalpindi - Chaklala",
    "Rawalpindi - DHA",
    "Rawalpindi - Dhamyal",
    "Rawalpindi - Dhok Gangal",
    "Rawalpindi - Dhok Kala Khan",
    "Rawalpindi - Fizaiya Colony",
    "Rawalpindi - Gulraiz",
    "Rawalpindi - Humak",
    "Rawalpindi - IJP Road",
    "Rawalpindi - Khanna",
    "Rawalpindi - Kuri Road",
    "Rawalpindi - Lalkurti",
    "Rawalpindi - Lohi Bhair",
    "Rawalpindi - Media Town",
    "Rawalpindi - Muree Road",
    "Rawalpindi - Muslim Town",
    "Rawalpindi - National Police Foundation",
    "Rawalpindi - Pakistan Town",
    "Rawalpindi - Peshawar Road",
    "Rawalpindi - Raja Bazar",
    "Rawalpindi - Rawat",
    "Rawalpindi - Saddar",
    "Rawalpindi - Sadiqabad",
    "Rawalpindi - Satellite Town",
    "Rawalpindi - Tench",
    "Rehmat Abad",
    "Rolia",
    "Saddoki",
    "Sadiqabad",
    "Sagri",
    "Sahiwal",
    "Sahiwal Chota - Sargodha",
    "Sahuwala",
    "Sambrial",
    "Samma Satta",
    "Samundari",
    "Sanawan",
    "Sangla Hill",
    "Sapra Syedan",
    "Sarai Alamgir",
    "Sargodha",
    "Sargodha - Bhalwal",
    "Sargodha Chak - Nb Side",
    "Sargodha Chak - Sb Side",
    "Sargodha - Lalian",
    "Sargodha - Villages",
    "Shadan Lund",
    "Shahdara",
    "Shah Nal",
    "Shahpur",
    "Shahpur Jahania",
    "Shahpur Sadar",
    "Shakar Garh",
    "Shamaspur",
    "Sharaqpur Sharif",
    "Sheikhupura",
    "Sheikhupura - Farooqabad",
    "Sheikhupura - Safdarabad",
    "Sheikhupura-Villages",
    "Sheikhupura - Warburton",
    "Sherpur",
    "Shinka",
    "Shorkot",
    "Shujaabad",
    "Sialkot - Bijli Mohallah",
    "Sialkot - Cantonment",
    "Sialkot - City",
    "Sialkot - Haji Pura",
    "Sialkot - Imam Sahib",
    "Sialkot - Kashmiri Mohallah",
    "Sialkot - Rangpura",
    "Sialkot - Villages",
    "Sillanwali",
    "Sohawa",
    "Talagang",
    "Talwandi",
    "Tarbela Dam",
    "Taxila",
    "Tibba Sultanpur",
    "Tibbi Ghaus",
    "Toba Tek Singh",
    "Tulamba",
    "Uch Sharif",
    "Ugoki",
    "Upper Topa",
    "Vanjari",
    "Vehari",
    "Wagah",
    "Wagowal",
    "Wah",
    "Wah Cantt",
    "Waisa",
    "Wasu",
    "Wazirabad",
    "Yazman",
    "Yousaf Wala",
    "Zafar Wal",
    "Zahir Pir",
  ],
  sindh: [
    "Badin",
    "Bandhi",
    "Bangul Dero",
    "Bhanbore",
    "Bhan Saeead Abad",
    "Bhit Shah",
    "Chohar Jamali",
    "Dadu",
    "Daharki",
    "Daro",
    "Darya Khan Mari",
    "Daulatpur",
    "Daur",
    "Dhabeji",
    "Digri",
    "Diplo",
    "Dokri",
    "Garhi Khairo",
    "Gharo",
    "Ghaus Pur",
    "Ghotki",
    "Golarchi",
    "Guddu",
    "Hala",
    "Halani",
    "Hyderabad - Cantonment",
    "Hyderabad - Central City",
    "Hyderabad - Halanaka",
    "Hyderabad - Latifabad",
    "Hyderabad - Qasimabad",
    "Islamkot",
    "Jacobabad",
    "Jam",
    "Jamshoro",
    "Jhimpir",
    "Jhuddo",
    "Johi",
    "Kamber",
    "Kamber Ali Khan",
    "Kandhkot",
    "Kandiaro",
    "Karachi - Abyssinia Lines",
    "Karachi - Akhter Colony",
    "Karachi - Askari",
    "Karachi - Bahadurabad",
    "Karachi - Bahria Town",
    "Karachi - Baldia Town",
    "Karachi - Baloch Colony",
    "Karachi - Bhimpora",
    "Karachi - Bohra Pir",
    "Karachi - Bombay Bazar",
    "Karachi - BufferZone",
    "Karachi - Cantonment C.O.D",
    "Karachi - Cantonment Daud Pota Road",
    "Karachi - Cantonment FTC",
    "Karachi - Cantonment NHS",
    "Karachi - Cantonment PAF Base",
    "Karachi - Cantonment Railway Station",
    "Karachi - Cantonment Regent Plaza",
    "Karachi - Cantonment Shahra-e-Faisal",
    "Karachi - Civil Lines",
    "Karachi - Clifton",
    "Karachi - DHA",
    "Karachi - F.B Area",
    "Karachi - F.C Area",
    "Karachi - Firdous Colony",
    "Karachi - Garden",
    "Karachi - Gulistan-e-Johar",
    "Karachi - Gulshan-e-Hadeed",
    "Karachi - Gulshan-e-Iqbal",
    "Karachi - Gulshan-e-Maymar",
    "Karachi - Hawksbay",
    "Karachi - I.I Chundrigarh",
    "Karachi - Ittehad Town",
    "Karachi - Jacob Lines",
    "Karachi - Jamshed Road",
    "Karachi - Jodia Bazar",
    "Karachi - K.D.A Officers",
    "Karachi - Kagzi Bazar",
    "Karachi - Kakri Ground",
    "Karachi - Kamil Gali",
    "Karachi - Kemari",
    "Karachi - Khada Market",
    "Karachi - Kharadar",
    "Karachi - Khudadad Colony",
    "Karachi - Korangi",
    "Karachi - Landhi",
    "Karachi - Lee Market",
    "Karachi - Liaquatabad",
    "Karachi - Lines Area",
    "Karachi - Liyari",
    "Karachi - M.A Jinnah Road",
    "Karachi - Malir",
    "Karachi - Manghopir",
    "Karachi - Manora",
    "Karachi - Maripur",
    "Karachi - Mehmoodabad",
    "Karachi - Mithadar",
    "Karachi - Muhammad Ali Society",
    "Karachi - Muslimabad Society",
    "Karachi - Nanwara",
    "Karachi - Nazimabad",
    "Karachi - New Karachi",
    "Karachi - New Surjani",
    "Karachi - Nishter Road",
    "Karachi - North Karachi",
    "Karachi - North Nazimabad",
    "Karachi - Old City Area",
    "Karachi - Orangi Town",
    "Karachi - P.E.C.H.S",
    "Karachi - Pan Mandi",
    "Karachi - PIB Colony",
    "Karachi - Pipri Goth",
    "Karachi - Qayummabad",
    "Karachi - Ramswami",
    "Karachi - Ranchorline",
    "Karachi - S.I.T.E",
    "Karachi - Saddar",
    "Karachi - Scheme 33",
    "Karachi - Shabbirabad",
    "Karachi - Shadman Town",
    "Karachi - Shah Faisal Colony",
    "Karachi - Sher Shah",
    "Karachi - Sultanabad",
    "Karachi - Surjani",
    "Karampur",
    "Kashmore",
    "Khairpur Mir's",
    "Khairpur Nathan Shah",
    "Khipro",
    "Khoski",
    "Kot Ghulam Mohammad",
    "Kotri",
    "Kunri",
    "Larkana",
    "Machi Goth",
    "Matiari",
    "Matli",
    "Mehar",
    "Mehrabpur",
    "Mirokhan",
    "Mirpur Bathoro",
    "Mirpur Khas",
    "Mirpur Sakro",
    "Mithi",
    "Mohenjo Daro",
    "Moro",
    "Nasarpur",
    "Naukot",
    "Naushero Feroze",
    "Nawabshah",
    "New Saeedabad",
    "Ninda",
    "Nooriabad",
    "Pacca Chang",
    "Pangrio",
    "Panno Aqil",
    "Petaro",
    "Phulji Station",
    "Pir Jo Goth",
    "Qambar Shahdadkot",
    "Qazi Ahmad",
    "Radhan",
    "Ranipur",
    "Ratodero",
    "Rohri",
    "Sakrand",
    "Samaro",
    "Sanghar",
    "Sanjar Chang",
    "Sarhari",
    "Sehwan Sharif",
    "Shahdad Kot",
    "Shahdadpur",
    "Shaheed Benazirabad",
    "Shahpur Chakar",
    "Shikarpur",
    "Singhoro",
    "Sobho Dero",
    "Sujawal",
    "Sukkur",
    "Sultan Kot",
    "Talhar",
    "Tando Adam",
    "Tando Allahyar",
    "Tando Bagho",
    "Tando Gulam Ali",
    "Tando Jam",
    "Tando Muhammad Khan",
    "Tando Soomro",
    "Thana Bola Khan",
    "Thari Mirwah",
    "Thatta",
    "Thul",
    "Ubaouro",
    "Umarkot",
    "Waggan",
    "Warah",
  ],
  federally_administered_tribal_areas: [
    "Bajaur Agency",
    "Darra Adam Khel",
    "Miran Shah",
    "Thana Malakand Agency    ",
  ],
};

const states = [
  { label: "Azad Kashmir", value: "kashmir" },
  { label: "Balochistan", value: "balochistan" },
  { label: "Federally Administered Tribal Areas", value: "federally_administered_tribal_areas" },
  { label: "Gilgit Baltistan", value: "gilgit_baltistan" },
  { label: "Islamabad", value: "islamabad" },
  { label: "Khyber Pakhtunkhwa", value: "khyber_pakhtun_khuwa" },
  { label: "Punjab", value: "punjab" },
  { label: "Sindh", value: "sindh" },
];
