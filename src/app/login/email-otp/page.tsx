"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function EmailOTPLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOTPMutation = trpc.otp.sendOTP.useMutation({
    onSuccess: (data) => {
      setMessage(data.message);
      setStep("otp");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const verifyOTPMutation = trpc.otp.verifyOTP.useMutation({
    onSuccess: async () => {
      // After OTP verification, login the user
      try {
        const response = await fetch("/api/auth/email-otp-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
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
      email,
      fullName: email.split("@")[0], // Use part of email as name
      purpose: "LOGIN",
    });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyOTPMutation.mutate({ email, otp });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image src="/logo.svg" alt="PLUGG" width={150} height={50} />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Login with Email OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Secure passwordless login
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {/* Back button */}
          <Link 
            href="/login" 
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

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

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={sendOTPMutation.isPending}
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sendOTPMutation.isPending ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>OTP will be sent to your email</p>
                <p className="text-xs mt-1">Valid for 5 minutes</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="6-digit code"
                    className="block w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-center text-2xl tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  OTP sent to {email}
                </p>
              </div>

              <button
                type="submit"
                disabled={verifyOTPMutation.isPending || otp.length !== 6}
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {verifyOTPMutation.isPending ? "Verifying..." : "Verify & Login"}
              </button>

              <div className="flex justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-gray-600 hover:text-gray-500"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={() => sendOTPMutation.mutate({ email, fullName: email.split("@")[0], purpose: "LOGIN" })}
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
