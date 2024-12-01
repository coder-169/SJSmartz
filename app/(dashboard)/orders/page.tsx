"use client";

import { formatCurrency } from "@/lib/utils";
import { Order } from "@/types/product";
import { Loader } from "lucide-react";
import { set } from "mongoose";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const btns = [
  "All",
  "Pending",
  "Completed",
  "Processing",
  "Shipped",
  "Canceled",
  "Returned",
];
const Orders = () => {
  const [filter, setFilter] = useState("All");
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const getAllOrders = async () => {
    try {
      const res = await fetch("/api/user/order", {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          userId: (await getSession())?.user?._id || "",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setFiltered(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error("Error fetching orders");
    }
  };
  const handleFilter = (filter: string) => {
    setFilter(filter);
    if (filter === "All") {
      return setOrders(orders);
    }
    const newOrders = orders.filter(
      (order: Order) => order.status.toLowerCase() === filter.toLowerCase(),
    );
    setFiltered(newOrders);
  };
  useEffect(() => {
    getAllOrders();
  }, [status]);
  return status === "loading" ? (
    <div className="flex h-screen items-center justify-center">
      <Loader className="animate-spin duration-200 repeat-infinite" />
    </div>
  ) : (
    <div className="mx-auto my-32 w-4/5">
      <h1 className="py-4 text-center text-2xl">Orders</h1>
      <ul className="flex flex-wrap justify-between px-24 py-4">
        {btns.map((btn) => {
          return (
            <li key={btn}>
              <button
                onClick={() => handleFilter(btn)}
                className={`${filter === btn ? "border-b-blue-950 font-semibold" : "border-b-transparent"} border-b-2 p-2 transition-all duration-200 ease-in hover:border-b-blue-800`}
              >
                {btn}
              </button>
            </li>
          );
        })}
      </ul>
      {filtered.length === 0 ? (
        <div className="flex h-[50vh] items-center justify-center">
          <h1 className="text-xl font-semibold text-gray-500">
            No orders found
          </h1>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-black/20 bg-white p-4">
          <div className="grid w-full grid-cols-6">
            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">ID</h3>
            </div>
            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">Items</h3>
            </div>

            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">Payment</h3>
            </div>
            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">Status</h3>
            </div>
            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">Amount</h3>
            </div>
            <div className="col-span-1">
              <h3 className="text-md font-semibold text-gray-500">
                Payment Method
              </h3>
            </div>
          </div>
          {filtered.map((order: Order) => {
            return (
              <div
                key={order._id}
                className="my-4 grid w-full grid-cols-6 text-sm"
              >
                <div className="col-span-1">
                  <Link
                    className="text-blue-800 transition-all duration-200 hover:text-blue-600"
                    href={`/orders/${order._id}`}
                  >
                    {order._id.slice(0, 10)}...
                  </Link>
                </div>
                <div className="col-span-1">{order.products.length}</div>

                <div className="col-span-1">
                  {order.payment.toLowerCase() === "pending" ? (
                    <span className="rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium uppercase text-[#FFC107]">
                      Pending
                    </span>
                  ) : order.payment.toLowerCase() === "paid" ? (
                    <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium uppercase text-[#28A745]">
                      Paid
                    </span>
                  ) : (
                    <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium uppercase text-[#DC3545]">
                      Unpaid
                    </span>
                  )}
                </div>
                <div className="col-span-1">
                  {order.status.toLowerCase() === "pending" ? (
                    <span className="rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium uppercase text-[#FFC107]">
                      Pending
                    </span>
                  ) : order.status.toLowerCase() === "processing" ? (
                    <span className="rounded-lg bg-orange-100 px-2 py-1 text-xs font-medium uppercase text-[#FD7E14]">
                      Processing
                    </span>
                  ) : order.status.toLowerCase() === "shipped" ? (
                    <span className="rounded-lg bg-blue-100 px-2 py-1 text-xs font-medium uppercase text-[#007BFF]">
                      Shipped
                    </span>
                  ) : order.status.toLowerCase() === "completed" ? (
                    <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium uppercase text-[#28A745]">
                      Completed
                    </span>
                  ) : order.status.toLowerCase() === "canceled" ? (
                    <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium uppercase text-[#DC3545]">
                      Canceled
                    </span>
                  ) : (
                    <span className="rounded-lg bg-purple-100 px-2 py-1 text-xs font-medium uppercase text-[#6F42C1]">
                      Returned
                    </span>
                  )}
                </div>
                <div className="col-span-1">
                  {formatCurrency(order.totalPayment)}
                </div>
                <div className="col-span-1 text-center">
                  {order.paymentMethod}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
