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
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { Loader, Loader2 } from "lucide-react";
import BtnLoader from "@/components/BtnLoader";

export default function Page() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [code, setCode] = useState("");
  const [signUp, setSignUp] = useState<boolean>(false);
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !values.first_name ||
      !values.last_name ||
      !values.username ||
      !values.email ||
      !values.password
    )
      return toast.error("All fields are required");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("sjsmartz-signup-email", values.email);
        localStorage.setItem("sjsmartz-signup-code", data.hashedCode);
        localStorage.setItem("sjsmartz-signup-expireTime", data.expireTime);
        setSignUp(true);
      } else {
        toast.error(data.message);
      }
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const expireTime = localStorage.getItem("sjsmartz-signup-expireTime");
    if (expireTime && Number(expireTime) < new Date().getTime())
      return toast.error("Code expired!");
    if (code.length < 6) return toast.error("Code must contain 6 digits");
    try {
      setLoading(true);
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hashedCode: localStorage.getItem("sjsmartz-signup-code"),
          code,
          email: localStorage.getItem("sjsmartz-signup-email"),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Account verified");
      } else toast.error("incorrect code or expired!");
    } catch (error:any) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const resendEmail = async () => {
    try {
      setResendLoading(true);
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("win-signup-email"),
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        localStorage.setItem("sjsmartz-signup-code", data.hashedCode);
        localStorage.setItem("sjsmartz-signup-expireTime", data.expireTime);
        setCode("");
      } else {
        toast.error(data.message);
      }
    } catch (error:any) {
      toast.error(error.message);
    }
    setResendLoading(false);
  };
  const handleGoogleSignUp = () => {
    signIn("google", {
      callbackUrl: "/user/dashboard",
    });
  };
  return (
    <div className="relative bg-[#F3F5F7] lg:min-h-screen">
      <div
        className={cn([
          "grid lg:grid-cols-2",
          "max-w-[1440px]",
          "lg:rounded-lg lg:shadow-2xl",
          "lg:max-h-[720px]",
          "lg:absolute lg:inset-0 lg:m-auto",
        ])}
      >
        <div className="relative flex flex-col items-center justify-center gap-4 bg-[#F3F5F7] p-8 pt-20 lg:h-full lg:rounded-l-lg">
          <Image
            src="/images/auth.png"
            width={2000}
            height={2000}
            alt="auth"
            className="w-full max-w-[420px] lg:h-[430px] lg:w-auto lg:max-w-none"
          />
        </div>

        <div className="flex justify-center bg-white lg:rounded-r-lg">
          {!signUp ? (
          <form
            onSubmit={handleSignUp}
            className={cn([
              "w-full",
              "flex flex-col gap-4 lg:justify-center",
              "px-8 py-4 lg:px-[88px]",
              "sm:max-w-[480px] md:max-w-[520px] lg:max-w-[700px]",
            ])}
          >
            <div className="space-y-4">
              <h1 className="mb-2 font-poppins text-[40px] font-medium text-[#121212]">
                Sign Up
              </h1>
              <Text weight={400} color="gray">
                Already have an account?{" "}
                <span className="font-semibold text-[#38CB89] hover:underline">
                  <Link href="/sign-in">Sign In</Link>
                </span>
              </Text>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="w-1/2 border-b border-[#E8ECEF] pb-2 transition-all duration-200 focus-within:border-[#141718]">
                  <Input
                    intent="secondary"
                    type="text"
                    placeholder="First name"
                    name="first_name"
                    value={values.first_name}
                    onChange={handler}
                  />
                </div>
                <div className="w-1/2 border-b border-[#E8ECEF] pb-2 transition-all duration-200 focus-within:border-[#141718]">
                  <Input
                    intent="secondary"
                    type="text"
                    placeholder="Last name"
                    name="last_name"
                    value={values.last_name}
                    onChange={handler}
                  />
                </div>
              </div>
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={values.username}
                  onChange={handler}
                />
              </div>
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={values.email}
                  onChange={handler}
                />
              </div>
              <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                <Input
                  intent="secondary"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handler}
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="h-6 w-6 rounded-xl border border-[#6C7275] checked:text-red-300"
                />
                <Text
                  size="xs"
                  weight={400}
                  color="gray"
                  className="md:text-sm"
                >
                  I agree with{" "}
                  <span className="font-semibold text-[#141718]">
                    Privacy Policy
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-[#141718]">
                    Terms of Use
                  </span>
                </Text>
                <p></p>
              </div>
            </div>

            <Button
              disabled={loading}
              width="full"
              type="submit"
              className="relative py-2.5 disabled:opacity-60"
            >
              {loading ? (
                <span className="">
                  Signing Up
                  <BtnLoader classes={`!absolute !top-2 !right-4`} />
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
            {/* <div className="border-t border-[#E8ECEF] my 2" /> */}
            <span className="mx-auto block font-bold">OR</span>
            {/* <div className="border-t border-[#E8ECEF] my 2" /> */}
            <Button
              type="button"
              onClick={handleGoogleSignUp}
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
          ) : (
            <form
              onSubmit={handleSubmitCode}
              className={cn([
                "w-full",
                "flex flex-col gap-4 lg:justify-center",
                "px-8 py-4 lg:px-[88px]",
                "text-center sm:max-w-[480px] md:max-w-[520px] lg:max-w-[700px]",
              ])}
            >
              <div className="space-y-4">
                <h1 className="mb-2 font-poppins text-[40px] font-medium text-[#121212]">
                  Verify Your Account
                </h1>
                <Text weight={400} color="gray">
                  Enter the code you received on your email.{" "}
                  <span
                    className={`font-semibold text-[#38CB89] hover:underline disabled:opacity-50`}
                  >
                    <button disabled={resendLoading} onClick={resendEmail}>
                      {resendLoading ? "Resending" : "Resend?"}
                    </button>
                  </span>
                </Text>
              </div>
              <div className="space-y-12">
                <div className="border-b border-[#E8ECEF] pb-2 focus-within:border-[#141718]">
                  <Input
                    intent="secondary"
                    type="text"
                    placeholder="● ● ● ● ● ●"
                    value={code}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.length > 6) return;
                      setCode(e.target.value);
                    }}
                    className="w-full text-center font-bold tracking-[2rem] text-black"
                  />
                </div>
              </div>

              <Button
                width="full"
                disabled={loading}
                type="submit"
                className="relative py-2.5 disabled:opacity-60"
              >
                {loading ? (
                  <span>
                    Verifying
                    <BtnLoader classes={`!absolute !top-2 !right-4`} />
                  </span>
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
