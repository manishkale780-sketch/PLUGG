"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, Search, Plus, Package } from "lucide-react";

export default function AddInventoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [shop, setShop] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    mrp: "",
    sellingPrice: "",
    stockQuantity: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      // Fetch shop details
      fetchShop(parsed.id);
    } else {
      router.push("/login");
    }
  }, [router]);

  const fetchShop = async (sellerId: string) => {
    try {
      const response = await fetch(`/api/trpc/shop.getBySeller?input=${encodeURIComponent(JSON.stringify({ sellerId }))}`);
      const data = await response.json();
      if (data.result?.data) {
        setShop(data.result.data);
      }
    } catch (error) {
      console.error("Failed to fetch shop:", error);
    }
  };

  const { data: products } = trpc.product.getAll.useQuery({
    search: searchQuery,
    limit: 20,
  });

  const addInventory = trpc.inventory.claimProduct.useMutation({
    onSuccess: () => {
      router.push("/seller/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop || !selectedProduct) return;

    addInventory.mutate({
      shopId: shop.id,
      productId: selectedProduct.id,
      mrp: parseFloat(formData.mrp),
      sellingPrice: parseFloat(formData.sellingPrice),
      stockQuantity: parseInt(formData.stockQuantity),
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/seller/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <Link href="/" className="ml-4">
              <Image src="/logo.svg" alt="PLUGG" width={100} height={35} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product to Inventory</h1>

        {!selectedProduct ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Search Products</h2>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search for products to add..."
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {products?.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                >
                  <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.images ? (
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="text-sm text-gray-400">{product.category?.name}</p>
                  </div>
                  <Plus className="h-5 w-5 text-blue-600 flex-shrink-0" />
                </button>
              ))}
            </div>

            {products?.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No products found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="text-blue-600 hover:underline mb-4"
            >
              ← Back to search
            </button>

            <div className="flex items-start gap-4 mb-6 pb-6 border-b">
              <div className="h-24 w-24 rounded-lg bg-gray-100 overflow-hidden">
                {selectedProduct.images ? (
                  <img
                    src={JSON.parse(selectedProduct.images)[0]}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <Package className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                <p className="text-gray-500">{selectedProduct.brand}</p>
                <p className="text-sm text-gray-400 mt-1">{selectedProduct.category?.name}</p>
                {selectedProduct.baseMrp && (
                  <p className="text-sm text-gray-400 mt-1">MRP: ₹{selectedProduct.baseMrp.toLocaleString()}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="Enter MRP"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="Enter selling price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addInventory.isPending}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {addInventory.isPending ? "Adding..." : "Add to Inventory"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
