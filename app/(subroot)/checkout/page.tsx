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
        val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty) + (item.qty * 200));
      }
    }
    return { val, cartItems };
  }
  const createOrder = async () => {
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
        val += Math.round(((item.price - (item.price * item.discount / 100)) * item.qty) + (item.qty * 200));
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
        val += Math.round((item.price - (item.price * item.discount / 100)) * item.qty);
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
        val += item.qty * 200;
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

  const router = useRouter()

  if (status === "unauthenticated") return router.push("/");
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

                  <input
                    className="h-10 font-medium w-full rounded-md border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                    value={values.city}
                    name='city'
                    onChange={handleValueChange}
                    placeholder="City"
                  />
                </div>
                <div className="col-span-1">
                  <select
                    onChange={(e) => handleValueChange(e)} name='state' value={values.state} className="h-10 w-full rounded-md  font-medium border border-[#6C7275] px-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]">
                    <option value={''} >Select</option>
                    <option value={'Sindh'} >Sindh</option>
                    <option value={'Punjab'} >Punjab</option>
                    <option value={'Balochistan'} >Balochistan</option>
                    <option value={'Gilgit Baltistan'} >Gilgit-Baltistan</option>
                    <option value={'Khyber Pakhtunkhwa'} >Khyber Pakhtunkhwa</option>
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
