import Image from "next/image";
import React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { LiaTimesSolid } from "react-icons/lia";

const ImagesGallery = ({ images }: { images: string[] }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState("");
  return (
    <>
      <div className="flex items-center gap-2">
        {images?.map((img, idx) => {
          return (
            <Image
              key={idx}
              width={60}
              height={60}
              className="h-full w-full cursor-pointer rounded-lg border border-gray-300 p-1"
              alt="Image"
              onClick={() => {
                setImage(img), setOpen(true);
              }}
              src={img}
            />
          );
        })}
      </div>

      <Dialog open={open} onClose={setOpen} className="relative z-[102]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-[101] w-screen overflow-y-auto">
          <LiaTimesSolid
            onClick={() => {
              setOpen(false), setImage("");
            }}
            className="absolute left-4 top-4 cursor-pointer text-3xl text-black"
          />
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg text-left transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              {image !== "" && (
                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <Image
                    src={image}
                    width={750}
                    height={500}
                    className="object-fit h-full w-full rounded-lg"
                    alt="Image"
                  />
                </div>
              )}
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ImagesGallery;
