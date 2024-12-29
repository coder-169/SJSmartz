"use client";

import { formatCurrency } from "@/lib/utils";
import { Order, Refer } from "@/types/product";
import { Loader } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const btns = [
    "All",
    "Pending",
    "Completed",
    "Canceled",
];
const Orders = () => {
    const [filter, setFilter] = useState("All");
    const { data: session, status } = useSession();
    const [referrals, setReferrals] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const getAllOrders = async () => {
        try {
            const res = await fetch("/api/user/referrals", {
                method: "GET",
                headers: new Headers({
                    "Content-Type": "application/json",
                    userId: (await getSession())?.user?._id || "",
                }),
            });
            const data = await res.json();
            console.log(data)
            if (data.success) {
                setReferrals(data.refers);
                setFiltered(data.refers);
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
            return setReferrals(referrals);
        }
        const newOrders = referrals.filter(
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
            <h1 className="py-4 text-center text-2xl">Referrals</h1>
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
            {filtered?.length === 0 ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <h1 className="text-xl font-semibold text-gray-500">
                        No referrals found
                    </h1>
                </div>
            ) : (
                <div className="mt-8 rounded-xl border border-black/20 bg-white p-4">
                    <div className="grid w-full grid-cols-4">
                        <div className="col-span-1">
                            <h3 className="text-md font-semibold text-gray-500">User</h3>
                        </div>

                        <div className="col-span-1">
                            <h3 className="text-md font-semibold text-gray-500">Credits</h3>
                        </div>
                        <div className="col-span-1">
                            <h3 className="text-md font-semibold text-gray-500">Status</h3>
                        </div>
                        <div className="col-span-1">
                            <h3 className="text-md font-semibold text-gray-500">Created</h3>
                        </div>

                    </div>
                    {filtered?.map((refer: Refer) => {
                        return (
                            <div
                                key={refer._id}
                                className="my-4 grid w-full grid-cols-4 text-sm"
                            >

                                <div className="col-span-1">{refer.username}</div>
                                <div className="col-span-1">
                                    {refer.credits}
                                </div>
                                <div className="col-span-1">
                                    {refer.status === "pending" ? (
                                        <span className="rounded-lg bg-yellow-100 px-2 py-1 text-xs font-medium uppercase text-[#FFC107]">
                                            Pending
                                        </span>
                                    ) : refer.status === "completed" ? (
                                        <span className="rounded-lg bg-green-100 px-2 py-1 text-xs font-medium uppercase text-[#28A745]">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="rounded-lg bg-red-100 px-2 py-1 text-xs font-medium uppercase text-[#DC3545]">
                                            Canceled
                                        </span>
                                    )}
                                </div>

                                <div className="col-span-1 text-center">
                                    {refer.createdAt}
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
