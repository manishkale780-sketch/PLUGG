import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create all electronics categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Mobiles",
        slug: "mobiles",
        attributes: JSON.stringify({ storage: ["64GB", "128GB", "256GB", "512GB"], color: ["Black", "Blue", "Red", "White", "Green"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Laptops",
        slug: "laptops",
        attributes: JSON.stringify({ ram: ["8GB", "16GB", "32GB"], storage: ["256GB SSD", "512GB SSD", "1TB SSD"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "TV",
        slug: "tv",
        attributes: JSON.stringify({ size: ['32"', '43"', '55"', '65"', '75"'], type: ["LED", "OLED", "QLED", "Smart TV"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Refrigerators",
        slug: "refrigerators",
        attributes: JSON.stringify({ type: ["Single Door", "Double Door", "Triple Door", "Side by Side"], capacity: ["200L", "300L", "400L", "500L+"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Washing Machines",
        slug: "washing-machines",
        attributes: JSON.stringify({ type: ["Front Load", "Top Load", "Semi Automatic"], capacity: ["6kg", "7kg", "8kg", "9kg+"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Air Coolers",
        slug: "air-coolers",
        attributes: JSON.stringify({ type: ["Personal", "Tower", "Desert", "Window"], capacity: ["20L", "30L", "50L", "70L+"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Fans",
        slug: "fans",
        attributes: JSON.stringify({ type: ["Ceiling", "Table", "Pedestal", "Exhaust", "Wall"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Audio",
        slug: "audio",
        attributes: JSON.stringify({ type: ["Wired", "Wireless", "TWS", "Over-ear", "In-ear"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Gaming",
        slug: "gaming",
        attributes: JSON.stringify({ type: ["Console", "Controller", "Headset", "Keyboard", "Mouse"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Cameras",
        slug: "cameras",
        attributes: JSON.stringify({ type: ["DSLR", "Mirrorless", "Action", "Point & Shoot"] }),
      },
    }),
    prisma.category.create({
      data: {
        name: "Speakers",
        slug: "speakers",
        attributes: JSON.stringify({ type: ["Bluetooth", "Home Theater", "Soundbar", "Smart"] }),
      },
    }),
  ]);

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c]));

  // Create products for all categories
  const products = await Promise.all([
    // Mobiles
    prisma.product.create({
      data: {
        name: "iPhone 15 Pro Max",
        slug: "iphone-15-pro-max",
        categoryId: catMap.mobiles.id,
        brand: "Apple",
        modelNumber: "A2849",
        description: "The most advanced iPhone ever with A17 Pro chip, titanium design, and 48MP camera system.",
        specifications: JSON.stringify({ display: "6.7-inch Super Retina XDR", processor: "A17 Pro chip", camera: "48MP Main + 12MP Ultra Wide", battery: "Up to 29 hours", os: "iOS 17" }),
        baseMrp: 159900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy S24 Ultra",
        slug: "samsung-galaxy-s24-ultra",
        categoryId: catMap.mobiles.id,
        brand: "Samsung",
        modelNumber: "SM-S928B",
        description: "Galaxy AI with S Pen and 200MP camera.",
        specifications: JSON.stringify({ display: "6.8-inch QHD+ AMOLED", processor: "Snapdragon 8 Gen 3", camera: "200MP Main", battery: "5000mAh" }),
        baseMrp: 129999,
        images: JSON.stringify(["https://images.samsung.com/in/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "OnePlus 12",
        slug: "oneplus-12",
        categoryId: catMap.mobiles.id,
        brand: "OnePlus",
        modelNumber: "CPH2581",
        description: "Smooth Beyond Belief with Hasselblad Camera.",
        specifications: JSON.stringify({ display: "6.82-inch 2K 120Hz", processor: "Snapdragon 8 Gen 3", camera: "50MP Main", battery: "5400mAh" }),
        baseMrp: 64999,
        images: JSON.stringify(["https://image01.oneplus.net/media/2024/01/08/1-M00-52-70-CgTLYWW1qJ-AH1Z2AAO7eS0-6eU855.png?wid=400"]),
      },
    }),
    // Laptops
    prisma.product.create({
      data: {
        name: "MacBook Pro 14-inch M3",
        slug: "macbook-pro-14-m3",
        categoryId: catMap.laptops.id,
        brand: "Apple",
        modelNumber: "MR7J3HN/A",
        description: "Mind-blowing performance with M3 chip.",
        specifications: JSON.stringify({ display: "14.2-inch Liquid Retina XDR", processor: "Apple M3", memory: "8GB", storage: "512GB SSD" }),
        baseMrp: 169900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Dell XPS 15",
        slug: "dell-xps-15",
        categoryId: catMap.laptops.id,
        brand: "Dell",
        modelNumber: "XPS9530",
        description: "Powerful performance for creators.",
        specifications: JSON.stringify({ display: "15.6-inch FHD+", processor: "Intel Core i7", memory: "16GB", storage: "512GB SSD" }),
        baseMrp: 249990,
        images: JSON.stringify(["https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "HP Pavilion 15",
        slug: "hp-pavilion-15",
        categoryId: catMap.laptops.id,
        brand: "HP",
        modelNumber: "15-EG2036TU",
        description: "Perfect for work and entertainment.",
        specifications: JSON.stringify({ display: "15.6-inch FHD", processor: "Intel Core i5", memory: "16GB", storage: "512GB SSD" }),
        baseMrp: 65999,
        images: JSON.stringify(["https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/6/7/67U22PA-1_T1682316751.png?wid=400"]),
      },
    }),
    // TVs
    prisma.product.create({
      data: {
        name: "Samsung 55-inch Crystal 4K UHD",
        slug: "samsung-55-crystal-4k",
        categoryId: catMap.tv.id,
        brand: "Samsung",
        modelNumber: "UA55CUE60AKLXL",
        description: "Crystal Processor 4K with HDR.",
        specifications: JSON.stringify({ display: '55" 4K UHD', type: "Crystal UHD", smart: "Tizen OS", connectivity: "3 HDMI, 2 USB" }),
        baseMrp: 52990,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/ua55cue60aklxl/gallery/in-crystal-uhd-cu7000-ua55cue60aklxl-534907422?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "LG 43-inch Smart LED TV",
        slug: "lg-43-smart-led",
        categoryId: catMap.tv.id,
        brand: "LG",
        modelNumber: "43UR7500PSC",
        description: "4K UHD Smart TV with AI Sound.",
        specifications: JSON.stringify({ display: '43" 4K UHD', type: "LED", smart: "webOS", connectivity: "2 HDMI, 1 USB" }),
        baseMrp: 32990,
        images: JSON.stringify(["https://www.lg.com/in/images/tvs/md07554846/gallery/43UR7500PSC-D-01.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Sony Bravia 65-inch OLED",
        slug: "sony-bravia-65-oled",
        categoryId: catMap.tv.id,
        brand: "Sony",
        modelNumber: "XR-65A80L",
        description: "Cognitive Processor XR with OLED display.",
        specifications: JSON.stringify({ display: '65" 4K OLED', type: "OLED", smart: "Google TV", connectivity: "4 HDMI, 2 USB" }),
        baseMrp: 249990,
        images: JSON.stringify(["https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=400"]),
      },
    }),
    // Refrigerators
    prisma.product.create({
      data: {
        name: "LG 260L Double Door Refrigerator",
        slug: "lg-260l-double-door",
        categoryId: catMap.refrigerators.id,
        brand: "LG",
        modelNumber: "GL-I292RPZX",
        description: "Smart Inverter Compressor with Door Cooling.",
        specifications: JSON.stringify({ type: "Double Door", capacity: "260L", energy: "3 Star", features: "Smart Inverter" }),
        baseMrp: 32990,
        images: JSON.stringify(["https://www.lg.com/in/images/refrigerators/md07505246/gallery/GL-I292RPZX-D-01.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung 324L Triple Door",
        slug: "samsung-324l-triple-door",
        categoryId: catMap.refrigerators.id,
        brand: "Samsung",
        modelNumber: "RT34T4513S9/HL",
        description: "Convertible 5-in-1 with Digital Inverter.",
        specifications: JSON.stringify({ type: "Triple Door", capacity: "324L", energy: "3 Star", features: "Convertible" }),
        baseMrp: 41990,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/rt34t4513s9-hl/gallery/in-top-mount-freezer-rt34t4513s9-hl-532859103?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Whirlpool 200L Single Door",
        slug: "whirlpool-200l-single-door",
        categoryId: catMap.refrigerators.id,
        brand: "Whirlpool",
        modelNumber: "WDE 205 CLS 3S",
        description: "IntelliSense Inverter Technology.",
        specifications: JSON.stringify({ type: "Single Door", capacity: "200L", energy: "3 Star", features: "Inverter" }),
        baseMrp: 17990,
        images: JSON.stringify(["https://www.whirlpoolindia.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/2/0/200-l-intellifresh-inverter-3-star-single-door-refrigerator-wine-abyss.jpg?wid=400"]),
      },
    }),
    // Washing Machines
    prisma.product.create({
      data: {
        name: "LG 7kg Front Load Washing Machine",
        slug: "lg-7kg-front-load",
        categoryId: catMap["washing-machines"].id,
        brand: "LG",
        modelNumber: "FHM1207ZDL",
        description: "AI Direct Drive with Steam.",
        specifications: JSON.stringify({ type: "Front Load", capacity: "7kg", features: "AI DD, Steam", energy: "5 Star" }),
        baseMrp: 35990,
        images: JSON.stringify(["https://www.lg.com/in/images/washing-machines/md07505246/gallery/FHM1207ZDL-D-01.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung 8kg Top Load",
        slug: "samsung-8kg-top-load",
        categoryId: catMap["washing-machines"].id,
        brand: "Samsung",
        modelNumber: "WA80T4560BM/TL",
        description: "Ecobubble with Digital Inverter.",
        specifications: JSON.stringify({ type: "Top Load", capacity: "8kg", features: "Ecobubble", energy: "5 Star" }),
        baseMrp: 28990,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/wa80t4560bm-tl/gallery/in-top-load-wa80t4560bm-tl-532859103?wid=400"]),
      },
    }),
    // Air Coolers
    prisma.product.create({
      data: {
        name: "Symphony Diet 22i Tower Cooler",
        slug: "symphony-diet-22i",
        categoryId: catMap["air-coolers"].id,
        brand: "Symphony",
        modelNumber: "Diet 22i",
        description: "Personal Air Cooler with Remote.",
        specifications: JSON.stringify({ type: "Tower", capacity: "22L", coverage: "150 sq ft", features: "Remote, Timer" }),
        baseMrp: 8990,
        images: JSON.stringify(["https://www.symphonylimited.com/images/product/diet-22i-1.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Bajaj DMH 90 Neo Desert Cooler",
        slug: "bajaj-dmh-90-neo",
        categoryId: catMap["air-coolers"].id,
        brand: "Bajaj",
        modelNumber: "DMH 90 NEO",
        description: "Desert Cooler with Ice Chamber.",
        specifications: JSON.stringify({ type: "Desert", capacity: "90L", coverage: "750 sq ft", features: "Ice Chamber" }),
        baseMrp: 12990,
        images: JSON.stringify(["https://www.bajajelectricals.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/b/a/bajaj-dmh-90-neo-90-litres-desert-air-cooler.jpg?wid=400"]),
      },
    }),
    // Fans
    prisma.product.create({
      data: {
        name: "Crompton Greaves 1200mm Ceiling Fan",
        slug: "crompton-1200mm-ceiling-fan",
        categoryId: catMap.fans.id,
        brand: "Crompton",
        modelNumber: "HS Plus",
        description: "High Speed Ceiling Fan with 3 Blades.",
        specifications: JSON.stringify({ type: "Ceiling", size: "1200mm", blades: "3", speed: "370 RPM" }),
        baseMrp: 1899,
        images: JSON.stringify(["https://www.crompton.co.in/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/c/r/crompton-greaves-hs-plus-1200mm-ceiling-fan.jpg?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Orient Electric Table Fan",
        slug: "orient-table-fan",
        categoryId: catMap.fans.id,
        brand: "Orient",
        modelNumber: "Stand 36",
        description: "Portable Table Fan with 3 Speeds.",
        specifications: JSON.stringify({ type: "Table", size: "300mm", speeds: "3", features: "Oscillation" }),
        baseMrp: 2499,
        images: JSON.stringify(["https://www.orientelectric.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/o/r/orient-electric-table-fan-stand-36.jpg?wid=400"]),
      },
    }),
    // Audio
    prisma.product.create({
      data: {
        name: "Sony WH-1000XM5",
        slug: "sony-wh-1000xm5",
        categoryId: catMap.audio.id,
        brand: "Sony",
        modelNumber: "WH1000XM5",
        description: "Industry-leading noise cancellation.",
        specifications: JSON.stringify({ type: "Over-ear", driver: "30mm", battery: "30 hours", features: "Noise cancelling" }),
        baseMrp: 29990,
        images: JSON.stringify(["https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Apple AirPods Pro 2",
        slug: "apple-airpods-pro-2",
        categoryId: catMap.audio.id,
        brand: "Apple",
        modelNumber: "MTJV3HN/A",
        description: "Active Noise Cancellation with H2 chip.",
        specifications: JSON.stringify({ type: "TWS", driver: "11mm", battery: "30 hours with case", features: "ANC, Spatial Audio" }),
        baseMrp: 24900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=400"]),
      },
    }),
    // Gaming
    prisma.product.create({
      data: {
        name: "Sony PlayStation 5",
        slug: "sony-playstation-5",
        categoryId: catMap.gaming.id,
        brand: "Sony",
        modelNumber: "CFI-1218A",
        description: "Next-gen gaming console with 4K support.",
        specifications: JSON.stringify({ type: "Console", storage: "825GB SSD", resolution: "4K 120Hz", features: "Ray Tracing" }),
        baseMrp: 49990,
        images: JSON.stringify(["https://media.direct.playstation.com/is/image/sierialto/PS5-front-with-dualsense?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Xbox Series X",
        slug: "xbox-series-x",
        categoryId: catMap.gaming.id,
        brand: "Microsoft",
        modelNumber: "1TB",
        description: "Most powerful Xbox ever.",
        specifications: JSON.stringify({ type: "Console", storage: "1TB SSD", resolution: "4K 120Hz", features: "Quick Resume" }),
        baseMrp: 55990,
        images: JSON.stringify(["https://assets.xboxservices.com/assets/fb/8d/fb8d9f37-3a59-4b05-9b34-466e6de0d720.jpg?n=Xbox-Series-X_Image-0_1083x1222_02.jpg?wid=400"]),
      },
    }),
    // Cameras
    prisma.product.create({
      data: {
        name: "Canon EOS R6 Mark II",
        slug: "canon-eos-r6-mark-ii",
        categoryId: catMap.cameras.id,
        brand: "Canon",
        modelNumber: "EOS R6 Mark II",
        description: "Full-frame mirrorless camera.",
        specifications: JSON.stringify({ type: "Mirrorless", sensor: "24.2MP Full Frame", video: "4K 60p", features: "IBIS" }),
        baseMrp: 215995,
        images: JSON.stringify(["https://in.canon/media/image/2022/11/03/8e0c0e0e0e0e0e0e0e0e0e0e0e0e0e0e_R6MII-frt.png?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Sony Alpha 7 IV",
        slug: "sony-alpha-7-iv",
        categoryId: catMap.cameras.id,
        brand: "Sony",
        modelNumber: "ILCE-7M4",
        description: "Hybrid full-frame camera.",
        specifications: JSON.stringify({ type: "Mirrorless", sensor: "33MP Full Frame", video: "4K 60p", features: "Real-time Eye AF" }),
        baseMrp: 239990,
        images: JSON.stringify(["https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=400"]),
      },
    }),
    // Speakers
    prisma.product.create({
      data: {
        name: "JBL Flip 6",
        slug: "jbl-flip-6",
        categoryId: catMap.speakers.id,
        brand: "JBL",
        modelNumber: "FLIP6",
        description: "Portable waterproof speaker.",
        specifications: JSON.stringify({ type: "Bluetooth", power: "30W", battery: "12 hours", features: "IP67 Waterproof" }),
        baseMrp: 11999,
        images: JSON.stringify(["https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwe0e0e0e0/JBL_FLIP6_HERO_1605x1605px.png?sw=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Sony HT-S40R Soundbar",
        slug: "sony-ht-s40r-soundbar",
        categoryId: catMap.speakers.id,
        brand: "Sony",
        modelNumber: "HT-S40R",
        description: "5.1ch Home Theater System.",
        specifications: JSON.stringify({ type: "Soundbar", channels: "5.1ch", power: "600W", features: "Wireless Subwoofer" }),
        baseMrp: 29990,
        images: JSON.stringify(["https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=400"]),
      },
    }),
  ]);

  console.log(`Created ${products.length} products across all categories`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
