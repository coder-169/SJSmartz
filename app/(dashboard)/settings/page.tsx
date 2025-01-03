"use client";
import Button from "@/components/ui/button";
import { ImageIcon, Loader2, Router, UserCircle2Icon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    city: "",
    area: "",
    state: "",
    address_line: "",
    address_name: "",
    add_id: "",
  });
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const passHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const addressHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };
  const userHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user,
          user_id: session?.user?._id,
          address,
        }),
      });
      const data = await res.json();
      if (data.success) return toast.success(data.message);
      else return toast.success(data.message);
    } catch (error: any) {
      toast.success(error.message);
    } finally {
      setLoading(false);
    }
  };
  const [passLoading, setPassLoading] = useState(false);
  const updatePasswords = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setPassLoading(true);
    try {
      const res = await fetch("/api/user/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...passwords,
          userId: session?.user?._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        signOut({ callbackUrl: "/sign-in" });
        router.push("/sign-in");
        return toast.success(data.message);
      }
      toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPassLoading(false);
    }
  };
  const createPassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setPassLoading(true);
    try {
      const res = await fetch("/api/user/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...passwords,
          userId: session?.user?._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        signOut({ callbackUrl: "/sign-in" });
        router.push("/sign-in");
        return toast.success(data.message);
      }
      toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPassLoading(false);
    }
  };
  const [image, setImage] = useState<any>(null);
  const updateProfile = async () => {
    setLoading(true);
    try {
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
      const result = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          user: { profileImage: res.secure_url },
          user_id: session?.user?._id,
        }),
      });
      const d = await result.json();
      if (d.success) return toast.success("Profile Uploaded");
      else return toast.error("Error uploading profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (status === "unauthenticated" && !session) return router.push("/sign-in");
    setUser({
      username: session?.user?.username || "",
      first_name: session?.user?.first_name || "",
      last_name: session?.user?.last_name || "",
      phone: session?.user?.phone || "",
    });
    setAddress({
      city: session?.user?.addresses[0].city || "",
      area: session?.user?.addresses[0]?.area || "",
      state: session?.user?.addresses[0].state || "",
      address_line: session?.user?.addresses[0].address_line || "",
      address_name: session?.user?.addresses[0].address_name || "",
      add_id: session?.user?.addresses[0]._id || "",
    });
  }, [session, status, router]);
  return status === "loading" ? (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin duration-300 repeat-infinite" />
    </div>
  ) : (
    <div className="h-screen w-full space-y-6 overflow-y-scroll rounded-md px-20 py-8">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="janesmith"
                  value={user.username}
                  autoComplete="username"
                  onChange={userHandler}
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {image ? (
                  <Image
                    width={5000}
                    height={5000}
                    src={image}
                    alt="profile"
                    className="h-24 w-24 rounded-full"
                  />
                ) : session?.user?.profileImage ? (
                  <Image
                    width={5000}
                    height={5000}
                    src={session?.user?.profileImage}
                    alt="profile"
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <UserCircle2Icon className="h-20 w-20 rounded-full" />
                )}
                {image ? (
                  <button
                    onClick={updateProfile}
                    disabled={loading}
                    className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        Uploading
                        <Loader2 className="size-4 animate-spin" />
                      </span>
                    ) : (
                      <span>Upload</span>
                    )}
                  </button>
                ) : (
                  <label
                    htmlFor="photo"
                    className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </label>
                )}
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  onChange={(e: any) => {
                    setImage(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Personal Information
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="first_name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                First name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={user.first_name}
                  onChange={userHandler}
                  autoComplete="given-name"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="last_name"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Last name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={user.last_name}
                  onChange={userHandler}
                  autoComplete="family-name"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={session?.user?.email}
                  readOnly
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] opacity-70 outline-none  transition-all duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address_line"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Street address
              </label>
              <div className="mt-2">
                <input
                  id="address_line"
                  name="address_line"
                  type="text"
                  autoComplete="street-address"
                  value={address.address_line}
                  onChange={addressHandler}
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm/6 font-medium text-gray-900"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  value={address.city}
                  onChange={addressHandler}
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="state"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Province
              </label>
              <div className="mt-2">
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={address.state}
                  onChange={addressHandler}
                  autoComplete="address-level1"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="area"
                className="block text-sm/6 font-medium text-gray-900"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={address.area}
                  onChange={addressHandler}
                  autoComplete="postal-code"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            onClick={handleUpdate}
            disabled={loading}
            type="button"
            className="relative px-6 py-2 text-sm disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                Saving{" "}
                <Loader2 className="size-4 animate-spin repeat-infinite" />
              </span>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            {session?.user?.password === "" ? "Create" : "Update"} Password

          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {session?.user?.password === "" ? "" : <div className="sm:col-span-4">
              <label
                htmlFor="oldPassword"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Old Password
              </label>
              <div className="mt-2">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="text"
                  value={passwords.oldPassword}
                  onChange={passHandler}
                  placeholder="*********"
                  autoComplete="off"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>}


            <div className="sm:col-span-3">
              <label
                htmlFor="newPassword"
                className="block text-sm/6 font-medium text-gray-900"
              >
                New Password
              </label>
              <div className="mt-2">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="text"
                  value={passwords.newPassword}
                  onChange={passHandler}
                  placeholder="*********"
                  autoComplete="newPassword"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="confirmPassword"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="text"
                  value={passwords.confirmPassword}
                  onChange={passHandler}
                  placeholder="*********"
                  autoComplete="confirmPassword"
                  className="w-full rounded-md border border-[#6C7275] px-4 py-2 font-inter font-normal text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {session?.user?.password === "" ? <Button
            onClick={createPassword}
            disabled={passLoading}
            type="button"
            className="relative px-6 py-2 text-sm disabled:opacity-60"
          >
            {passLoading ? (
              <span className="flex items-center gap-2">
                Creating{" "}
                <Loader2 className="size-4 animate-spin repeat-infinite" />
              </span>
            ) : (
              <span>Create</span>
            )}
          </Button> : <Button
            onClick={updatePasswords}
            disabled={passLoading}
            type="button"
            className="relative px-6 py-2 text-sm disabled:opacity-60"
          >
            {passLoading ? (
              <span className="flex items-center gap-2">
                Updating{" "}
                <Loader2 className="size-4 animate-spin repeat-infinite" />
              </span>
            ) : (
              <span>Update</span>
            )}
          </Button>}
        </div>
      </div>
    </div>
  );
};

export default Page;
