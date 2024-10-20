"use client";
// package
import Link from "next/link";
import Image from "next/image";

// ui
import Text from "@/ui/text";
import Button from "@/ui/button";

// form
import Input from "@/form/input";

// lib
import { cn } from "@/lib/utils";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(cPassword !== password)
        return toast.error('Both passwords should match!')
    const resp = await fetch("/api/user/profile/password", {
      method: "post",
      body: JSON.stringify({ password }),
    });
    const data = await resp.json();
    if (data.success) {
      toast.success(data.message);
    } else {
      toast.success(data.message);
    }
  };
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") return router.push("/");
  return (
    <div className="relative bg-[#F3F5F7] lg:min-h-screen">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "overflow-hidden",
          "lg:rounded-lg lg:shadow-2xl",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
        ])}
      >
        <div className="relative flex items-center justify-center bg-[#F3F5F7] p-8 pt-20 lg:h-full">
          <Image
            src="/images/auth.png"
            width={2000}
            height={2000}
            alt="auth"
            className="w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none"
          />
        </div>

        <div className="flex justify-center bg-white">
          <form
            onSubmit={handleLogin}
            className={cn([
              "w-full",
              "flex flex-col gap-8 lg:justify-center",
              "px-8 py-10 lg:px-[88px]",
              "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[600px]",
            ])}
          >
            <div className="space-y-6">
              <Link href={"/"}>
                <Image
                  src={"/images/sj-black.png"}
                  width={50}
                  height={50}
                  alt="Logo"
                />
              </Link>
              <h1 className="font-poppins text-[40px] font-medium text-[#121212]">
                Create Password
              </h1>
            </div>
            <div className="space-y-8">
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="text"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="New Password"
                />
              </div>
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="password"
                  value={cPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCPassword(e.target.value)
                  }
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <Button width="full" type="submit" className="py-2.5">
              Create
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
