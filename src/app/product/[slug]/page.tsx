"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { MapPin, Store, Phone, ChevronLeft, Star, Check, ShoppingCart, Bolt, Truck, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Mock variants for demonstration (in production, these would come from database)
const getMockVariants = (productName: string) => {
  if (productName.toLowerCase().includes("samsung") || productName.toLowerCase().includes("galaxy")) {
    return {
      colors: [
        { name: "Onyx Black", code: "#1a1a1a" },
        { name: "Marble Gray", code: "#9ca3af" },
        { name: "Cobalt Violet", code: "#6366f1" },
        { name: "Amber Yellow", code: "#fbbf24" },
      ],
      storages: ["128GB", "256GB", "512GB"],
    };
  }
  if (productName.toLowerCase().includes("iphone") || productName.toLowerCase().includes("apple")) {
    return {
      colors: [
        { name: "Black", code: "#1a1a1a" },
        { name: "Blue", code: "#3b82f6" },
        { name: "Green", code: "#22c55e" },
        { name: "Pink", code: "#ec4899" },
        { name: "Yellow", code: "#eab308" },
      ],
      storages: ["128GB", "256GB", "512GB"],
    };
  }
  if (productName.toLowerCase().includes("oneplus")) {
    return {
      colors: [
        { name: "Flowy Emerald", code: "#10b981" },
        { name: "Silky Black", code: "#1a1a1a" },
      ],
      storages: ["256GB", "512GB"],
    };
  }
  return {
    colors: [
      { name: "Black", code: "#1a1a1a" },
      { name: "White", code: "#f5f5f5" },
    ],
    storages: ["128GB"],
  };
};

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showNearbyShops, setShowNearbyShops] = useState(false);

  const { data: product } = trpc.product.getBySlug.useQuery({ slug });
  const { data: nearbySellers } = trpc.product.getNearbySellers.useQuery<any[]>(
    {
      productId: product?.id || "",
      latitude: userLocation?.lat || 19.0760,
      longitude: userLocation?.lng || 72.8777,
      radiusKm: 50, // Increased to show all shops, not just nearby
    },
    { enabled: !!product?.id && showNearbyShops }
  );

  const variants = product ? getMockVariants(product.name) : { colors: [], storages: [] };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowNearbyShops(true);
        },
        () => {
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
          setShowNearbyShops(true);
        }
      );
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const cartItem = {
      id: `${product?.id}-${selectedColor}-${selectedStorage}`,
      productId: product?.id || "",
      productName: `${product?.name} - ${variants.colors[selectedColor]?.name} ${variants.storages[selectedStorage]}`,
      productImage: product?.images ? JSON.parse(product.images)[0] : "",
      shopId: "",
      shopName: "",
      shopAddress: "",
      price: product?.inventory?.[0]?.sellingPrice || product?.baseMrp || 0,
      quantity: 1,
      variant: `${variants.colors[selectedColor]?.name} / ${variants.storages[selectedStorage]}`,
    };

    const existingCart = JSON.parse(localStorage.getItem("plugg_cart") || "[]");
    existingCart.push(cartItem);
    localStorage.setItem("plugg_cart", JSON.stringify(existingCart));

    alert("Added to cart!");
    router.push("/cart");
  };

  const handleBookNow = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specs = product.specifications ? JSON.parse(product.specifications) : {};
  const minPrice = product.inventory && product.inventory.length > 0 
    ? Math.min(...product.inventory.map(i => i.sellingPrice))
    : product.baseMrp || 0;
  const mrp = product.inventory && product.inventory.length > 0
    ? Math.min(...product.inventory.map(i => i.mrp))
    : product.baseMrp || 0;
  const discount = mrp > 0 ? Math.round((1 - minPrice / mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              Back
            </Link>
            <Link href="/" className="ml-4">
              <Image src="/logo.svg" alt="PLUGG" width={100} height={35} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Images */}
          <div className="mb-8 lg:mb-0">
            <div className="aspect-square rounded-xl bg-white p-4 shadow-sm">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <Package className="h-24 w-24" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 rounded-lg border-2 p-1 ${selectedImage === idx ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <img src={img} alt="" className="h-16 w-16 object-cover rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">{product.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center rounded bg-green-600 px-2 py-0.5 text-white">
                  <span className="text-sm font-medium">4.2</span>
                  <Star className="ml-1 h-3 w-3 fill-current" />
                </div>
                <span className="text-sm text-gray-500">1,234 ratings</span>
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{minPrice.toLocaleString()}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₹{mrp.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-sm font-medium text-green-600">
                    {discount}% off
                  </span>
                )}
              </div>
              {product.inventory && product.inventory.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  Available at {product.inventory.length} shops
                </p>
              )}
            </div>

            {/* Variants - Color Selection (Flipkart Style) */}
            <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex flex-wrap gap-2">
                {variants.colors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
                      selectedColor === idx
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-sm">{color.name}</span>
                    {selectedColor === idx && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Variants (Flipkart Style) */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Storage</h3>
              <div className="flex flex-wrap gap-2">
                {variants.storages.map((storage, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedStorage(idx)}
                    className={`rounded-lg border-2 px-6 py-3 text-center transition-all ${
                      selectedStorage === idx
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{storage}</span>
                    {selectedStorage === idx && (
                      <Check className="ml-2 inline h-4 w-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-orange-500 bg-white px-6 py-4 text-orange-600 font-semibold hover:bg-orange-50"
              >
                <ShoppingCart className="h-5 w-5" />
                ADD TO CART
              </button>
              <button
                onClick={handleBookNow}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-4 text-white font-semibold hover:bg-orange-600"
              >
                <Bolt className="h-5 w-5" />
                BOOK NOW
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <Truck className="h-5 w-5" />
                  <span className="text-sm font-medium">Home Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Store className="h-5 w-5" />
                  <span className="text-sm font-medium">Store Pickup</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            {/* Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900">Specifications</h3>
                <div className="mt-2 rounded-lg bg-white shadow-sm">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(specs).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-b-0">
                          <td className="px-4 py-3 text-gray-500 capitalize">{key}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Locate Nearby Shops */}
            {!showNearbyShops ? (
              <button
                onClick={getLocation}
                className="w-full rounded-lg bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700"
              >
                <MapPin className="inline h-5 w-5 mr-2" />
                Locate Nearby Shops
              </button>
            ) : (
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Available Shops
                </h3>
                {nearbySellers && nearbySellers.length > 0 ? (
                  <div className="space-y-4">
                    {nearbySellers.map((seller: any) => (
                      <div key={seller.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{seller.shop_name}</h4>
                            <p className="text-sm text-gray-500">{seller.address}, {seller.city}</p>
                            <div className="mt-2 flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <MapPin className="h-4 w-4" />
                                {seller.distance_km?.toFixed(1) || "?"} km
                              </span>
                              <span className="flex items-center gap-1 text-gray-600">
                                <Phone className="h-4 w-4" />
                                {seller.shop_phone}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">₹{seller.selling_price?.toLocaleString()}</p>
                            <p className="text-sm text-gray-400 line-through">₹{seller.mrp?.toLocaleString()}</p>
                            <p className="text-xs text-green-600">{seller.stock_quantity} in stock</p>
                          </div>
                        </div>
                        <Link
                          href={`/checkout?inventory=${seller.id}`}
                          className="mt-3 block w-full rounded-md bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-orange-600"
                        >
                          Buy from this Shop
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Store className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Checking for available shops...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
