const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCT_IMAGES = {
  "samsung galaxy": ["https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-sm-s921-sm-s921bzyainu-thumb-539573169?$300_300_PNG$", "https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-sm-s921-sm-s921bzyainu-thumb-539573172?$300_300_PNG$"],
  "iphone": ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=400", "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=400"],
  "oneplus": ["https://oasis.opstatics.com/content/dam/oasis/page/2024/in/smartphones/oneplus-12/specs/flowy-emerald-img.png", "https://oasis.opstatics.com/content/dam/oasis/page/2024/in/smartphones/oneplus-12/specs/silky-black-img.png"],
  "macbook": ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=400", "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-starlight-select-202402?wid=400"],
  "ipad": ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=400"],
  "sony tv": ["https://electronics.sony.com/image/resource/prod/f2/5a/0c3c44c0e21c5769e1d4d6b7f5b1a5c1.png?w=400"],
  "samsung tv": ["https://images.samsung.com/is/image/samsung/p6pim/in/ue43cuc7000uxxb-thumb-536679997?$400_400_WEB_JPG$"],
  "lg refrigerator": ["https://www.lg.com/in/images/refrigerators/md07507031/gallery/GL-I292RPZU-1.jpg", "https://www.lg.com/in/images/refrigerators/md07507031/gallery/GL-I292RPZU-2.jpg"],
  "whirlpool": ["https://www.whirlpoolindia.com/pub/media/catalog/product/w/h/whirlpool-fridge-1.png"],
  "lg washing": ["https://www.lg.com/in/images/washing-machines/md07552534/gallery/FHM1207SDM-Front-View.jpg"],
  "daikin": ["https://www.daikinindia.com/sites/default/files/Daikin-AC-1.png"],
  "voltas": ["https://www.voltas.com/wp-content/uploads/2023/05/voltas-ac-1.png"],
  "crompton": ["https://www.crompton.co.in/wp-content/uploads/2023/05/crompton-fan-1.png"],
  "sony headphone": ["https://electronics.sony.com/image/resource/prod/3e/03/2cb0c3b0e21c5769e1d4d6b7f5b1a5c1.png?w=400"],
  "jbl": ["https://www.jbl.com/on/demandware.static/-/Sites-jbl-master-catalog-us/en_US/dw9d6ee66d/images/Flip_6_Hero_1.png"],
  "playstation": ["https://media.direct.playstation.com/is/image/sierialto/PS5-console-front?wid=400"],
  "canon": ["https://img.us.spydercamera.com/spyder-media/products/canon-eos-r6-1.png?w=400"],
  "galaxy watch": ["https://images.samsung.com/is/image/samsung/p6pim/in/sm-r960nzkainu/gallery/in-galaxy-watch-6-classic-sm-r960-sm-r960nzkainu-540120508?$300_300_PNG$"],
  "realme": ["https://image01.realme.net/general/20240115/1705295921859.png?w=400"],
  "xiaomi": ["https://i02.appmifile.com/mi-com-product/fly-mic/xiaomi-13-pro/1.png?w=400"]
};

const DEFAULT_IMAGES = {
  "mobiles": ["https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-sm-s921-sm-s921bzyainu-thumb-539573169?$300_300_PNG$"],
  "laptops": ["https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=400"],
  "tv": ["https://images.samsung.com/is/image/samsung/p6pim/in/ue43cuc7000uxxb-thumb-536679997?$400_400_WEB_JPG$"],
  "refrigerators": ["https://www.lg.com/in/images/refrigerators/md07507031/gallery/GL-I292RPZU-1.jpg"],
  "washing": ["https://www.lg.com/in/images/washing-machines/md07552534/gallery/FHM1207SDM-Front-View.jpg"],
  "ac": ["https://www.daikinindia.com/sites/default/files/Daikin-AC-1.png"],
  "fans": ["https://www.crompton.co.in/wp-content/uploads/2023/05/crompton-fan-1.png"],
  "audio": ["https://www.jbl.com/on/demandware.static/-/Sites-jbl-master-catalog-us/en_US/dw9d6ee66d/images/Flip_6_Hero_1.png"],
  "gaming": ["https://media.direct.playstation.com/is/image/sierialto/PS5-console-front?wid=400"],
  "cameras": ["https://img.us.spydercamera.com/spyder-media/products/canon-eos-r6-1.png?w=400"]
};

function getImagesForProduct(product) {
  const name = product.name.toLowerCase();
  const category = product.category?.slug?.toLowerCase() || "";
  
  for (const [key, images] of Object.entries(PRODUCT_IMAGES)) {
    if (name.includes(key)) return images;
  }
  
  for (const [cat, images] of Object.entries(DEFAULT_IMAGES)) {
    if (category.includes(cat) || name.includes(cat)) return images;
  }
  
  return ["https://via.placeholder.com/400x400?text=Product"];
}

async function main() {
  console.log("Updating product images...");
  const products = await prisma.product.findMany({ include: { category: true } });
  console.log("Found " + products.length + " products");
  
  for (const product of products) {
    const images = getImagesForProduct(product);
    await prisma.product.update({
      where: { id: product.id },
      data: { images: JSON.stringify(images) }
    });
    console.log("Updated: " + product.name);
  }
  console.log("Done!");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
