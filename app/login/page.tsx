"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

import { useAppDispatch } from "@/app/redux/hooks";
import { loginUser } from "@/app/redux/thunks/authThunks";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login Successful");

      router.replace("/pharmacy/dashboard");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">

      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* Left Section */}

        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-cyan-600">

          {/* Background */}

          <div className="absolute inset-0">

            <Image
              src="/hospital-login.png"
              alt="Hospital"
              fill
              className="object-cover opacity-20"
            />

          </div>

          <div className="relative flex flex-col justify-center px-16 text-white z-10">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">

                <Activity className="w-8 h-8" />

              </div>

              <div>

                <h1 className="text-4xl font-bold">
                  HMS Admin
                </h1>

                <p className="text-blue-100">
                  Hospital Management System
                </p>

              </div>

            </div>

            <h2 className="text-5xl font-bold leading-tight mb-8">
              Smarter Healthcare
              <br />
              Starts Here.
            </h2>

            <p className="text-lg text-blue-100 leading-8 max-w-xl">
              Manage patients, pharmacy, laboratory,
              doctors, nursing, inventory, billing,
              HR and every hospital operation from
              one intelligent dashboard.
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center justify-center px-5 py-10">

          <Card className="w-full max-w-md shadow-2xl border-0 rounded-3xl">

            <CardContent className="p-10">

              <div className="text-center mb-8">

                <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">

                  <Activity className="text-blue-600 w-8 h-8" />

                </div>

                <h2 className="text-3xl font-bold">
                  Welcome Back
                </h2>

                <p className="text-gray-500 mt-2">
                  Login to Hospital Admin Panel
                </p>

              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <Label>Email Address</Label>

                  <div className="relative mt-2">

                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

                    <Input
                      {...register("email", {
                        required: "Email is required",
                      })}
                      placeholder="admin@hospital.com"
                      className="pl-12 h-12 rounded-xl"
                    />

                  </div>

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}

                </div>

                {/* Password */}

                <div>

                  <Label>Password</Label>

                  <div className="relative mt-2">

                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />

                    <Input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      {...register("password", {
                        required: "Password required",
                      })}
                      placeholder="********"
                      className="pl-12 pr-12 h-12 rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-3 text-gray-400"
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}

                </div>

                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-2">

                    <Checkbox />

                    <span className="text-sm">
                      Remember Me
                    </span>

                  </div>

                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>

                </div>

                <Button
                  className="w-full h-12 rounded-xl text-base"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? "Signing In..."
                    : "Login"}
                </Button>

              </form>

              {/* Dummy Credentials */}

              <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="font-semibold text-blue-700 mb-2">
                  Demo Credentials
                </p>

                <p className="text-sm">
                  <strong>Email:</strong>{" "}
                  admin@hospital.com
                </p>

                <p className="text-sm">
                  <strong>Password:</strong>{" "}
                  admin@123
                </p>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  );
}