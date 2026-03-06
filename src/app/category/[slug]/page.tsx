"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Search, MapPin, Smartphone, Laptop, Headphones, Watch, Tv, Refrigerator, WashingMachine, Fan, Flame, Gamepad2, Camera, Speaker, ChevronRight } from "lucide-react";

const categoryInfo: Record<string, { name: string; icon: any; description: string }> = {
  mobiles: { name: "Mobiles", icon: Smartphone, description: "Latest smartphones from top brands" },
  laptops: { name: "Laptops", icon: Laptop, description: "Gaming & professional laptops" },
  audio: { name: "Audio", icon: Headphones, description: "Headphones, earphones & speakers" },
  wearables: { name: "Wearables", icon: Watch, description: "Smartwatches & fitness bands" },
  tv: { name: "TV", icon: Tv, description: "Smart TVs, LED & OLED displays" },
  refrigerators: { name: "Refrigerators", icon: Refrigerator, description: "Single, double & multi-door fridges" },
  "washing-machines": { name: "Washing Machines", icon: WashingMachine, description: "Front load, top load & semi-automatic" },
  fans: { name: "Fans", icon: Fan, description: "Ceiling, table & exhaust fans" },
  "air-coolers": { name: "Air Coolers", icon: Flame, description: "Room coolers & air conditioners" },
  gaming: { name: "Gaming", icon: Gamepad2, description: "Consoles, controllers & accessories" },
  cameras: { name: "Cameras", icon: Camera, description: "DSLR, mirrorless & action cameras" },
  speakers: { name: "Speakers", icon: Speaker, description: "Bluetooth, home theater & smart speakers" },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = categoryInfo[slug];

  const { data: products, isLoading } = trpc.product.getAll.useQuery({
    categorySlug: slug,
    limit: 24,
  });

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Category Not Found</h1>
          <Link href="/search" className="mt-4 text-blue-600 hover:underline">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="PLUGG" width={100} height={35} />
            </Link>
            
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search in ${category.name}...`}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Link 
              href="/login" 
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Category Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-blue-100 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{category.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-blue-100">{category.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white p-4">
                <div className="aspect-square rounded-lg bg-gray-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product: typeof products[0]) => (
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
                      <Icon className="h-8 w-8 sm:h-12 sm:w-12" />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-medium text-gray-900 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                <p className="text-xs sm:text-sm text-gray-500">{product.brand}</p>
                {product.baseMrp && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">₹{product.baseMrp.toLocaleString()}</span>
                  </div>
                )}
                <p className="mt-1 text-xs text-green-600">
                  {product.inventory?.length || 0} shops nearby
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No products yet</h2>
            <p className="mt-2 text-gray-500">Products in this category will appear here soon</p>
            <Link href="/search" className="mt-4 inline-block text-blue-600 hover:underline">
              Browse other categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
