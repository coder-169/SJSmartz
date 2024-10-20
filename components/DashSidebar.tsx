import Link from "next/link";
import React from "react";

const DashSidebar = () => {
  return (
    <div className="sticky top-28 h-max space-y-6 rounded-md border border-[#6C7275] p-6">
      <ul className="space-y-6">
        <li>
          <Link href="/profile" className="text-[#17173c] hover:text-[#23254f]">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/orders">Orders</Link>
        </li>
        <li>
          <Link href="/settings">Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default DashSidebar;
