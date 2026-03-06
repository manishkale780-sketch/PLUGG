"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Smartphone, Laptop, Headphones, Watch, Tv, Refrigerator, WashingMachine, Fan, Flame, ChevronRight, User, LogOut, ShoppingCart, Settings } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/lib/auth-context";

const categories = [
  { name: "Mobiles", icon: Smartphone, slug: "mobiles" },
  { name: "Laptops", icon: Laptop, slug: "laptops" },
  { name: "TV", icon: Tv, slug: "tv" },
  { name: "Refrigerators", icon: Refrigerator, slug: "refrigerators" },
  { name: "Washing Machines", icon: WashingMachine, slug: "washing-machines" },
  { name: "Air Coolers", icon: Flame, slug: "air-coolers" },
  { name: "Fans", icon: Fan, slug: "fans" },
  { name: "Audio", icon: Headphones, slug: "audio" },
];

export default function Home() {
  const { data: products } = trpc.product.getAll.useQuery({ limit: 8 });
  const { user, logout } = useAuth();
  type Product = NonNullable<typeof products>[number];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="PLUGG" width={120} height={40} />
            </Link>
            
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Mumbai</span>
              </button>
              
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <Link href="/settings" className="p-2 text-gray-600 hover:text-blue-600">
                    <Settings className="h-5 w-5" />
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link 
                      href="/admin" 
                      className="rounded-md bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-200"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "SELLER" && (
                    <Link 
                      href="/seller/dashboard" 
                      className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Buy Electronics from
              <span className="block text-orange-400">Local Shops Near You</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Connect with verified local electronics stores. Get the best prices, 
              instant pickup, or quick delivery from shops in your neighborhood.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/search"
                className="rounded-lg bg-orange-500 px-6 py-3 text-base font-medium text-white hover:bg-orange-600"
              >
                Browse Products
              </Link>
              <Link
                href="/seller/register"
                className="rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-gray-100"
              >
                Sell on PLUGG
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <category.icon className="h-10 w-10 text-blue-600" />
                <span className="mt-3 font-medium text-gray-900">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link href="/search" className="flex items-center text-blue-600 hover:text-blue-700">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products && products.length > 0 ? (
              products.map((product: Product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group rounded-xl border border-gray-200 bg-white p-3 sm:p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                    {product.images ? (
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%239ca3af' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <Smartphone className="h-8 w-8 sm:h-12 sm:w-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
                  {product.baseMrp && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        ₹{product.baseMrp.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <p className="mt-1 text-xs text-green-600">
                    {product.inventory?.length || 0} shops nearby
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Loading products...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How PLUGG Works</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">1. Search Products</h3>
              <p className="mt-2 text-gray-600">Browse electronics from our master catalog</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">2. Find Local Shops</h3>
              <p className="mt-2 text-gray-600">See nearby stores stocking your item</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">3. Buy & Collect</h3>
              <p className="mt-2 text-gray-600">Pickup in-store or get home delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <Image src="/logo.svg" alt="PLUGG" width={100} height={35} />
              <p className="mt-4 text-sm">
                India's hyperlocal electronics marketplace. Connecting buyers with local shops.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white">For Buyers</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-white">Browse Products</Link></li>
                <li><Link href="/orders" className="hover:text-white">My Orders</Link></li>
                <li><Link href="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">For Sellers</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="/seller/register" className="hover:text-white">Register Shop</Link></li>
                <li><Link href="/seller/dashboard" className="hover:text-white">Seller Dashboard</Link></li>
                <li><Link href="/seller/support" className="hover:text-white">Seller Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Contact</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li>support@plugg.com</li>
                <li>+91 1800-PLUGG-01</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
            © 2026 PLUGG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
