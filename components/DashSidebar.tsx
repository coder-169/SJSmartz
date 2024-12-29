"use client";
import {
  Check,
  Heart,
  List,
  ListChecks,
  Settings,
  UserIcon,
  Users2Icon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BiLogOutCircle } from "react-icons/bi";
const links = [
  {
    href: "/profile",
    title: "Profile",
    icon: <UserIcon size={20} />,
  },
  // {
  //   href: "/wishlist",
  //   title: "Wishlist",
  //   icon: <Heart size={20} />,
  // },
  {
    href: "/orders",
    title: "Orders",
    icon: <ListChecks size={20} />,
  },
  {
    href: "/settings",
    title: "Settings",
    icon: <Settings size={20} />,
  },
  {
    href: "/referrals",
    title: "Referrals",
    icon: <Users2Icon size={20} />,
  },
];
const DashSidebar = () => {
  const path = usePathname();
  return (
    <div className="sticky left-0 top-0 h-screen w-1/5 space-y-6 rounded-md p-6 shadow-2xl">
      <nav className="w-full text-center">
        <Link href="/">
          <Image
            className="mx-auto w-max"
            width={100}
            height={100}
            src="/images/sj-black.png"
            alt="Logo"
          />
        </Link>
      </nav>
      <ul className="space-y-2">
        {links.map((link) => {
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex font-medium justify-between ${path === link.href ? "bg-black/5" : ""} w-full items-center gap-2  transition-all duration-300 p-3 rounded-xl hover:bg-black/5`}
              >
                <span>
                  {link.title}
                </span>
                {link.icon}
              </Link>
            </li>
          );
        })}
        <li>
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })}
            className={`w-full font-medium items-center gap-2 transition-all duration-300 p-3 rounded-xl hover:bg-black/5 flex justify-between`}
          >
            <span>
              Sign Out
            </span>
            <BiLogOutCircle size={24} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default DashSidebar;
