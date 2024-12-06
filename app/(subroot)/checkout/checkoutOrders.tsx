"use client";

// package
import Image from "next/image";

// ui
import DeliveryOption from "@/app/(subroot)/checkout/deliveryOption";
import { useGlobalContext } from "@/hooks/AppContext";

const CheckoutOrders = () => {
  const { cartItems } = useGlobalContext() as any;
  return (
    <div className="space-y-6 rounded-md border border-[#6C7275] p-6">
      <p className="font-poppins text-lg font-semibold text-[#141718]">
        Orders
      </p>

      <div>
        {cartItems?.map((item: any) => { if (item.check) return <OrderItem key={item.id} data={item} /> })}
      </div>
    </div>
  );
};

type Order = {
  id: string;
  image: string;
  title: string;
  check: boolean;
  qty: number;
  price: number;
  color: string;
};

const OrderItem = ({ data }: { data: Order }) => {
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
            <p className="line-clamp-1 font-inter text-sm font-semibold text-[#141718] sm:line-clamp-2 md:w-2/3">
              {data.title}
            </p>
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

export default CheckoutOrders;
