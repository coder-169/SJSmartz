// package
import Link from "next/link";

// ui
import Logo from "@/ui/assets/logo";
import Button from "@/ui/button";
import {
  CartIcon,
  CloseIcon,
  FacebookIcon,
  InstagramIcon,
  NotificationCount,
  SearchIcon,
  WishlistIcon,
  YoutubeIcon,
} from "@/ui/assets/svg";

// lib
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { FaFacebook, FaInstagram, FaUser, FaWhatsapp } from "react-icons/fa6";
import { useGlobalContext } from "@/hooks/AppContext";
import { Loader } from "lucide-react";
import Image from "next/image";

const links = [
  {
    id: "home",
    path: "/",
    name: "Home",
  },
  {
    id: "shop",
    path: "/shop",
    name: "Shop",
  },
  {
    id: "about",
    path: "/about",
    name: "About Us",
  },
  {
    id: "contact-us",
    path: "/contact-us",
    name: "Contact Us",
  },
];
import { BiLogOutCircle } from "react-icons/bi";
export default function NavMobile({
  onClick,
  open,
}: {
  onClick: () => void;
  open: boolean;
}) {
  const { data: session, status } = useSession();

  const { cartItems } = useGlobalContext() as any;
  return (
    <div
      className={cn(
        "absolute left-0 top-0 z-10 grid min-h-[100dvh] w-full grid-cols-[6fr_6fr] transition-all duration-300 md:grid-cols-[4fr_8fr] lg:hidden",
        open ? "transform-none touch-none" : "-translate-x-full",
      )}
    >
      <div className="w-96 flex h-full flex-col justify-between bg-white p-6">
        {/* top section */}
        <div className="flex flex-col gap-4">
          {/* logo */}
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={onClick}>
              <CloseIcon className="w-6" />
            </button>
          </div>
          {/* navbar links */}
          <ul className="grid grid-cols-1">
            {links.map((link) => (
              <li
                key={link.id}
                className="border-b border-[#E8ECEF] first:pt-0"
              >
                <Link
                  href={link.path}
                  className="block py-4 font-inter text-sm font-medium text-[#141718]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* bottom section */}
        <div className="flex flex-col gap-5">
          {/* cart & wishlist */}
          <ul>
            <li>
              <Link
                href="/cart"
                className="flex items-center justify-between border-b border-[#E8ECEF] py-4"
              >
                <span className="font-inter text-sm font-medium text-[#141718]">
                  Cart
                </span>

                <div className="flex items-center gap-1.5">
                  <CartIcon className="w-6" />

                  <NotificationCount count={cartItems.length || 0} />
                </div>
              </Link>
            </li>
            {/* <li>
              <Link
                href="/cart"
                className="flex items-center justify-between border-b border-[#E8ECEF] py-4"
              >
                <span className="font-inter text-sm font-medium text-[#141718]">
                  Wishlist
                </span>

                <div className="flex items-center gap-1.5">
                  <WishlistIcon className="w-6" />
                  <NotificationCount count={12} />
                </div>
              </Link>
            </li> */}
          </ul>

          {/* login button */}
          {status === 'loading' ?
            <Loader size={20} className="animate-spin" />
            :
            status === 'unauthenticated' ?
              <Link href={'/sign-in'}>
                <Button width="full" fontSize="lg" className="py-2.5">
                  Sign In
                </Button>
              </Link>
              :
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {session?.user?.profileImage ?
                    <Image src={session.user.profileImage} className="rounded-full border border-black !w-10 !h-10" width={5000} height={5000} alt={session.user.username} /> :
                    <FaUser />
                  }
                  <div>
                    <h4 className="text-sm font-semibold">{session?.user?.username}</h4>
                    <small className="text-sm font-medium opacity-70">{session?.user?.email}</small>
                  </div>
                </div>
                <button onClick={() => signOut()}>
                  <BiLogOutCircle size={24} />
                </button>
              </div>
          }
          {/* social media button */}
          <div className="flex items-center gap-6 justify-center">
            <Link href={'https://www.instagram.com/sajiddoongah/'}>
              <FaInstagram
                className="h-6 w-6"
              />
            </Link>
            <Link href={'https://web.facebook.com/profile.php?id=61565837793883&sk=followers&notif_ids[0]=100075696775827&notif_ids[1]=100029224238315&notif_ids[2]=100070408065566&notif_ids[3]=100023305154001&notif_id=1733489273657322&notif_t=follow_profile&ref=notif'}>
              <FaFacebook className="h-5 w-5" />
            </Link>
            <Link href='https://wa.me/923191112018'>
              <FaWhatsapp className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      <div className="h-full bg-black/30" onClick={onClick}></div>
    </div>
  );
}
