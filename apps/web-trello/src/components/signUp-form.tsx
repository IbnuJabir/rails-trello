"use client";

import Link from "next/link";
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
import { FormEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { trpc } from "@/server/client";
import Loader from "./loader";

export function SignupForm() {
  const router = useRouter();
  const addUser = trpc.user.addUser.useMutation({
    onSuccess: () => {
      router.push("/boards");
      toast.success(`User Registered successfully!`);
    },
    onError: (error) => {
      if (error?.data?.zodError) {
        const fieldErrors = error.data.zodError.fieldErrors;

        // Access the first error message for a specific field
        const nameError = fieldErrors?.name?.[0]; // Example for name field
        const emailError = fieldErrors?.email?.[0]; // Example for email field
        const passwordError = fieldErrors?.password?.[0]; // For password field
        if (nameError) {
          toast.error(nameError);
        } else if (emailError) {
          toast.error(emailError);
        } else if (passwordError) {
          toast.error(passwordError);
        } else {
          toast.error("Validation Error: Check your inputs");
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  }); //error?.data?.zodError.fieldErrors.password[0]

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addUser.mutate({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Create an account to get started with On-Rails.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          {/* Full Name */}
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
            />
          </div>
          {/* Email */}
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
          {/* Password */}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter a strong password"
              required
            />
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full flex justify-center items-center"
            disabled={addUser.isPending}
          >
            {addUser.isPending ? <Loader /> : "Sign Up"}
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
          Already have an account?{" "}
          <Link
            href="login"
            className="underline text-[#4FA7FF] hover:text-[#1E90FF]"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
