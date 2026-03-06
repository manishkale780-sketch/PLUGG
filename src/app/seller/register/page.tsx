"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Check, AlertCircle, MapPin } from "lucide-react";

export default function SellerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [gstValid, setGstValid] = useState<boolean | null>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [userData, setUserData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [shopData, setShopData] = useState({
    name: "",
    tier: "TIER_1" as "TIER_1" | "TIER_2",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: 0,
    longitude: 0,
    shopPhone: "",
    shopEmail: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const sendOTPMutation = trpc.otp.sendOTP.useMutation({
    onSuccess: (data) => {
      setMessage(data.message);
      setOtpSent(true);
      if (data.otp) {
        console.log("Development OTP:", data.otp);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const verifyOTPMutation = trpc.otp.verifyOTP.useMutation({
    onSuccess: () => {
      setOtpVerified(true);
      setMessage("OTP verified successfully!");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setUserId(data.id);
      localStorage.setItem("user", JSON.stringify(data));
      setStep(2);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const validateGstMutation = trpc.shop.validateGST.useQuery(
    { gstNumber: shopData.gstNumber },
    { enabled: false }
  );

  const registerShopMutation = trpc.shop.register.useMutation({
    onSuccess: () => {
      router.push("/seller/dashboard");
    },
  });

  const handleSendOTP = () => {
    setError("");
    if (!userData.email) {
      setError("Please enter your email address");
      return;
    }
    sendOTPMutation.mutate({
      email: userData.email,
      fullName: userData.fullName,
      purpose: "REGISTER",
    });
  };

  const handleVerifyOTP = () => {
    setError("");
    verifyOTPMutation.mutate({
      email: userData.email,
      otp: otp,
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify OTP before continuing");
      return;
    }
    registerMutation.mutate({
      ...userData,
      role: "SELLER",
    });
  };

  const handleShopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          registerShopMutation.mutate({
            sellerId: userId,
            name: shopData.name,
            tier: shopData.tier,
            gstNumber: shopData.gstNumber || undefined,
            address: shopData.address,
            city: shopData.city,
            state: shopData.state,
            pincode: shopData.pincode,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            phone: shopData.shopPhone,
            email: shopData.shopEmail || undefined,
          });
        },
        () => {
          // Use default coordinates if location access denied
          registerShopMutation.mutate({
            sellerId: userId,
            name: shopData.name,
            tier: shopData.tier,
            gstNumber: shopData.gstNumber || undefined,
            address: shopData.address,
            city: shopData.city,
            state: shopData.state,
            pincode: shopData.pincode,
            latitude: 19.0760, // Default: Mumbai
            longitude: 72.8777,
            phone: shopData.shopPhone,
            email: shopData.shopEmail || undefined,
          });
        }
      );
    }
  };

  const checkGST = async () => {
    if (shopData.gstNumber) {
      const result = await validateGstMutation.refetch();
      setGstValid(result.data?.valid ?? false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="PLUGG" width={150} height={50} />
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Account</span>
            </div>
            <div className="flex-1 mx-4 h-0.5 bg-gray-200">
              <div className={`h-full ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} style={{ width: step >= 2 ? "100%" : "0%" }} />
            </div>
            <div className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Shop Details</span>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Seller Account</h3>
              <p className="mt-1 text-sm text-gray-500">First, let&apos;s set up your account.</p>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="mt-4 rounded-md bg-green-50 p-4 text-sm text-green-700">
                  {message}
                </div>
              )}

              {/* Email OTP Verification Section */}
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">
                  📧 Email Verification Required
                </h4>
                <p className="text-xs text-yellow-700 mb-3">
                  Verify your email address to continue registration. OTP will be sent to your email.
                </p>
                
                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={!userData.email || !userData.email.includes("@") || sendOTPMutation.isPending}
                    className="w-full rounded-md bg-yellow-600 px-4 py-2 text-white text-sm hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {sendOTPMutation.isPending ? "Sending..." : "Send OTP to Email"}
                  </button>
                ) : !otpVerified ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP from email"
                      className="block w-full rounded-md border border-yellow-300 px-3 py-2 text-center tracking-widest"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyOTP}
                        disabled={otp.length !== 6 || verifyOTPMutation.isPending}
                        className="flex-1 rounded-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {verifyOTPMutation.isPending ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={sendOTPMutation.isPending}
                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-700 text-sm hover:bg-gray-300"
                      >
                        Resend
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">Email verified!</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleUserSubmit} className="mt-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userData.fullName}
                    onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending || !otpVerified}
                  className={`w-full rounded-md px-4 py-2 text-white disabled:opacity-50 ${
                    otpVerified 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {!otpVerified 
                    ? "Verify OTP to Continue" 
                    : registerMutation.isPending 
                      ? "Creating..." 
                      : "Continue"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Shop Registration</h3>
              <p className="mt-1 text-sm text-gray-500">Tell us about your shop.</p>

              <form onSubmit={handleShopSubmit} className="mt-6 space-y-6">
                {/* Shop Tier Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shop Tier</label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <label className={`cursor-pointer rounded-lg border p-4 ${shopData.tier === "TIER_1" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      <input
                        type="radio"
                        name="tier"
                        value="TIER_1"
                        checked={shopData.tier === "TIER_1"}
                        onChange={(e) => setShopData({ ...shopData, tier: e.target.value as "TIER_1" | "TIER_2" })}
                        className="sr-only"
                      />
                      <div className="font-medium">Tier 1 - Small Shop</div>
                      <div className="text-sm text-gray-500">GST Optional</div>
                    </label>
                    <label className={`cursor-pointer rounded-lg border p-4 ${shopData.tier === "TIER_2" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      <input
                        type="radio"
                        name="tier"
                        value="TIER_2"
                        checked={shopData.tier === "TIER_2"}
                        onChange={(e) => setShopData({ ...shopData, tier: e.target.value as "TIER_1" | "TIER_2" })}
                        className="sr-only"
                      />
                      <div className="font-medium">Tier 2 - Large Shop</div>
                      <div className="text-sm text-gray-500">GST Mandatory</div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={shopData.name}
                    onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                  />
                </div>

                {/* GST Number (Required for Tier 2) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    GST Number {shopData.tier === "TIER_1" && "(Optional)"}
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      required={shopData.tier === "TIER_2"}
                      placeholder="22AAAAA0000A1Z5"
                      className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                      value={shopData.gstNumber}
                      onChange={(e) => {
                        setShopData({ ...shopData, gstNumber: e.target.value.toUpperCase() });
                        setGstValid(null);
                      }}
                    />
                    <button
                      type="button"
                      onClick={checkGST}
                      disabled={!shopData.gstNumber || validateGstMutation.isFetching}
                      className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                  {gstValid === true && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <Check className="h-4 w-4" /> Valid GST Number
                    </p>
                  )}
                  {gstValid === false && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Invalid GST Number
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    required
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={shopData.address}
                    onChange={(e) => setShopData({ ...shopData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={shopData.city}
                      onChange={(e) => setShopData({ ...shopData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={shopData.state}
                      onChange={(e) => setShopData({ ...shopData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">PIN Code</label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={shopData.pincode}
                    onChange={(e) => setShopData({ ...shopData, pincode: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Shop Phone</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={shopData.shopPhone}
                    onChange={(e) => setShopData({ ...shopData, shopPhone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Shop Email (Optional)</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={shopData.shopEmail}
                    onChange={(e) => setShopData({ ...shopData, shopEmail: e.target.value })}
                  />
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Location Access</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        We&apos;ll use your current location to help customers find your shop. 
                        Please allow location access when prompted.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={registerShopMutation.isPending}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {registerShopMutation.isPending ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
