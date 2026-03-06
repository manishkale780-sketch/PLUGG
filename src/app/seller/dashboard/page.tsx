"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Plus, 
  Edit, 
  Check, 
  X,
  LogOut,
  Store
} from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "orders" | "revenue">("inventory");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const { data: shop } = trpc.shop.getBySeller.useQuery(
    { sellerId: user?.id || "" },
    { enabled: !!user?.id }
  );

  const { data: inventory } = trpc.inventory.getByShop.useQuery(
    { shopId: shop?.id || "" },
    { enabled: !!shop?.id }
  );

  const { data: orders } = trpc.order.getByShop.useQuery(
    { shopId: shop?.id || "" },
    { enabled: !!shop?.id }
  );

  const updateOrderStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === "PENDING").length || 0;
  const totalProducts = inventory?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <Image src="/logo.svg" alt="PLUGG" width={120} height={40} />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Shop Info */}
        {shop && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                <p className="mt-1 text-gray-500">{shop.address}, {shop.city}, {shop.state}</p>
                <div className="mt-2 flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${shop.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {shop.isVerified ? "Verified" : "Pending Verification"}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                    {shop.tier === "TIER_1" ? "Tier 1" : "Tier 2"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Shop ID</p>
                <p className="font-mono text-sm">{shop.id.slice(0, 8)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex gap-8">
            <button
              onClick={() => setActiveTab("inventory")}
              className={`border-b-2 py-4 text-sm font-medium ${activeTab === "inventory" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`border-b-2 py-4 text-sm font-medium ${activeTab === "orders" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`border-b-2 py-4 text-sm font-medium ${activeTab === "revenue" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              Revenue
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "inventory" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Inventory</h2>
              <Link
                href="/seller/inventory/add"
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>

            {inventory && inventory.length > 0 ? (
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">MRP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Selling Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {inventory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{item.product.name}</div>
                          {item.variantData && (
                            <div className="text-sm text-gray-500">
                              {Object.entries(JSON.parse(item.variantData)).map(([k, v]) => `${k}: ${v}`).join(", ")}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 line-through">₹{item.mrp}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">₹{item.sellingPrice}</td>
                        <td className="px-6 py-4">{item.stockQuantity}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {item.isAvailable ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products yet</h3>
                <p className="mt-2 text-gray-500">Start adding products to your inventory</p>
                <Link
                  href="/seller/inventory/add"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h2>
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-gray-500">{order.orderNumber}</span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                            order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                            order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                            "bg-blue-100 text-blue-800"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 font-medium text-gray-900">{order.items[0]?.productName}</p>
                        <p className="text-sm text-gray-500">Qty: {order.items[0]?.quantity}</p>
                        <p className="mt-2 text-sm text-gray-600">
                          Customer: {order.buyer.fullName} ({order.buyer.phone})
                        </p>
                        {order.fulfillmentType === "STORE_PICKUP" ? (
                          <p className="text-sm text-blue-600">Pickup Token: {order.pickupToken}</p>
                        ) : (
                          <p className="text-sm text-gray-500">Home Delivery</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                        <p className="text-sm text-gray-500">{order.paymentStatus}</p>
                        {order.status === "PENDING" && (
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: "CONFIRMED" })}
                              className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                            >
                              <Check className="inline h-3 w-3" /> Accept
                            </button>
                            <button
                              onClick={() => updateOrderStatus.mutate({ orderId: order.id, status: "CANCELLED" })}
                              className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                            >
                              <X className="inline h-3 w-3" /> Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-2 text-gray-500">Orders will appear here when customers buy from your shop</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "revenue" && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue Overview</h2>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{orders?.length || 0}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Completed Orders</p>
                  <p className="text-3xl font-bold text-green-600">
                    {orders?.filter(o => o.status === "COMPLETED").length || 0}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ₹{orders?.length ? (totalRevenue / orders.length).toFixed(2) : "0.00"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
