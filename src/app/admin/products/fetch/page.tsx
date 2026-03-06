"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Search, Download, Check, X, Loader2, Sparkles } from "lucide-react";

interface ProductVariant {
  name: string;
  color?: string;
  storage?: string;
  price: number;
  image: string;
  available: boolean;
}

interface FetchedProduct {
  name: string;
  brand: string;
  description: string;
  basePrice: number;
  images: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
}

// Simulated product database (in production, this would fetch from Flipkart API)
const PRODUCT_DATABASE: Record<string, FetchedProduct> = {
  "samsung galaxy s24": {
    name: "Samsung Galaxy S24 5G",
    brand: "Samsung",
    description: "Samsung Galaxy S24 5G with Dynamic AMOLED 2X display, Exynos 2400 processor, 50MP triple camera system, and all-day battery life.",
    basePrice: 74999,
    images: [
      "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-sm-s921-sm-s921bzyainu-thumb-539573169?$200_200_PNG$",
    ],
    variants: [
      { name: "Onyx Black 128GB", color: "Onyx Black", storage: "128GB", price: 74999, image: "", available: true },
      { name: "Marble Gray 128GB", color: "Marble Gray", storage: "128GB", price: 74999, image: "", available: true },
      { name: "Cobalt Violet 128GB", color: "Cobalt Violet", storage: "128GB", price: 74999, image: "", available: true },
      { name: "Amber Yellow 128GB", color: "Amber Yellow", storage: "128GB", price: 74999, image: "", available: true },
      { name: "Onyx Black 256GB", color: "Onyx Black", storage: "256GB", price: 84999, image: "", available: true },
      { name: "Marble Gray 256GB", color: "Marble Gray", storage: "256GB", price: 84999, image: "", available: true },
    ],
    specifications: {
      "Display": "6.2-inch Dynamic AMOLED 2X, FHD+",
      "Processor": "Exynos 2400",
      "RAM": "8GB",
      "Storage": "128GB / 256GB",
      "Rear Camera": "50MP + 12MP + 10MP",
      "Front Camera": "12MP",
      "Battery": "4000mAh",
      "OS": "Android 14, One UI 6.1",
    },
  },
  "iphone 15": {
    name: "Apple iPhone 15",
    brand: "Apple",
    description: "iPhone 15 features a gorgeous 6.1-inch Super Retina XDR display, A16 Bionic chip, 48MP main camera with 2x Telephoto, and USB-C.",
    basePrice: 79900,
    images: [
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=200",
    ],
    variants: [
      { name: "Black 128GB", color: "Black", storage: "128GB", price: 79900, image: "", available: true },
      { name: "Blue 128GB", color: "Blue", storage: "128GB", price: 79900, image: "", available: true },
      { name: "Green 128GB", color: "Green", storage: "128GB", price: 79900, image: "", available: true },
      { name: "Yellow 128GB", color: "Yellow", storage: "128GB", price: 79900, image: "", available: true },
      { name: "Pink 128GB", color: "Pink", storage: "128GB", price: 79900, image: "", available: true },
      { name: "Black 256GB", color: "Black", storage: "256GB", price: 89900, image: "", available: true },
      { name: "Black 512GB", color: "Black", storage: "512GB", price: 109900, image: "", available: true },
    ],
    specifications: {
      "Display": "6.1-inch Super Retina XDR OLED",
      "Processor": "A16 Bionic",
      "RAM": "6GB",
      "Storage": "128GB / 256GB / 512GB",
      "Rear Camera": "48MP + 12MP",
      "Front Camera": "12MP",
      "Battery": "3349mAh",
      "OS": "iOS 17",
    },
  },
  "oneplus 12": {
    name: "OnePlus 12 5G",
    brand: "OnePlus",
    description: "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera system, 100W SuperVOOC charging, and stunning 6.82-inch QHD+ display.",
    basePrice: 64999,
    images: [],
    variants: [
      { name: "Flowy Emerald 256GB", color: "Flowy Emerald", storage: "256GB", price: 64999, image: "", available: true },
      { name: "Silky Black 256GB", color: "Silky Black", storage: "256GB", price: 64999, image: "", available: true },
      { name: "Flowy Emerald 512GB", color: "Flowy Emerald", storage: "512GB", price: 69999, image: "", available: true },
    ],
    specifications: {
      "Display": "6.82-inch LTPO AMOLED, QHD+",
      "Processor": "Snapdragon 8 Gen 3",
      "RAM": "12GB / 16GB",
      "Storage": "256GB / 512GB",
      "Rear Camera": "50MP + 64MP + 48MP",
      "Front Camera": "32MP",
      "Battery": "5400mAh",
      "Charging": "100W SuperVOOC",
    },
  },
};

