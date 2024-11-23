"use client";
import {
  Check,
  Heart,
  List,
  ListChecks,
  Settings,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
const links = [
  {
    href: "/profile",
    title: "Profile",
    icon: <UserIcon size={20} />,
  },
  {
    href: "/wishlist",
    title: "Wishlist",
    icon: <Heart size={20} />,
  },
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
];
const DashSidebar = () => {
  const path = usePathname();
  return (
    <div className="sticky left-0 top-0 h-screen w-1/5 space-y-6 rounded-md p-6 shadow-2xl">
      <nav className="w-full text-center">
        <Image
          className="mx-auto w-max"
          width={100}
          height={100}
          src="/images/sj-black.png"
          alt="Logo"
        />
      </nav>
      <ul className="space-y-2">
        {links.map((link) => {
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${path === link.href ? "bg-black/5" : ""} flex w-full items-center gap-2 p-2 hover:bg-black/5`}
              >
                {link.icon}
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DashSidebar;
