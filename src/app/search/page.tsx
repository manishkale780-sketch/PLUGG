"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Search, MapPin, Filter, ChevronDown, Smartphone, Laptop, Headphones, Watch, Tv, Refrigerator, WashingMachine, Fan, Flame, Gamepad2, Camera, Speaker } from "lucide-react";

const allCategories = [
  { name: "Mobiles", icon: Smartphone, slug: "mobiles" },
  { name: "Laptops", icon: Laptop, slug: "laptops" },
  { name: "Audio", icon: Headphones, slug: "audio" },
  { name: "Wearables", icon: Watch, slug: "wearables" },
  { name: "TV", icon: Tv, slug: "tv" },
  { name: "Refrigerators", icon: Refrigerator, slug: "refrigerators" },
  { name: "Washing Machines", icon: WashingMachine, slug: "washing-machines" },
  { name: "Fans", icon: Fan, slug: "fans" },
  { name: "Air Coolers", icon: Flame, slug: "air-coolers" },
  { name: "Gaming", icon: Gamepad2, slug: "gaming" },
  { name: "Cameras", icon: Camera, slug: "cameras" },
  { name: "Speakers", icon: Speaker, slug: "speakers" },
];

const priceRanges = [
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹25,000", min: 10000, max: 25000 },
  { label: "₹25,000 - ₹50,000", min: 25000, max: 50000 },
  { label: "₹50,000 - ₹100,000", min: 50000, max: 100000 },
  { label: "Above ₹100,000", min: 100000, max: 9999999 },
];

const brands = ["Apple", "Samsung", "Sony", "LG", "Whirlpool", "Daikin", "Voltas", "OnePlus", "Xiaomi", "HP", "Dell", "Lenovo"];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedPriceRange, setSelectedPriceRange] = useState<{min: number, max: number} | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = trpc.product.getAll.useQuery({
    search: searchQuery,
    categorySlug: selectedCategory || undefined,
    limit: 24,
  });

  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand || "")) {
      return false;
    }
    if (selectedPriceRange && product.baseMrp) {
      if (product.baseMrp < selectedPriceRange.min || product.baseMrp > selectedPriceRange.max) {
        return false;
      }
    }
    return true;
  }) : [];

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
                  placeholder="Search for products..."
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            <Link 
              href="/login" 
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Categories Scroll */}
        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            <button
              onClick={() => setSelectedCategory("")}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                selectedCategory === "" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat.slug ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? "fixed inset-0 z-50 bg-white p-4" : "hidden"} lg:block lg:static lg:w-64 lg:bg-transparent lg:p-0`}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2">
                <ChevronDown className="h-6 w-6 rotate-180" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange?.min === range.min}
                      onChange={() => setSelectedPriceRange(range)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Brands</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBrands([...selectedBrands, brand]);
                        } else {
                          setSelectedBrands(selectedBrands.filter(b => b !== brand));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedPriceRange(null);
                setSelectedBrands([]);
                setSelectedCategory("");
              }}
              className="w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? allCategories.find(c => c.slug === selectedCategory)?.name : "All Products"}
              </h1>
              <span className="text-sm text-gray-500">
                {filteredProducts?.length || 0} results
              </span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-white p-4">
                    <div className="aspect-square rounded-lg bg-gray-200" />
                    <div className="mt-4 h-4 w-3/4 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product: typeof filteredProducts[0]) => (
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
                <p className="text-gray-500">No products found</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedPriceRange(null);
                    setSelectedBrands([]);
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
