"use client";
import SectionLayout from "@/layouts/sectionLayout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { data: session } = useSession();
  return (
    <div className="w-full space-y-6 rounded-md px-20 py-8">
      <div className="px-4 sm:px-0">
        <h3 className="mb-4 text-2xl font-semibold text-gray-900">
          My Profile
        </h3>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Full name</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user?.first_name} {session?.user?.last_name}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Phone</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user?.phone}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">
              Email address
            </dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user?.email}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Status</dt>
            {session?.user?.isVerified ? (
              <dd className="mt-1  w-max rounded-lg bg-green-100 px-2 py-1 text-xs font-bold text-green-700 sm:col-span-2 sm:mt-0">
                Verified
              </dd>
            ) : (
              <dd className="mt-1 w-max rounded-lg bg-red-100 px-2 py-1 text-sm/6 font-bold text-red-500 sm:col-span-2 sm:mt-0">
                Not Verified
              </dd>
            )}
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm/6 font-medium text-gray-900">Credits</dt>
            <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user?.credits}{" "}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <Image
              src={session?.user?.image || ""}
              width={200}
              height={200}
              className="rounded-full"
              alt={session?.user?.username || ""}
            />
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Page;
