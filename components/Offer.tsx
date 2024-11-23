import React from "react";

const Offer = () => {
  return (
    <div className="space-y-3 border-b border-[#E8ECEF] py-6">
      <p className="font-inter text-base font-normal text-[#343839]">
        Offer expires in:
      </p>

      <div className="flex gap-4">
        <div className="w-fit">
          <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
            02
          </div>
          <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
            Days
          </p>
        </div>
        <div className="w-fit">
          <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
            12
          </div>
          <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
            Hours
          </p>
        </div>
        <div className="w-fit">
          <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
            45
          </div>
          <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
            Minutes
          </p>
        </div>
        <div className="w-fit">
          <div className="flex h-[60px] w-[60px] items-center justify-center bg-[#F3F5F7] font-poppins text-[34px] font-medium text-[#141718]">
            05
          </div>
          <p className="text-center font-inter text-xs font-normal text-[#6C7275]">
            Seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Offer;
