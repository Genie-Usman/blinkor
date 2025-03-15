import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";
import ClientCaps from "./ClientCaps";

export const dynamic = "force-dynamic";

const Caps = async () => {
  await connectDB();
  const caps = await Products.find({
    category: { $in: ["cartoon caps", "comic caps"] }
  }).lean().exec();
  caps.sort(() => Math.random() - 0.5);

  const processCaps = (products) => {
    return products.reduce((acc, item) => {
      if (!Array.isArray(item.variants)) return acc;

      const discount = item.discount || 0;
      const discountedPrice = (item.price - (item.price * discount) / 100).toFixed(2);
      const availableVariants = item.variants.filter(v => v.availableQuantity > 0);
      const uniqueColors = [...new Set(availableVariants.map(v => v.color))];
      const uniqueSizes = [...new Set(availableVariants.map(v => v.size))];
      const image = availableVariants.find(v => v.image)?.image || item.image || "/placeholder.jpg";

      if (acc.caps[item.title]) {
        acc.caps[item.title].colors.push(...uniqueColors.filter(c => !acc.caps[item.title].colors.includes(c)));
        acc.caps[item.title].sizes.push(...uniqueSizes.filter(s => !acc.caps[item.title].sizes.includes(s)));
      } else {
        acc.caps[item.title] = {
          _id: item._id.toString(),
          title: item.title,
          slug: item.slug,
          image,
          price: item.price,
          discountedPrice,
          discount,
          colors: uniqueColors,
          sizes: uniqueSizes,
        };
      }

      acc.formattedProducts.push({
        _id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        category: item.category,
        image,
        price: item.price,
        discountedPrice,
        discount,
        colors: uniqueColors,
        sizes: uniqueSizes,
      });

      return acc;
    }, { caps: {}, formattedProducts: [] });
  };

  const processedData = processCaps(caps);

  return (
    <section className="text-gray-600 body-font">
      <ClientCaps caps={processedData.formattedProducts} />
    </section>
  );
};

export default Caps;
