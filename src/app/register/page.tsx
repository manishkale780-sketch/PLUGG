"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";
import { Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOTPMutation = trpc.otp.sendOTP.useMutation({
    onSuccess: (data) => {
      setMessage(data.message);
      setOtpSent(true);
      setStep("otp");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const verifyOTPMutation = trpc.otp.verifyOTP.useMutation({
    onSuccess: () => {
      setOtpVerified(true);
      setMessage("Email verified successfully! Creating your account...");
      // Auto-submit registration after OTP verification
      handleRegister();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      login({
        id: data.id,
        phone: data.phone,
        email: data.email || undefined,
        fullName: data.fullName,
        role: data.role as "BUYER" | "SELLER" | "ADMIN",
      });
      router.push("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.email) {
      setError("Email is required for OTP verification");
      return;
    }

    sendOTPMutation.mutate({
      email: formData.email,
      fullName: formData.fullName,
      purpose: "REGISTER",
    });
  };

  const handleVerifyOTP = () => {
    setError("");
    verifyOTPMutation.mutate({
      email: formData.email,
      otp: otp,
    });
  };

  const handleRegister = () => {
    registerMutation.mutate({
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email || undefined,
      password: formData.password,
      role: "BUYER",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image src="/logo.svg" alt="PLUGG" width={150} height={50} />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
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

          {step === "details" ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Required for OTP verification"
                />
                <p className="mt-1 text-xs text-gray-500">OTP will be sent to this email</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  pattern="[0-9]{10}"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={sendOTPMutation.isPending}
                className="flex w-full justify-center rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sendOTPMutation.isPending ? "Sending OTP..." : "Continue with Email OTP"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Verify your email</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the 6-digit code sent to {formData.email}
                </p>
              </div>

              {!otpVerified ? (
                <>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="6-digit OTP"
                      className="block w-full rounded-md border border-gray-300 px-3 py-3 text-center text-2xl tracking-widest focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || verifyOTPMutation.isPending}
                      className="flex-1 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {verifyOTPMutation.isPending ? "Verifying..." : "Verify & Create Account"}
                    </button>
                  </div>

                  <div className="flex justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("details")}
                      className="text-gray-600 hover:text-gray-500"
                    >
                      Change email
                    </button>
                    <button
                      type="button"
                      onClick={() => sendOTPMutation.mutate({ email: formData.email, fullName: formData.fullName, purpose: "REGISTER" })}
                      disabled={sendOTPMutation.isPending}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Resend OTP
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span>Creating your account...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
