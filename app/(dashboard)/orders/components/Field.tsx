import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Field = ({
  name,
  value,
  orderId,
}: {
  name: string;
  value: number | string;
  orderId?: string;
}) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const uploadReceipt = async () => {
      try {
        setLoading(true);
      const resp = await fetch(image);
      const blob = await resp.blob();
      // Convert blob to File object
      const file = new File([blob], "image.jpeg", { type: blob.type });
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "sj-smartz");
      data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
        {
          method: "POST",
          body: data,
        },
      );
      const res = await response.json();
      const result = await fetch("/api/user/order/payment", {
        method: "PUT",
        body: JSON.stringify({
          url: res.secure_url,
          orderId,
        }),
      });
      const d = await result.json();
      console.log(d)
      console.log(d)
      if (d.success)
        return toast.success("Image Uploaded! Order will be processed soon");
      else return toast.error("Error uploading profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2">
      <h2 className="w-1/3 font-medium">{name}</h2>
      {name === "Payment Status" && value === "Pending" ? (
        <div className="flex w-2/3 justify-between">
          <span className="w-2/3 text-sm ">{value}</span>
          {image !== "" ? (
            <button
              className="flex items-center gap-1 text-xs font-bold text-black transition-all duration-200 hover:text-black/50 disabled:opacity-70"
              disabled={loading}
              onClick={uploadReceipt}
            >
              <Image src={image} width={50} height={50} alt="Nothing" />{" "}
              {loading ? "Uploading" : "Upload"}
            </button>
          ) : (
            <label
              htmlFor="image"
              className="text-xs font-bold text-black transition-all duration-200 hover:text-black/50"
            >
              Add
            </label>
          )}
          <input
            type="file"
            hidden
            accept=""
            onChange={(e: any) => {
              setImage(URL.createObjectURL(e.target.files[0]));
            }}
            name="image"
            id="image"
          />
        </div>
      ) : (
        <span className="w-2/3 text-sm">{value}</span>
      )}
    </div>
  );
};

export default Field;
