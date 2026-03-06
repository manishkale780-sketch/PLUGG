"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, ExternalLink, Sparkles, Plus } from "lucide-react";

// Sample Flipkart-style products for import
const FLIPKART_SAMPLE_PRODUCTS = [
  {
    name: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "Mobiles",
    baseMrp: 129999,
    description: "Titanium Black, 12GB RAM, 256GB Storage, 200MP Camera, S Pen",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/5/t/j/galaxy-s24-ultra-5g-sm-s928bzkhins-samsung-original-imahfzn3zjeem3h5.jpeg",
    ],
  },
  {
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Mobiles",
    baseMrp: 159900,
    description: "Natural Titanium, 256GB, A17 Pro Chip, 48MP Camera",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/a/r/5/-original-imagtc3kcmph6j9z.jpeg",
    ],
  },
  {
    name: "Sony Bravia 55 inch 4K Ultra HD Smart LED Google TV",
    brand: "Sony",
    category: "Televisions",
    baseMrp: 84990,
    description: "KD-55X74L, 4K HDR, Google TV, Dolby Audio",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/television/x/8/a/-original-imagtve5njdhxz7x.jpeg",
    ],
  },
  {
    name: "LG 7 kg 5 Star Inverter Fully Automatic Front Load Washing Machine",
    brand: "LG",
    category: "Washing Machines",
    baseMrp: 32990,
    description: "FHM1207SDM, Inverter Direct Drive, 6 Motion DD, Steam",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/washing-machine-new/5/z/x/-original-imagtjz8f8zfmz7z.jpeg",
    ],
  },
  {
    name: "Whirlpool 340 L Frost Free Triple Door Refrigerator",
    brand: "Whirlpool",
    category: "Refrigerators",
    baseMrp: 38990,
    description: "FP 343D PROTTON ROY, Alpha Steel, 6th Sense ActiveFresh",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/refrigerator-new/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
  {
    name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
    brand: "Daikin",
    category: "Air Conditioners",
    baseMrp: 45990,
    description: "MTKM50U, Copper Condenser, PM 2.5 Filter, 2024 Model",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/air-conditioner-new/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
  {
    name: "Crompton Silent Pro Enso 48 Inch Ceiling Fan",
    brand: "Crompton",
    category: "Fans",
    baseMrp: 3499,
    description: "1200mm, High Speed, Decorative, BEE 5 Star Rated",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/fan/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Audio",
    baseMrp: 29990,
    description: "30hr Battery, Quick Charge, Multipoint Connection, Black",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/headphone/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
  {
    name: "Canon EOS R6 Mark II Mirrorless Camera",
    brand: "Canon",
    category: "Cameras",
    baseMrp: 215990,
    description: "24.2MP, 4K 60p Video, Body Only, Full Frame",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/dslr-camera/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
  {
    name: "Sony PlayStation 5 Console",
    brand: "Sony",
    category: "Gaming",
    baseMrp: 49990,
    description: "825GB SSD, 4K Gaming, DualSense Controller, Disc Edition",
    images: [
      "https://rukminim2.flixcart.com/image/832/832/xif0q/gamingconsole/5/8/8/-original-imagt7f5z7z7z7z7.jpeg",
    ],
  },
];

export default function ImportProductsPage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  const createProductMutation = trpc.product.create.useMutation();

  const toggleProduct = (index: number) => {
    if (selectedProducts.includes(index)) {
      setSelectedProducts(selectedProducts.filter((i) => i !== index));
    } else {
      setSelectedProducts([...selectedProducts, index]);
    }
  };

  const selectAll = () => {
    setSelectedProducts(FLIPKART_SAMPLE_PRODUCTS.map((_, i) => i));
  };

  const deselectAll = () => {
    setSelectedProducts([]);
  };

  const handleImport = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    setIsImporting(true);
    let imported = 0;

    for (const index of selectedProducts) {
      const product = FLIPKART_SAMPLE_PRODUCTS[index];
      try {
        await createProductMutation.mutateAsync({
          name: product.name,
          categoryId: product.category.toLowerCase().replace(/\s+/g, "-"),
          brand: product.brand,
          baseMrp: product.baseMrp,
          description: product.description,
          images: product.images,
          specifications: {},
        });
        imported++;
      } catch (err) {
        console.error(`Failed to import ${product.name}:`, err);
      }
    }

    setIsImporting(false);
    alert(`Successfully imported ${imported} products!`);
    router.push("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/products" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Import from Flipkart</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Banner */}
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Quick Import</h3>
              <p className="text-sm text-blue-700">
                Select products below to instantly add them to your catalog. 
                These are sample electronics products similar to Flipkart listings.
              </p>
            </div>
          </div>
        </div>

        {/* Selection Actions */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedProducts.length} of {FLIPKART_SAMPLE_PRODUCTS.length} selected
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Select All
            </button>
            <button
              onClick={deselectAll}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FLIPKART_SAMPLE_PRODUCTS.map((product, index) => (
            <div
              key={index}
              onClick={() => toggleProduct(index)}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                selectedProducts.includes(index)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand}</p>
                  <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    ₹{product.baseMrp.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 line-clamp-2">{product.description}</p>
            </div>
          ))}
        </div>

        {/* Import Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleImport}
            disabled={isImporting || selectedProducts.length === 0}
            className="flex items-center gap-2 rounded-md bg-green-600 px-8 py-3 text-lg font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            {isImporting
              ? `Importing ${selectedProducts.length} products...`
              : `Import ${selectedProducts.length} Products`}
          </button>
        </div>

        {/* Manual Import Note */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-2 font-medium text-gray-900">Want to import your own products?</h3>
          <p className="text-sm text-gray-600 mb-4">
            You can manually add product details or use the bulk upload feature for multiple products.
          </p>
          <div className="flex gap-3">
            <Link
              href="/admin/products/add"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Single Product
            </Link>
            <Link
              href="/admin/products/bulk"
              className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              <ExternalLink className="h-4 w-4" />
              Bulk Upload
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
