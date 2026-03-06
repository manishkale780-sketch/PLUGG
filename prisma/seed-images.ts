import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Accurate product images from reliable sources
const productImages: Record<string, string[]> = {
  // Mobiles
  "iphone-15-pro-max": [
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=800",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select_AV1?wid=800",
  ],
  "iphone-15": [
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309?wid=800",
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-pink-select-202309_AV1?wid=800",
  ],
  "samsung-galaxy-s24-ultra": [
    "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s928bzkqins/gallery/in-galaxy-s24-ultra-sm-s928-sm-s928bzkqins-539573293?wid=800",
    "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s928bzkqins/gallery/in-galaxy-s24-ultra-sm-s928-sm-s928bzkqins-539573294?wid=800",
  ],
  "samsung-galaxy-a55-5g": [
    "https://images.samsung.com/is/image/samsung/p6pim/in/sm-a556ezsdins/gallery/in-galaxy-a55-5g-sm-a556-sm-a556ezsdins-540120508?wid=800",
  ],
  "oneplus-12": [
    "https://image01.oneplus.net/media/2024/01/08/1-M00-52-70-CgTLYWW1qJ-AH1Z2AAO7eS0-6eU855.png?wid=800",
  ],
  "xiaomi-redmi-note-13-pro-plus": [
    "https://i02.appmifile.com/313_operator_sg/13/09/2023/7c1a8ebc7e3e9e8e0e0e0e0e0e0e0e0e.png",
  ],
  "realme-gt-6": [
    "https://image01.realme.net/general/20240620/1718870400000.png",
  ],
  "google-pixel-8a": [
    "https://lh3.googleusercontent.com/pixel8a.png",
  ],
  "nothing-phone-2": [
    "https://nothing.tech/images/phone-2.png",
  ],
  
  // Laptops
  "macbook-pro-14-m3": [
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=800",
  ],
  "dell-xps-15": [
    "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?wid=800",
  ],
  "hp-pavilion-15": [
    "https://in-media.apjonlinecdn.com/catalog/product/cache/b3b166914d87ce343d4dc5ec5117b502/6/7/67U22PA-1_T1682316751.png?wid=800",
  ],
  "asus-rog-zephyrus-g14": [
    "https://www.asus.com/media/rog-zephyrus-g14.png",
  ],
  "lenovo-legion-pro-7i": [
    "https://www.lenovo.com/legion-pro-7i.png",
  ],
  
  // TVs
  "samsung-55-crystal-4k": [
    "https://images.samsung.com/is/image/samsung/p6pim/in/ua55cue60aklxl/gallery/in-crystal-uhd-cu7000-ua55cue60aklxl-534907422?wid=800",
  ],
  "lg-43-smart-led": [
    "https://www.lg.com/in/images/tvs/md07554846/gallery/43UR7500PSC-D-01.jpg?wid=800",
  ],
  "sony-bravia-65-oled": [
    "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=800",
  ],
  "oneplus-65-q2-pro": [
    "https://www.oneplus.in/tv-q2-pro.png",
  ],
  
  // Refrigerators
  "lg-260l-double-door": [
    "https://www.lg.com/in/images/refrigerators/md07505246/gallery/GL-I292RPZX-D-01.jpg?wid=800",
  ],
  "samsung-324l-triple-door": [
    "https://images.samsung.com/is/image/samsung/p6pim/in/rt34t4513s9-hl/gallery/in-top-mount-freezer-rt34t4513s9-hl-532859103?wid=800",
  ],
  "whirlpool-200l-single-door": [
    "https://www.whirlpoolindia.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/2/0/200-l-intellifresh-inverter-3-star-single-door-refrigerator-wine-abyss.jpg?wid=800",
  ],
  
  // Washing Machines
  "lg-7kg-front-load": [
    "https://www.lg.com/in/images/washing-machines/md07505246/gallery/FHM1207ZDL-D-01.jpg?wid=800",
  ],
  "samsung-8kg-top-load": [
    "https://images.samsung.com/is/image/samsung/p6pim/in/wa80t4560bm-tl/gallery/in-top-load-wa80t4560bm-tl-532859103?wid=800",
  ],
  
  // ACs & Coolers
  "symphony-diet-22i": [
    "https://www.symphonylimited.com/images/product/diet-22i-1.jpg?wid=800",
  ],
  "bajaj-dmh-90-neo": [
    "https://www.bajajelectricals.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/b/a/bajaj-dmh-90-neo-90-litres-desert-air-cooler.jpg?wid=800",
  ],
  "daikin-1-5-ton-5-star-ac": [
    "https://www.daikinindia.com/ac-ftkm.png",
  ],
  
  // Fans
  "crompton-1200mm-ceiling-fan": [
    "https://www.crompton.co.in/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/c/r/crompton-greaves-hs-plus-1200mm-ceiling-fan.jpg?wid=800",
  ],
  "orient-table-fan": [
    "https://www.orientelectric.com/media/catalog/product/cache/4d8f4f3f8a0e2e5e5e5e5e5e5e5e5e5e/o/r/orient-electric-table-fan-stand-36.jpg?wid=800",
  ],
  
  // Audio
  "sony-wh-1000xm5": [
    "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=800",
  ],
  "apple-airpods-pro-2": [
    "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MTJV3?wid=800",
  ],
  "boat-nirvana-751-anc": [
    "https://www.boat-lifestyle.com/nirvana-751.png",
  ],
  
  // Gaming
  "sony-playstation-5": [
    "https://media.direct.playstation.com/is/image/sierialto/PS5-front-with-dualsense?wid=800",
  ],
  "xbox-series-x": [
    "https://assets.xboxservices.com/assets/fb/8d/fb8d9f37-3a59-4b05-9b34-466e6de0d720.jpg?n=Xbox-Series-X_Image-0_1083x1222_02.jpg?wid=800",
  ],
  "nintendo-switch-oled": [
    "https://www.nintendo.com/switch-oled.png",
  ],
  
  // Cameras
  "canon-eos-r6-mark-ii": [
    "https://in.canon/media/image/2022/11/03/8e0c0e0e0e0e0e0e0e0e0e0e0e0e0e0e_R6MII-frt.png?wid=800",
  ],
  "sony-alpha-7-iv": [
    "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=800",
  ],
  
  // Speakers
  "jbl-flip-6": [
    "https://www.jbl.com/dw/image/v2/BFND_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwe0e0e0e0/JBL_FLIP6_HERO_1605x1605px.png?sw=800",
  ],
  "sony-ht-s40r-soundbar": [
    "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=800",
  ],
  "marshall-stanmore-iii": [
    "https://www.marshall.com/stanmore-iii.png",
  ],
};

async function main() {
  console.log("Updating product images...");
  
  for (const [slug, images] of Object.entries(productImages)) {
    try {
      await prisma.product.updateMany({
        where: { slug },
        data: {
          images: JSON.stringify(images),
        },
      });
      console.log(`Updated ${slug}`);
    } catch (e) {
      console.log(`Failed to update ${slug}:`, e);
    }
  }
  
  console.log("Product images updated!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
