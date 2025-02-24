import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";
import ClientTshirts from "./ClientTshirts";

const Tshirts = async () => {
  await connectDB();
  const tshirts = await Products.find({
    category: { $in: ["coding tshirts", "minions tshirts"] }
  }).lean();
  tshirts.sort(() => Math.random() - 0.5);

  const processTshirts = (products) => {
    return products.reduce((acc, item) => {
      if (!Array.isArray(item.variants)) return acc;

      const discount = item.discount || 0;
      const discountedPrice = (item.price - (item.price * discount) / 100).toFixed(2);
      const availableVariants = item.variants.filter(v => v.availableQuantity > 0);
      const uniqueColors = [...new Set(availableVariants.map(v => v.color))];
      const uniqueSizes = [...new Set(availableVariants.map(v => v.size))];
      const image = availableVariants.find(v => v.image)?.image || item.image || "/placeholder.jpg";

      if (acc.tshirts[item.title]) {
        acc.tshirts[item.title].colors.push(...uniqueColors.filter(c => !acc.tshirts[item.title].colors.includes(c)));
        acc.tshirts[item.title].sizes.push(...uniqueSizes.filter(s => !acc.tshirts[item.title].sizes.includes(s)));
      } else {
        acc.tshirts[item.title] = {
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
    }, { tshirts: {}, formattedProducts: [] });
  };

  const processedData = processTshirts(tshirts);

  return (
    <section className="text-gray-600 body-font">
      <ClientTshirts tshirts={processedData.formattedProducts} />
    </section>
  );
};

export default Tshirts;
