"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Upload, Sparkles, Plus, Trash2 } from "lucide-react";

interface ProductInput {
  name: string;
  brand: string;
  category: string;
  baseMrp: string;
  description: string;
  images: string[];
}

const ELECTRONICS_CATEGORIES = [
  "Mobiles",
  "Laptops",
  "Televisions",
  "Refrigerators",
  "Washing Machines",
  "Air Conditioners",
  "Fans",
  "Air Coolers",
  "Audio",
  "Gaming",
  "Cameras",
  "Speakers",
  "Kitchen Appliances",
  "Smart Home",
];

export default function BulkProductUploadPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductInput[]>([
    { name: "", brand: "", category: "", baseMrp: "", description: "", images: [] },
  ]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const createProductMutation = trpc.product.create.useMutation();

  const addProductRow = () => {
    setProducts([...products, { name: "", brand: "", category: "", baseMrp: "", description: "", images: [] }]);
  };

  const removeProductRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof ProductInput, value: string | string[]) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    // Simulate AI generation (in production, call AI API)
    setTimeout(() => {
      const generatedProducts: ProductInput[] = [
        {
          name: `${aiPrompt} Pro Max`,
          brand: "Generated Brand",
          category: "Mobiles",
          baseMrp: "99999",
          description: `High-end ${aiPrompt} with advanced features`,
          images: [],
        },
        {
          name: `${aiPrompt} Standard`,
          brand: "Generated Brand",
          category: "Mobiles",
          baseMrp: "49999",
          description: `Affordable ${aiPrompt} with great value`,
          images: [],
        },
      ];
      setProducts(generatedProducts);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validProducts = products.filter(p => p.name && p.brand && p.category);
    
    for (const product of validProducts) {
      await createProductMutation.mutateAsync({
        name: product.name,
        categoryId: product.category.toLowerCase().replace(/\s+/g, "-"),
        brand: product.brand,
        baseMrp: parseFloat(product.baseMrp) || 0,
        description: product.description,
        images: product.images.filter(img => img.trim() !== ""),
        specifications: {},
      });
    }

    alert(`${validProducts.length} products uploaded successfully!`);
    router.push("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Bulk Product Upload</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* AI Generation Section */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <h2 className="text-xl font-semibold">AI-Assisted Product Generation</h2>
          </div>
          <p className="mb-4 text-purple-100">
            Describe the products you want to add. AI will generate product names, descriptions, and suggest prices.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g., 'Samsung Galaxy smartphones 2024 series' or 'LG washing machines with AI features'"
              className="flex-1 rounded-lg px-4 py-2 text-gray-900"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button
              onClick={generateWithAI}
              disabled={isGenerating || !aiPrompt.trim()}
              className="flex items-center gap-2 rounded-lg bg-white px-6 py-2 font-medium text-purple-600 hover:bg-purple-50 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate"}
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Manual Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg bg-white shadow">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
              <p className="text-sm text-gray-500">Add multiple products at once</p>
            </div>

            <div className="p-6 space-y-6">
              {products.map((product, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-700">Product #{index + 1}</h4>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProductRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.name}
                        onChange={(e) => updateProduct(index, "name", e.target.value)}
                        placeholder="e.g., Samsung Galaxy S24 Ultra"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Brand</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.brand}
                        onChange={(e) => updateProduct(index, "brand", e.target.value)}
                        placeholder="e.g., Samsung"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.category}
                        onChange={(e) => updateProduct(index, "category", e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {ELECTRONICS_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Base MRP (₹)</label>
                      <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.baseMrp}
                        onChange={(e) => updateProduct(index, "baseMrp", e.target.value)}
                        placeholder="e.g., 99999"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={2}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.description}
                        onChange={(e) => updateProduct(index, "description", e.target.value)}
                        placeholder="Product description..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Image URLs (one per line)
                      </label>
                      <textarea
                        rows={2}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={product.images.join("\n")}
                        onChange={(e) => updateProduct(index, "images", e.target.value.split("\n"))}
                        placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addProductRow}
                className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 py-3 text-gray-600 hover:border-gray-400 hover:text-gray-800"
              >
                <Plus className="h-5 w-5" />
                Add Another Product
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/admin"
              className="flex-1 rounded-md border border-gray-300 bg-white py-3 text-center font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createProductMutation.isPending}
              className="flex-1 rounded-md bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {createProductMutation.isPending ? "Uploading..." : `Upload ${products.length} Products`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
