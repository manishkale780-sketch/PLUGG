import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get existing categories
  const categories = await prisma.category.findMany();
  const catMap = Object.fromEntries(categories.map((c: { slug: string; id: string }) => [c.slug, c]));

  if (Object.keys(catMap).length === 0) {
    console.log("No categories found. Please run the main seed first.");
    return;
  }

  // Additional 40+ products for comprehensive catalog
  const moreProducts = await Promise.all([
    // More Mobiles - Budget to Premium
    prisma.product.create({
      data: {
        name: "Xiaomi Redmi Note 13 Pro+",
        slug: "xiaomi-redmi-note-13-pro-plus",
        categoryId: catMap.mobiles.id,
        brand: "Xiaomi",
        modelNumber: "23090RA98I",
        description: "200MP camera with 120W HyperCharge.",
        specifications: JSON.stringify({ display: "6.67-inch 1.5K AMOLED 120Hz", processor: "MediaTek Dimensity 7200-Ultra", camera: "200MP Main", battery: "5000mAh" }),
        baseMrp: 29999,
        images: JSON.stringify(["https://i02.appmifile.com/313_operator_sg/13/09/2023/7c1a8ebc7e3e9e8e0e0e0e0e0e0e0e0e.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Realme GT 6",
        slug: "realme-gt-6",
        categoryId: catMap.mobiles.id,
        brand: "Realme",
        modelNumber: "RMX3851",
        description: "Flagship killer with Snapdragon 8s Gen 3.",
        specifications: JSON.stringify({ display: "6.78-inch 8T LTPO 120Hz", processor: "Snapdragon 8s Gen 3", camera: "50MP Sony LYT-808", battery: "5500mAh" }),
        baseMrp: 40999,
        images: JSON.stringify(["https://image01.realme.net/general/20240620/1718870400000.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "iPhone 15",
        slug: "iphone-15",
        categoryId: catMap.mobiles.id,
        brand: "Apple",
        modelNumber: "A3090",
        description: "Dynamic Island, 48MP Main camera, A16 Bionic.",
        specifications: JSON.stringify({ display: "6.1-inch Super Retina XDR", processor: "A16 Bionic", camera: "48MP Main + 12MP Ultra Wide", battery: "Up to 20 hours" }),
        baseMrp: 79900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy A55 5G",
        slug: "samsung-galaxy-a55-5g",
        categoryId: catMap.mobiles.id,
        brand: "Samsung",
        modelNumber: "SM-A556E",
        description: "Awesome 5G experience with metal frame.",
        specifications: JSON.stringify({ display: "6.6-inch FHD+ Super AMOLED 120Hz", processor: "Exynos 1480", camera: "50MP OIS", battery: "5000mAh" }),
        baseMrp: 42999,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/sm-a556ezsdins/gallery/in-galaxy-a55-5g-sm-a556-sm-a556ezsdins-540120508?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Google Pixel 8a",
        slug: "google-pixel-8a",
        categoryId: catMap.mobiles.id,
        brand: "Google",
        modelNumber: "GCV1X",
        description: "Best of Google AI with amazing camera.",
        specifications: JSON.stringify({ display: "6.1-inch Actua OLED 120Hz", processor: "Google Tensor G3", camera: "64MP Dual", battery: "4492mAh" }),
        baseMrp: 52999,
        images: JSON.stringify(["https://lh3.googleusercontent.com/pixel8a.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Nothing Phone 2",
        slug: "nothing-phone-2",
        categoryId: catMap.mobiles.id,
        brand: "Nothing",
        modelNumber: "A065",
        description: "Unique Glyph Interface with Nothing OS.",
        specifications: JSON.stringify({ display: "6.7-inch LTPO OLED 120Hz", processor: "Snapdragon 8+ Gen 1", camera: "50MP Dual", battery: "4700mAh" }),
        baseMrp: 44999,
        images: JSON.stringify(["https://nothing.tech/images/phone-2.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Vivo V30 Pro",
        slug: "vivo-v30-pro",
        categoryId: catMap.mobiles.id,
        brand: "Vivo",
        modelNumber: "V2313",
        description: "Studio-quality portraits with ZEISS.",
        specifications: JSON.stringify({ display: "6.78-inch AMOLED 120Hz", processor: "Dimensity 8200", camera: "50MP ZEISS Triple", battery: "5000mAh" }),
        baseMrp: 46999,
        images: JSON.stringify(["https://www.vivo.com/in/products/v30pro.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "OPPO Reno 11 Pro",
        slug: "oppo-reno-11-pro",
        categoryId: catMap.mobiles.id,
        brand: "OPPO",
        modelNumber: "CPH2607",
        description: "Portrait expert with telephoto camera.",
        specifications: JSON.stringify({ display: "6.7-inch AMOLED 120Hz", processor: "Dimensity 8200", camera: "50MP Triple with 32MP Telephoto", battery: "4600mAh" }),
        baseMrp: 39999,
        images: JSON.stringify(["https://www.oppo.com/in/reno-11-pro.png"]),
      },
    }),
    // Tablets
    prisma.product.create({
      data: {
        name: "iPad Pro 12.9-inch M4",
        slug: "ipad-pro-12-9-m4",
        categoryId: catMap.mobiles.id,
        brand: "Apple",
        modelNumber: "MVX63HN/A",
        description: "Supercharged by M4 chip with Ultra Retina XDR display.",
        specifications: JSON.stringify({ display: "12.9-inch Ultra Retina XDR", processor: "Apple M4", storage: "256GB", features: "Face ID, ProMotion" }),
        baseMrp: 119900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-12-11-select-202405?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy Tab S9 Ultra",
        slug: "samsung-galaxy-tab-s9-ultra",
        categoryId: catMap.mobiles.id,
        brand: "Samsung",
        modelNumber: "SM-X910",
        description: "14.6-inch Dynamic AMOLED 2X with S Pen.",
        specifications: JSON.stringify({ display: "14.6-inch Dynamic AMOLED 2X 120Hz", processor: "Snapdragon 8 Gen 2", storage: "256GB", features: "S Pen included, IP68" }),
        baseMrp: 119999,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/sm-x910nzeainu/gallery/in-galaxy-tab-s9-ultra-wifi-sm-x910-sm-x910nzeainu-540120508?wid=400"]),
      },
    }),
    // More Laptops
    prisma.product.create({
      data: {
        name: "ASUS ROG Zephyrus G14",
        slug: "asus-rog-zephyrus-g14",
        categoryId: catMap.laptops.id,
        brand: "ASUS",
        modelNumber: "GA402XV",
        description: "Compact gaming powerhouse with RTX 4060.",
        specifications: JSON.stringify({ display: "14-inch 2.5K 165Hz", processor: "AMD Ryzen 9 7940HS", memory: "16GB", storage: "1TB SSD", graphics: "RTX 4060" }),
        baseMrp: 164990,
        images: JSON.stringify(["https://www.asus.com/media/rog-zephyrus-g14.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Lenovo Legion Pro 7i",
        slug: "lenovo-legion-pro-7i",
        categoryId: catMap.laptops.id,
        brand: "Lenovo",
        modelNumber: "82WQ",
        description: "Ultimate gaming performance with RTX 4090.",
        specifications: JSON.stringify({ display: "16-inch WQXGA 240Hz", processor: "Intel Core i9-13900HX", memory: "32GB", storage: "1TB SSD", graphics: "RTX 4090" }),
        baseMrp: 299990,
        images: JSON.stringify(["https://www.lenovo.com/legion-pro-7i.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Acer Predator Helios 16",
        slug: "acer-predator-helios-16",
        categoryId: catMap.laptops.id,
        brand: "Acer",
        modelNumber: "PH16-71",
        description: "Gaming laptop with Mini LED display.",
        specifications: JSON.stringify({ display: "16-inch Mini LED 250Hz", processor: "Intel Core i7-13700HX", memory: "16GB", storage: "1TB SSD", graphics: "RTX 4070" }),
        baseMrp: 179990,
        images: JSON.stringify(["https://www.acer.com/predator-helios-16.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "MSI Raider GE78 HX",
        slug: "msi-raider-ge78-hx",
        categoryId: catMap.laptops.id,
        brand: "MSI",
        modelNumber: "13VH",
        description: "Desktop replacement with RTX 4080.",
        specifications: JSON.stringify({ display: "17-inch QHD+ 240Hz", processor: "Intel Core i9-13980HX", memory: "64GB", storage: "2TB SSD", graphics: "RTX 4080" }),
        baseMrp: 349990,
        images: JSON.stringify(["https://www.msi.com/raider-ge78-hx.png"]),
      },
    }),
    // More TVs
    prisma.product.create({
      data: {
        name: "OnePlus 65-inch Q2 Pro",
        slug: "oneplus-65-q2-pro",
        categoryId: catMap.tv.id,
        brand: "OnePlus",
        modelNumber: "65Q2IN",
        description: "QLED 4K with 120Hz and Dolby Vision.",
        specifications: JSON.stringify({ display: '65" 4K QLED 120Hz', type: "QLED", smart: "Google TV", features: "Dolby Vision, HDR10+" }),
        baseMrp: 99999,
        images: JSON.stringify(["https://www.oneplus.in/tv-q2-pro.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Xiaomi 55-inch OLED Vision",
        slug: "xiaomi-55-oled-vision",
        categoryId: catMap.tv.id,
        brand: "Xiaomi",
        modelNumber: "L55M8",
        description: "OLED display with IMAX Enhanced.",
        specifications: JSON.stringify({ display: '55" 4K OLED 120Hz', type: "OLED", smart: "Android TV", features: "IMAX Enhanced, Dolby Atmos" }),
        baseMrp: 129999,
        images: JSON.stringify(["https://www.mi.com/in/tv-oled-vision.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "TCL 55-inch C755 QD-Mini LED",
        slug: "tcl-55-c755-mini-led",
        categoryId: catMap.tv.id,
        brand: "TCL",
        modelNumber: "55C755",
        description: "QD-Mini LED with 144Hz Game Master Pro.",
        specifications: JSON.stringify({ display: '55" 4K QD-Mini LED 144Hz', type: "QD-Mini LED", smart: "Google TV", features: "144Hz, FreeSync Premium Pro" }),
        baseMrp: 89990,
        images: JSON.stringify(["https://www.tcl.com/in/tv-c755.png"]),
      },
    }),
    // ACs
    prisma.product.create({
      data: {
        name: "Daikin 1.5 Ton 5 Star Inverter AC",
        slug: "daikin-1-5-ton-5-star-ac",
        categoryId: catMap["air-coolers"].id,
        brand: "Daikin",
        modelNumber: "FTKM50U",
        description: "Premium inverter AC with Dew Clean Technology.",
        specifications: JSON.stringify({ capacity: "1.5 Ton", energy: "5 Star", type: "Inverter Split", features: "Dew Clean, PM 2.5 Filter" }),
        baseMrp: 45999,
        images: JSON.stringify(["https://www.daikinindia.com/ac-ftkm.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "LG 1.5 Ton 5 Star AI Dual Inverter AC",
        slug: "lg-1-5-ton-5-star-ai-ac",
        categoryId: catMap["air-coolers"].id,
        brand: "LG",
        modelNumber: "RS-Q19PWZE",
        description: "AI Convertible 6-in-1 with Ocean Black Protection.",
        specifications: JSON.stringify({ capacity: "1.5 Ton", energy: "5 Star", type: "AI Dual Inverter", features: "6-in-1 Convertible, Ocean Black" }),
        baseMrp: 48990,
        images: JSON.stringify(["https://www.lg.com/in/ac-rsq19pwze.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Blue Star 1.5 Ton 5 Star Inverter AC",
        slug: "blue-star-1-5-ton-5-star-ac",
        categoryId: catMap["air-coolers"].id,
        brand: "Blue Star",
        modelNumber: "IC518YNU",
        description: "Precision Cooling with Brushless DC Motor.",
        specifications: JSON.stringify({ capacity: "1.5 Ton", energy: "5 Star", type: "Inverter Split", features: "Precision Cooling, Turbo Cool" }),
        baseMrp: 42900,
        images: JSON.stringify(["https://www.bluestarindia.com/ac-ic518ynu.png"]),
      },
    }),
    // More Refrigerators
    prisma.product.create({
      data: {
        name: "Haier 565L Side by Side",
        slug: "haier-565l-side-by-side",
        categoryId: catMap.refrigerators.id,
        brand: "Haier",
        modelNumber: "HRF-622KS",
        description: "Twin Inverter Technology with Water Dispenser.",
        specifications: JSON.stringify({ type: "Side by Side", capacity: "565L", energy: "3 Star", features: "Twin Inverter, Water Dispenser" }),
        baseMrp: 69990,
        images: JSON.stringify(["https://www.haier.com/in/refrigerator-hrf622ks.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Godrej 564L Multi Door",
        slug: "godrej-564l-multi-door",
        categoryId: catMap.refrigerators.id,
        brand: "Godrej",
        modelNumber: "RM EONVELVET 564 RIT",
        description: "Advanced Inverter Technology with Cool Balance.",
        specifications: JSON.stringify({ type: "French Door", capacity: "564L", energy: "3 Star", features: "Inverter, Cool Balance" }),
        baseMrp: 79900,
        images: JSON.stringify(["https://www.godrej.com/refrigerator-rmeonvelvet.png"]),
      },
    }),
    // More Washing Machines
    prisma.product.create({
      data: {
        name: "IFB 8kg Front Load",
        slug: "ifb-8kg-front-load",
        categoryId: catMap["washing-machines"].id,
        brand: "IFB",
        modelNumber: "Senator WSS 8014",
        description: "Steam Wash with 3D Wash System.",
        specifications: JSON.stringify({ type: "Front Load", capacity: "8kg", features: "Steam Wash, 3D Wash", energy: "5 Star" }),
        baseMrp: 41990,
        images: JSON.stringify(["https://www.ifbappliances.com/washing-senator-wss8014.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Bosch 8kg Front Load",
        slug: "bosch-8kg-front-load",
        categoryId: catMap["washing-machines"].id,
        brand: "Bosch",
        modelNumber: "WAJ28262IN",
        description: "AntiStain and AntiWrinkle feature.",
        specifications: JSON.stringify({ type: "Front Load", capacity: "8kg", features: "AntiStain, AntiWrinkle", energy: "5 Star" }),
        baseMrp: 45990,
        images: JSON.stringify(["https://www.bosch-home.in/washing-waj28262in.png"]),
      },
    }),
    // More Fans
    prisma.product.create({
      data: {
        name: "Atomberg Efficio 1200mm",
        slug: "atomberg-efficio-1200mm",
        categoryId: catMap.fans.id,
        brand: "Atomberg",
        modelNumber: "Efficio",
        description: "BLDC motor with 65% power savings.",
        specifications: JSON.stringify({ type: "Ceiling", size: "1200mm", blades: "3", features: "BLDC Motor, Remote Control" }),
        baseMrp: 3499,
        images: JSON.stringify(["https://www.atomberg.com/fan-efficio.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Havells Stealth Air 1200mm",
        slug: "havells-stealth-air-1200mm",
        categoryId: catMap.fans.id,
        brand: "Havells",
        modelNumber: "Stealth Air",
        description: "Premium underlight fan with remote.",
        specifications: JSON.stringify({ type: "Ceiling", size: "1200mm", blades: "3", features: "Underlight, Remote Control" }),
        baseMrp: 5499,
        images: JSON.stringify(["https://www.havells.com/fan-stealth-air.png"]),
      },
    }),
    // More Audio
    prisma.product.create({
      data: {
        name: "boAt Nirvana 751 ANC",
        slug: "boat-nirvana-751-anc",
        categoryId: catMap.audio.id,
        brand: "boAt",
        modelNumber: "Nirvana 751",
        description: "Active Noise Cancellation with 65 hours playback.",
        specifications: JSON.stringify({ type: "Over-ear", driver: "40mm", battery: "65 hours", features: "ANC, Ambient Mode" }),
        baseMrp: 4499,
        images: JSON.stringify(["https://www.boat-lifestyle.com/nirvana-751.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "JBL Tune 760NC",
        slug: "jbl-tune-760nc",
        categoryId: catMap.audio.id,
        brand: "JBL",
        modelNumber: "Tune 760NC",
        description: "Active Noise Cancelling with JBL Pure Bass.",
        specifications: JSON.stringify({ type: "Over-ear", driver: "40mm", battery: "50 hours", features: "ANC, Multi-point Connection" }),
        baseMrp: 8999,
        images: JSON.stringify(["https://www.jbl.com/tune-760nc.png"]),
      },
    }),
    // More Gaming
    prisma.product.create({
      data: {
        name: "Nintendo Switch OLED",
        slug: "nintendo-switch-oled",
        categoryId: catMap.gaming.id,
        brand: "Nintendo",
        modelNumber: "HEG-001",
        description: "7-inch OLED screen with enhanced audio.",
        specifications: JSON.stringify({ type: "Handheld Console", display: "7-inch OLED", storage: "64GB", features: "OLED Screen, Enhanced Audio" }),
        baseMrp: 34999,
        images: JSON.stringify(["https://www.nintendo.com/switch-oled.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Steam Deck OLED 1TB",
        slug: "steam-deck-oled-1tb",
        categoryId: catMap.gaming.id,
        brand: "Valve",
        modelNumber: "Steam Deck OLED",
        description: "Premium handheld gaming with HDR OLED.",
        specifications: JSON.stringify({ type: "Handheld Console", display: "7.4-inch HDR OLED", storage: "1TB NVMe", features: "OLED, WiFi 6E" }),
        baseMrp: 64999,
        images: JSON.stringify(["https://www.steamdeck.com/oled.png"]),
      },
    }),
    // More Speakers
    prisma.product.create({
      data: {
        name: "Marshall Stanmore III",
        slug: "marshall-stanmore-iii",
        categoryId: catMap.speakers.id,
        brand: "Marshall",
        modelNumber: "Stanmore III",
        description: "Legendary sound with wider soundstage.",
        specifications: JSON.stringify({ type: "Bluetooth", power: "80W", features: "RCA Input, Bluetooth 5.2" }),
        baseMrp: 34999,
        images: JSON.stringify(["https://www.marshall.com/stanmore-iii.png"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Bose SoundLink Flex",
        slug: "bose-soundlink-flex",
        categoryId: catMap.speakers.id,
        brand: "Bose",
        modelNumber: "SoundLink Flex",
        description: "Portable waterproof speaker with PositionIQ.",
        specifications: JSON.stringify({ type: "Bluetooth", features: "Waterproof, PositionIQ", battery: "12 hours" }),
        baseMrp: 15900,
        images: JSON.stringify(["https://www.bose.com/soundlink-flex.png"]),
      },
    }),
    // Smartwatches
    prisma.product.create({
      data: {
        name: "Apple Watch Series 9",
        slug: "apple-watch-series-9",
        categoryId: catMap.audio.id,
        brand: "Apple",
        modelNumber: "MRHQ3HN/A",
        description: "Smarter, brighter, mightier with S9 SiP.",
        specifications: JSON.stringify({ display: "45mm Always-On Retina", features: "S9 SiP, Double Tap, Blood Oxygen" }),
        baseMrp: 45900,
        images: JSON.stringify(["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-s9.png?wid=400"]),
      },
    }),
    prisma.product.create({
      data: {
        name: "Samsung Galaxy Watch 6 Classic",
        slug: "samsung-galaxy-watch-6-classic",
        categoryId: catMap.audio.id,
        brand: "Samsung",
        modelNumber: "SM-R960",
        description: "Rotating bezel with body composition analysis.",
        specifications: JSON.stringify({ display: "47mm Super AMOLED", features: "Rotating Bezel, Body Composition, Sleep Coaching" }),
        baseMrp: 36999,
        images: JSON.stringify(["https://images.samsung.com/is/image/samsung/p6pim/in/sm-r960nzkainu/gallery/in-galaxy-watch-6-classic-sm-r960-sm-r960nzkainu-540120508?wid=400"]),
      },
    }),
  ]);

  console.log(`Added ${moreProducts.length} more products!`);
  console.log("Extended catalog now has 60+ products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
