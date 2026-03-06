"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";

export default function OTPLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOTPMutation = trpc.otp.sendOTP.useMutation({
    onSuccess: (data) => {
      setMessage(data.message);
      setStep("otp");
      // In development, show OTP
      if (data.otp) {
        console.log("Development OTP:", data.otp);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const verifyOTPMutation = trpc.otp.verifyOTP.useMutation({
    onSuccess: async () => {
      // After OTP verification, login the user
      try {
        const response = await fetch("/api/auth/otp-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        
        if (response.ok) {
          const user = await response.json();
          login({
            id: user.id,
            phone: user.phone,
            email: user.email || undefined,
            fullName: user.fullName,
            role: user.role as "BUYER" | "SELLER" | "ADMIN",
          });
          
          // Redirect based on role
          if (user.role === "ADMIN") {
            router.push("/admin");
          } else if (user.role === "SELLER") {
            router.push("/seller/dashboard");
          } else {
            router.push("/");
          }
        }
      } catch (err) {
        setError("Login failed after OTP verification");
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    sendOTPMutation.mutate({
      phone,
      fullName: "User", // Will be fetched from DB
      purpose: "LOGIN",
    });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyOTPMutation.mutate({ phone, otp });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image src="/logo.svg" alt="PLUGG" width={150} height={50} />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Login with OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure login without password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
              {message}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={sendOTPMutation.isPending}
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sendOTPMutation.isPending ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                  Login with password instead
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  placeholder="6-digit OTP"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-2xl tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
                <p className="mt-2 text-sm text-gray-500">
                  OTP sent to {phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={verifyOTPMutation.isPending}
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {verifyOTPMutation.isPending ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-gray-600 hover:text-gray-500"
                >
                  Change number
                </button>
                <button
                  type="button"
                  onClick={() => sendOTPMutation.mutate({ phone, fullName: "User", purpose: "LOGIN" })}
                  disabled={sendOTPMutation.isPending}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
