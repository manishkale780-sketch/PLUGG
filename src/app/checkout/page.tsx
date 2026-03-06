"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { MapPin, Truck, Store, Check, ChevronRight, ArrowLeft, Map } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopLat?: number;
  shopLng?: number;
  price: number;
  quantity: number;
  variant?: string;
}

interface Shop {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  distance?: number;
  hasProduct: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Locate, 2: Delivery, 3: Confirm
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [deliveryType, setDeliveryType] = useState<"home" | "pickup">("pickup");
  const [address, setAddress] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("plugg_cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: 19.076, lng: 72.8777 }) // Default Mumbai
      );
    }

    // Load nearby shops (mock data for now)
    fetchShops();
  }, [user]);

  const fetchShops = async () => {
    // In production, this would fetch from API based on product availability
    const mockShops: Shop[] = [
      {
        id: "1",
        name: "Electronics World",
        address: "Shop 12, Main Market",
        city: "Mumbai",
        phone: "9876543210",
        distance: 1.2,
        hasProduct: true,
      },
      {
        id: "2",
        name: "Digital Store",
        address: "Mall Road, Near Station",
        city: "Mumbai",
        phone: "9876543211",
        distance: 2.5,
        hasProduct: true,
      },
      {
        id: "3",
        name: "Tech Hub",
        address: "Sector 15, Commercial Area",
        city: "Mumbai",
        phone: "9876543212",
        distance: 4.8,
        hasProduct: true,
      },
    ];
    setShops(mockShops);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // Track analytics
    const analytics = {
      locateNearbyClicks: parseInt(localStorage.getItem("plugg_locate_clicks") || "0"),
      homeDeliveryCount: parseInt(localStorage.getItem("plugg_home_delivery") || "0"),
      storePickupCount: parseInt(localStorage.getItem("plugg_store_pickup") || "0"),
    };

    if (deliveryType === "home") {
      localStorage.setItem("plugg_home_delivery", String(analytics.homeDeliveryCount + 1));
    } else {
      localStorage.setItem("plugg_store_pickup", String(analytics.storePickupCount + 1));
    }

    // Generate pickup token
    const pickupToken = Math.random().toString(36).substring(2, 8).toUpperCase();

    // In production, create order in database
    alert(`Order placed successfully! ${deliveryType === "pickup" ? `Your pickup code: ${pickupToken}` : "Your order will be delivered soon."}`);
    
    // Clear cart
    localStorage.removeItem("plugg_cart");
    router.push("/orders");
  };

  const handleLocateNearby = () => {
    const clicks = parseInt(localStorage.getItem("plugg_locate_clicks") || "0");
    localStorage.setItem("plugg_locate_clicks", String(clicks + 1));
    setStep(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Locate Nearby</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-sm font-medium">Delivery Option</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Step 1: Locate Nearby */}
            {step === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Locate Nearby Shops
                </h2>
                <p className="text-gray-600 mb-6">
                  Find shops near you that have your selected products
                </p>

                {/* Map placeholder */}
                <div className="h-64 bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="h-12 w-12 mx-auto mb-2" />
                    <p>Map showing nearby shops</p>
                    {userLocation && (
                      <p className="text-sm">Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                    )}
                  </div>
                </div>

                {/* Available Shops */}
                <h3 className="font-medium text-gray-900 mb-3">Available Shops</h3>
                <div className="space-y-3">
                  {shops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => setSelectedShop(shop)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        selectedShop?.id === shop.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{shop.name}</h4>
                          <p className="text-sm text-gray-600">{shop.address}, {shop.city}</p>
                          <p className="text-sm text-gray-500">📞 {shop.phone}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            {shop.distance} km away
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleLocateNearby}
                  disabled={!selectedShop}
                  className="mt-6 w-full rounded-md bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with {selectedShop?.name || "Selected Shop"}
                </button>
              </div>
            )}

            {/* Step 2: Delivery Option */}
            {step === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Choose Delivery Option
                </h2>

                <div className="space-y-4">
                  {/* Store Pickup */}
                  <button
                    onClick={() => setDeliveryType("pickup")}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === "pickup"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${deliveryType === "pickup" ? "bg-blue-100" : "bg-gray-100"}`}>
                        <Store className={`h-6 w-6 ${deliveryType === "pickup" ? "text-blue-600" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Store Pickup</h3>
                        <p className="text-sm text-gray-600">Pick up from {selectedShop?.name}</p>
                        <p className="text-xs text-green-600 mt-1">✓ FREE</p>
                      </div>
                      {deliveryType === "pickup" && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>

                  {/* Home Delivery */}
                  <button
                    onClick={() => setDeliveryType("home")}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      deliveryType === "home"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${deliveryType === "home" ? "bg-blue-100" : "bg-gray-100"}`}>
                        <Truck className={`h-6 w-6 ${deliveryType === "home" ? "text-blue-600" : "text-gray-600"}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Home Delivery</h3>
                        <p className="text-sm text-gray-600">Delivered to your doorstep</p>
                        <p className="text-xs text-gray-500 mt-1">₹50 delivery fee</p>
                      </div>
                      {deliveryType === "home" && (
                        <Check className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Address Form for Home Delivery */}
                {deliveryType === "home" && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Delivery Address</h3>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          rows={2}
                          value={address.address}
                          onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pincode</label>
                          <input
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-md border border-gray-300 bg-white py-3 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-md bg-blue-600 py-3 text-white font-medium hover:bg-blue-700"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Confirm Order</h2>

                {/* Order Summary */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Delivery Details</h3>
                    <p className="text-sm text-gray-600">
                      <strong>Shop:</strong> {selectedShop?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Method:</strong> {deliveryType === "home" ? "Home Delivery" : "Store Pickup"}
                    </p>
                    {deliveryType === "home" && (
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {address.address}, {address.city} - {address.pincode}
                      </p>
                    )}
                    {deliveryType === "pickup" && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ A pickup code will be generated after order confirmation
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Items</h3>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span>{item.productName} x {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-md border border-gray-300 bg-white py-3 text-gray-700 font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 rounded-md bg-green-600 py-3 text-white font-medium hover:bg-green-700"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">
                    {deliveryType === "home" ? "₹50" : "FREE"}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{(subtotal + (deliveryType === "home" ? 50 : 0)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
