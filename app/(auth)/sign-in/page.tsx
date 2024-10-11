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
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn("credentials", {
      username,
      password,
      redirect: false,
    })
      .then((res: any) => {
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Registered Successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(username, password);
  };
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
              <span>Sj Smartz</span>
              <h1 className="font-poppins text-[40px] font-medium text-[#121212]">
                Sign In
              </h1>
              <Text weight={400} color="gray">
                Don&apos;t have an account yet?{" "}
                <span className="font-semibold text-[#38CB89] hover:underline">
                  <Link href="/sign-up">Sign Up</Link>
                </span>
              </Text>
            </div>
            <div className="space-y-8">
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="text"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Email or Username"
                />
              </div>
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Password"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md border border-[#6C7275]"></div>
                  <Text color="gray" size="xs" className="md:text-sm">
                    Remember me
                  </Text>
                </div>

                <Text
                  weight={600}
                  size="xs"
                  color="black/800"
                  className="md:text-sm"
                >
                  Forgot password?
                </Text>
              </div>
            </div>

            <Button width="full" type="submit" className="py-2.5">
              Sign In
            </Button>
            <span className="mx-auto block font-bold">OR</span>
            {/* <div className="border-t border-[#E8ECEF] my 2" /> */}
            <Button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: "/user/dashboard",
                })
              }
              className="mx-auto flex items-center gap-2 border border-[#e0e0e0] bg-white py-2.5 font-medium text-black transition-all duration-200 hover:bg-white/70"
            >
              <Image
                src={"/icons/gg.png"}
                width={20}
                height={20}
                alt="Google Sign in"
              />
              Sign Up With Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
