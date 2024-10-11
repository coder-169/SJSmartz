"use client";

// package
import { useEffect, useState } from "react";

// ui
import Logo from "@/ui/assets/logo";
import {
  CartIcon,
  HamburgerMenu,
  NotificationCount,
  SearchIcon,
  UserIcon,
} from "@/ui/assets/svg";
import NavLinks from "@/ui/navbar/navLinks";
import NavMobile from "@/ui/navbar/navMobile";
import PromoSection from "@/ui/promo";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";
import Link from "next/link";
import Input from "@/components/form/input";
import { useGlobalContext } from "@/hooks/AppContext";
import { useSession } from "next-auth/react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const isRootPage = useRootContext();
  const [open, setOpen] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const handleOnScroll = () => {
    window.scrollY >= 32 ? setScroll(true) : setScroll(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleOnScroll);

    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);
  const { cartItems } = useGlobalContext() as any;
  const { data: session, status } = useSession();
  return (
    <>
      {!open && <PromoSection />}
      <div
        className={cn(
          "sticky top-0 z-[100]",
          isRootPage ? "bg-white" : "bg-transparent",
          scroll && "bg-white shadow transition-colors duration-200 ease-in",
        )}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4 lg:justify-normal">
          <div className="flex items-center gap-1 lg:basis-1/4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <HamburgerMenu className="w-6" />
            </button>
            <Link href={"/"}>
              <Logo />
            </Link>
          </div>

          <div className="hidden basis-2/4 lg:block">
            <NavLinks />
          </div>

          <div className="flex items-center gap-1 lg:basis-1/4 lg:justify-end lg:gap-4">
            {/* <Input type="text" placeholder="Search" /> */}
            <SearchIcon className="hidden lg:block" />
            {status === "loading" ? (
              "Loading"
            ) : status === "unauthenticated" ? (
              <Link href={"/sign-in"}>
                <UserIcon className="hidden lg:block" />
              </Link>
            ) : (
              <Link href={"/user/dashboard"}>
                <UserIcon className="hidden lg:block" />
              </Link>
            )}

            <Link href={"/cart"} className="relative">
              <CartIcon className="w-6" />
              {cartItems?.length && (
                <span className="absolute -left-1 -top-2 text-black">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

          {/* mobile navbar  */}
          <NavMobile open={open} onClick={() => setOpen(false)} />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
