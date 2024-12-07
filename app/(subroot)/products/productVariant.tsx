"use client";

import { cn } from "@/lib/utils";
import { Product, Variant } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

const ProductVariant = ({
  variants,
  selected,
  setSelected,
}: {
  variants: Product["variants"];
  selected: Variant;
  setSelected: React.Dispatch<React.SetStateAction<Variant>>;
}) => {
  return (
    <div className="space-y-2">
      <p className="font-inter text-base font-semibold text-[#6C7275]">
        Choose Color
      </p>

      <div className="space-y-4">
        <p className="font-inter text-xl font-normal capitalize text-[#141718]">
          {selected?.color}
        </p>

        <div className="flex-no-wrap flex gap-4 overflow-x-auto">
          {variants?.map((variant) => (
            <div
              key={variant.color}
              onClick={() => setSelected(variant)}
              className={cn(
                "h-[70px] w-[70px] flex-none cursor-pointer overflow-hidden border p-1 rounded-lg",
                selected.image === variant.image
                  ? "border-[#707070]"
                  : "border-transparent",
              )}
            >
              <Image
                width={231}
                height={308}
                src={variant.image}
                alt={variant.color}
                className="h-full w-full object-center rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariant;
