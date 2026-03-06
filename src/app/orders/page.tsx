"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Package, MapPin, Store, ChevronLeft, Clock, CheckCircle, Truck } from "lucide-react";

const statusIcons: Record<string, any> = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  READY: Package,
  OUT_FOR_DELIVERY: Truck,
  COMPLETED: CheckCircle,
  CANCELLED: Clock,
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  READY: "bg-purple-100 text-purple-800",
  OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const { data: orders, isLoading } = trpc.order.getByBuyer.useQuery(
    { buyerId: user?.id || "" },
    { enabled: !!user?.id }
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              Back to Home
            </Link>
            <Link href="/" className="ml-4">
              <Image src="/logo.svg" alt="PLUGG" width={100} height={35} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-6">
                <div className="h-4 w-1/4 rounded bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Clock;
              const items = order.items;
              
              return (
                <div key={order.id} className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-gray-500">{order.orderNumber}</span>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{order.paymentStatus}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{items[0]?.productName}</h3>
                        <p className="text-sm text-gray-500">Qty: {items[0]?.quantity}</p>
                        
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Store className="h-4 w-4" />
                            {order.shop.name}
                          </span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {order.shop.city}
                          </span>
                        </div>

                        {order.fulfillmentType === "STORE_PICKUP" ? (
                          <div className="mt-3 rounded-lg bg-blue-50 p-3">
                            <p className="text-sm font-medium text-blue-900">Store Pickup</p>
                            <p className="text-sm text-blue-700">Token: {order.pickupToken}</p>
                            <p className="text-xs text-blue-600 mt-1">
                              Show this token at the store to collect your order
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-lg bg-green-50 p-3">
                            <p className="text-sm font-medium text-green-900">Home Delivery</p>
                            <p className="text-sm text-green-700">
                              {order.deliveryAddress?.address}, {order.deliveryAddress?.city}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/order/${order.id}`}
                      className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    {order.status === "PENDING" && (
                      <button className="flex-1 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <Package className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-500">Start shopping to see your orders here</p>
            <Link
              href="/search"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
