"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { trpc } from "@/lib/trpc";
import { 
  Package, Users, Store, ShoppingBag, Plus, Edit, Check, X, MapPin, 
  Truck, Eye, Clock, TrendingUp, AlertCircle, ExternalLink
} from "lucide-react";

interface PendingShop {
  id: string;
  name: string;
  sellerName: string;
  sellerPhone: string;
  address: string;
  city: string;
  tier: string;
  gstNumber?: string;
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  shopName: string;
  buyerName: string;
  totalAmount: number;
  status: string;
  fulfillmentType: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [pendingShops, setPendingShops] = useState<PendingShop[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState({
    locateNearbyClicks: 0,
    homeDeliveryCount: 0,
    storePickupCount: 0,
    totalOrders: 0,
  });

  const { data: products } = trpc.product.getAll.useQuery({ limit: 1 });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load analytics from localStorage (in production, fetch from DB)
    const locateClicks = parseInt(localStorage.getItem("plugg_locate_clicks") || "0");
    const homeDelivery = parseInt(localStorage.getItem("plugg_home_delivery") || "0");
    const storePickup = parseInt(localStorage.getItem("plugg_store_pickup") || "0");
    
    setAnalytics({
      locateNearbyClicks: locateClicks,
      homeDeliveryCount: homeDelivery,
      storePickupCount: storePickup,
      totalOrders: homeDelivery + storePickup,
    });

    // Mock pending shops (in production, fetch from API)
    setPendingShops([
      {
        id: "1",
        name: "Electronics Hub",
        sellerName: "Rahul Sharma",
        sellerPhone: "9876543210",
        address: "Shop 15, Main Market",
        city: "Mumbai",
        tier: "TIER_2",
        gstNumber: "27AAAAA0000A1Z5",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Digital World",
        sellerName: "Priya Patel",
        sellerPhone: "9876543211",
        address: "Mall Road, Near Station",
        city: "Pune",
        tier: "TIER_1",
        createdAt: new Date().toISOString(),
      },
    ]);

    // Mock recent orders
    setRecentOrders([
      {
        id: "1",
        orderNumber: "ORD001",
        productName: "Samsung Galaxy S24",
        shopName: "Electronics World",
        buyerName: "Amit Kumar",
        totalAmount: 79999,
        status: "PENDING",
        fulfillmentType: "STORE_PICKUP",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const handleApproveShop = (shopId: string) => {
    setPendingShops(pendingShops.filter(s => s.id !== shopId));
    alert("Shop approved successfully!");
  };

  const handleRejectShop = (shopId: string) => {
    setPendingShops(pendingShops.filter(s => s.id !== shopId));
    alert("Shop application rejected.");
  };

  if (isLoading || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-blue-900 text-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">PLUGG Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {user.fullName}</span>
              <Link href="/" className="text-sm text-blue-200 hover:text-white flex items-center gap-1">
                <ExternalLink className="h-4 w-4" />
                View Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products?.length || 60}+</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3">
                <Store className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Shops</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Locate Nearby Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.locateNearbyClicks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Analytics */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delivery Preferences</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Home Delivery</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-2">{analytics.homeDeliveryCount}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Store Pickup</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-2">{analytics.storePickupCount}</p>
              </div>
            </div>
          </div>

          {/* Pending Shop Approvals */}
          <div className="rounded-lg bg-white p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Shop Approvals</h3>
              <span className="flex items-center gap-1 text-sm text-orange-600">
                <AlertCircle className="h-4 w-4" />
                {pendingShops.length} pending
              </span>
            </div>
            
            {pendingShops.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending approvals</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {pendingShops.map((shop) => (
                  <div key={shop.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{shop.name}</h4>
                        <p className="text-sm text-gray-600">{shop.sellerName}</p>
                        <p className="text-xs text-gray-500">{shop.address}, {shop.city}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {shop.tier}
                          </span>
                          {shop.gstNumber && (
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              GST: {shop.gstNumber.slice(0, 5)}...
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveShop(shop.id)}
                          className="p-1.5 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectShop(shop.id)}
                          className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
              View all →
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.shopName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.buyerName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${
                          order.fulfillmentType === "HOME_DELIVERY" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {order.fulfillmentType === "HOME_DELIVERY" ? (
                            <><Truck className="h-3 w-3" /> Delivery</>
                          ) : (
                            <><Store className="h-3 w-3" /> Pickup</>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/products/add"
              className="flex items-center gap-4 rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-blue-100 p-3">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add Product</p>
                <p className="text-sm text-gray-500">Add single product</p>
              </div>
            </Link>
            
            <Link
              href="/admin/products/bulk"
              className="flex items-center gap-4 rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-purple-100 p-3">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bulk Upload</p>
                <p className="text-sm text-gray-500">Add multiple products</p>
              </div>
            </Link>

            <Link
              href="/admin/products/import"
              className="flex items-center gap-4 rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-green-100 p-3">
                <ExternalLink className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Import from Flipkart</p>
                <p className="text-sm text-gray-500">Quick product import</p>
              </div>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-4 rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-orange-100 p-3">
                <Edit className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Products</p>
                <p className="text-sm text-gray-500">Edit or remove products</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