export default function FetchProductPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState<FetchedProduct | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<number[]>([]);
  const [notFound, setNotFound] = useState(false);

  const createProductMutation = trpc.product.create.useMutation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setNotFound(false);
    setFetchedProduct(null);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Search in local database (in production, call Flipkart API)
    const searchKey = searchQuery.toLowerCase().trim();
    const found = Object.keys(PRODUCT_DATABASE).find(key => 
      key.includes(searchKey) || searchKey.includes(key)
    );

    if (found) {
      const product = PRODUCT_DATABASE[found];
      setFetchedProduct(product);
      setSelectedVariants(product.variants.map((_, i) => i)); // Select all by default
    } else {
      setNotFound(true);
    }

    setIsSearching(false);
  };

  const toggleVariant = (index: number) => {
    if (selectedVariants.includes(index)) {
      setSelectedVariants(selectedVariants.filter(i => i !== index));
    } else {
      setSelectedVariants([...selectedVariants, index]);
    }
  };

  const handleImport = async () => {
    if (!fetchedProduct || selectedVariants.length === 0) return;

    // Import selected variants as separate products
    for (const variantIndex of selectedVariants) {
      const variant = fetchedProduct.variants[variantIndex];
      await createProductMutation.mutateAsync({
        name: `${fetchedProduct.name} - ${variant.name}`,
        categoryId: "mobiles",
        brand: fetchedProduct.brand,
        baseMrp: variant.price,
        description: fetchedProduct.description,
        images: fetchedProduct.images,
        specifications: fetchedProduct.specifications,
      });
    }

    alert(`Successfully imported ${selectedVariants.length} variant(s)!`);
    router.push("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Fetch Product from Flipkart</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-semibold">AI-Powered Product Fetch</h2>
          </div>
          <p className="text-blue-100 mb-4">
            Enter a product name and we'll fetch all variants, colors, specifications, and images automatically.
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., Samsung Galaxy S24, iPhone 15, OnePlus 12..."
                className="w-full rounded-lg pl-10 pr-4 py-3 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Fetch Product
                </>
              )}
            </button>
          </div>
        </div>

        {/* Not Found */}
        {notFound && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600">
              We couldn't find "{searchQuery}" in our database. Try a different search term or add the product manually.
            </p>
            <Link
              href="/admin/products/add"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Add Manually
            </Link>
          </div>
        )}

        {/* Fetched Product */}
        {fetchedProduct && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="font-medium">{fetchedProduct.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Brand</label>
                    <p className="font-medium">{fetchedProduct.brand}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-500">Description</label>
                    <p className="text-gray-700">{fetchedProduct.description}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Base Price</label>
                    <p className="font-medium text-lg">₹{fetchedProduct.basePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="grid gap-2">
                  {Object.entries(fetchedProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-2 border-b last:border-0">
                      <span className="w-1/3 text-gray-500">{key}</span>
                      <span className="w-2/3 text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Available Variants ({fetchedProduct.variants.length})
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {fetchedProduct.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => toggleVariant(index)}
                      className={`text-left p-4 rounded-lg border-2 transition-all ${
                        selectedVariants.includes(index)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{variant.name}</p>
                          <p className="text-lg font-bold text-blue-600">₹{variant.price.toLocaleString()}</p>
                        </div>
                        {selectedVariants.includes(index) && (
                          <Check className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Import Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Summary</h3>
                
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium">{fetchedProduct.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Variants Selected</span>
                    <span className="font-medium">{selectedVariants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images</span>
                    <span className="font-medium">{fetchedProduct.images.length}</span>
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={selectedVariants.length === 0 || createProductMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-green-600 py-3 text-white font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  <Download className="h-5 w-5" />
                  {createProductMutation.isPending 
                    ? "Importing..." 
                    : `Import ${selectedVariants.length} Variant${selectedVariants.length !== 1 ? "s" : ""}`}
                </button>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  Each variant will be added as a separate product with its price
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sample Products */}
        {!fetchedProduct && !notFound && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Products</h3>
            <p className="text-gray-600 mb-4">
              Click on any product below to see how the fetch works:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(PRODUCT_DATABASE).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSearchQuery(key);
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
                >
                  {PRODUCT_DATABASE[key].name}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
