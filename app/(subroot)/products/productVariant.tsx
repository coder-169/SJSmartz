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
            <button
              key={variant.color}
              onClick={() => setSelected(variant)}
              disabled={variant.stock === 0}
              className={cn(
                "relative  disabled:opacity-70  flex-none cursor-pointer overflow-hidden border rounded-lg pt-2",
                selected.color === variant.color
                  ? "border-[#1e1f45]"
                  : "border-transparent",
              )}
            >
              <Image
                width={231}
                height={308}
                src={variant.image}
                alt={variant.color}
                className="w-16 object-center rounded-lg p-1"
              />
              {variant.stock === 0 ?
                <span className="text-black/50 bg-[#707070] text-xs w-full rounded-tr-lg rounded-tl-lg p-0.5 absolute top-0 left-0">Sold</span>
                : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductVariant;
