import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";
import ClientMugs from "./ClientMugs";

const Mugs = async () => {
  await connectDB();
  const mugs = await Products.find({
    category: { $in: ["comic sips", "screen sips", "toon sips"] }
  }).lean();
  mugs.sort(() => Math.random() - 0.5);

  const processMugs = (products) => {
    return products.reduce((acc, item) => {
      if (!Array.isArray(item.variants)) return acc;

      const discount = item.discount || 0;
      const discountedPrice = (item.price - (item.price * discount) / 100).toFixed(2);
      const availableVariants = item.variants.filter(v => v.availableQuantity > 0);
      const uniqueColors = [...new Set(availableVariants.map(v => v.color))];
      const uniqueSizes = [...new Set(availableVariants.map(v => v.size))];
      const image = availableVariants.find(v => v.image)?.image || item.image || "/placeholder.jpg";

      if (acc.mugs[item.title]) {
        acc.mugs[item.title].colors.push(...uniqueColors.filter(c => !acc.mugs[item.title].colors.includes(c)));
        acc.mugs[item.title].sizes.push(...uniqueSizes.filter(s => !acc.mugs[item.title].sizes.includes(s)));
      } else {
        acc.mugs[item.title] = {
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
    }, { mugs: {}, formattedProducts: [] });
  };

  const processedData = processMugs(mugs);

  return (
    <section className="text-gray-600 body-font">
      <ClientMugs mugs={processedData.formattedProducts} />
    </section>
  );
};

export default Mugs;
