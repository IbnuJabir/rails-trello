"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Head from "next/head";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { trpc } from "@/server/client";
import Loader from "./loader";

export default function LoginForm() {
  const router = useRouter();
  const loginUser = trpc.user.loginUser.useMutation({
    onSuccess: () => {
      router.push("/");
      toast.success(`User Logged in successfully!`);
    },
    onError: (error) => {
      if (error?.data?.zodError) {
        const fieldErrors = error.data.zodError.fieldErrors;
        const emailError = fieldErrors?.email?.[0]; // Example for email field
        const passwordError = fieldErrors?.password?.[0]; // For password field
        if (emailError) {
          toast.error(emailError);
        } else if (passwordError) {
          toast.error(passwordError);
        } else {
          toast.error("Validation Error: Check your inputs");
        }
      } else {
        console.log(error);
        toast.error(error.message);
      }
    },
  });
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    loginUser.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    // redirect("/");
    // window.history.pushState({}, "", "/");
  };

  return (
    <>
      <Head>
        <title>Log In - Auth - On-Rails</title>
      </Head>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              <Link href="#" className="mr-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loginUser.isPending}
            >
              {loginUser.isPending ? <Loader /> : "Login"}
            </Button>
          </form>
          <p className="text-gray-500 text-center py-4 text-sm">
            or continue with
          </p>
          {/* Google Signup Button */}
          <Button
            type="submit"
            onClick={() => signIn("google", { callbackUrl: "/boards" })}
            variant="outline"
            className="w-full my-2"
          >
            <FcGoogle />
            Sign up with Google
          </Button>
          {/* GitHub Signup Button */}
          <Button
            type="submit"
            onClick={() => signIn("github", { callbackUrl: "/boards" })}
            className="w-full my-2"
          >
            <FaGithub />
            Sign up with GitHub
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="signup"
              className="underline text-[#4FA7FF] hover:text-[#1E90FF]"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
