"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Field from "../components/Field";
import { Order } from "@/types/product";
import { useGlobalContext } from "@/hooks/AppContext";
import Image from "next/image";
import Link from "next/link";
import { createSlug, formatCurrency } from "@/lib/utils";
import Loader from "@/components/Loader";

const Page = ({ params }: { params: { id: string } }) => {
  const [order, setOrder] = useState<Order>();
  const { cartItems } = useGlobalContext() as any;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const getOrder = async () => {
    const resp = await fetch("/api/user/order", {
      headers: new Headers({
        userId: session?.user?._id || "",
        orderId: params.id,
      }),
    });
    const data = await resp.json();

    console.log(data);
    if (data.success) {
      setOrder(data.order);
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  };
  const updateOrder = async () => {
    setLoading(true);
    const resp = await fetch("/api/user/order", {
      method: "PUT",
      body: JSON.stringify({ status: "Canceled" }),
      headers: new Headers({
        userId: session?.user?._id || "",
        orderId: params.id,
      }),
    });
    const data = await resp.json();
    console.log(data);
    if (data.success) {
      setOrder(data.order);
      toast.success("Order Canceled Successfully");
    } else {
      toast.error(data.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return loading ? (
    <Loader />
  ) : (
    <div className="mx-auto my-16 w-4/5">
      <h1 className="py-4 text-center text-3xl font-bold">
        Order #{params.id}
      </h1>
      <div className="mb-8 rounded-2xl bg-gray-50 p-4">
        <div className="space-y-6 rounded-md p-6">
          <div>
            {cartItems?.map((item: any) => (
              <OrderItem key={item.id} data={item} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-1/2 space-y-2 rounded-2xl bg-gray-50 p-4">
          <h2 className="mb-4 text-2xl font-medium">Order Details</h2>
          <Field name="Delivery Date" value={order?.deliveryDate || ""} />
          <Field
            name="Payment Status"
            value={order?.payment || ""}
            orderId={order?._id}
          />
          <Field name="Order Status" value={order?.status || ""} />
          <Field name="Payment Method" value={order?.paymentMethod || ""} />
          <Field
            name="Amount"
            value={formatCurrency(order?.totalPayment || 0) || ""}
          />
        </div>
        <div className="w-1/2 space-y-2 rounded-2xl bg-gray-50 p-4">
          <h2 className="mb-4 text-2xl font-medium">Customer Details</h2>
          <Field
            name="Name"
            value={order?.user?.first_name + " " + order?.user?.last_name || ""}
          />
          <Field name="Email" value={order?.user.email || ""} />
          <Field name="Phone" value={order?.user.phone || ""} />
          <Field
            name="Address"
            value={
              order?.address.address_line +
                ", " +
                order?.address.city +
                ", " +
                order?.address.state +
                ", " +
                order?.address.postal_code || ""
            }
          />
        </div>
      </div>
      {order?.status.toLowerCase() === "pending" && (
        <button
          onClick={updateOrder}
          className="m-4 mx-auto mt-8 block w-1/4  rounded-xl bg-blue-950 p-4 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-900"
        >
          Cancel Order
        </button>
      )}
      {order?.status.toLowerCase() === "canceled" && (
        <button
          disabled={true}
          className="m-4 mx-auto mt-8 block w-1/4  cursor-not-allowed rounded-xl bg-blue-950 p-4 text-center text-sm font-semibold text-white opacity-70 transition-all duration-300 hover:bg-blue-900"
        >
          Canceled
        </button>
      )}
    </div>
  );
};
type OrderItem = {
  _id: string;
  image: string;
  title: string;
  qty: number;
  price: number;
  color: string;
};

const OrderItem = ({ data }: { data: OrderItem }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-[#E8ECEF] py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="h-[80px] min-w-[80px] bg-[#F3F5F7] md:h-[80px] md:min-w-[80px]">
          <Image
            src={data.image}
            alt={data.title}
            width={200}
            height={250}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-full space-y-2">
          <div className="flex items-start justify-between gap-8">
            <Link
              href={`/products/${createSlug(data.title)}`}
              className="line-clamp-1 font-inter text-sm font-semibold text-[#141718] sm:line-clamp-2 md:w-2/3"
            >
              {data.title}
            </Link>
            <p className="hidden min-w-max font-inter text-sm font-semibold text-[#141718] sm:block">
              {data.qty} x {data.price}
            </p>
          </div>

          <p className="font-inter text-sm font-semibold text-[#141718] sm:hidden">
            {data.qty} x {data.price}
          </p>

          <p className="font-inter text-xs font-normal text-[#6C7275]">
            Color: {data.color}
          </p>

          {/* <div className="hidden sm:block">
              <DeliveryOption />
            </div> */}
        </div>
      </div>

      {/* <div className="sm:hidden">
          <DeliveryOption />
        </div> */}
    </div>
  );
};

export default Page;
