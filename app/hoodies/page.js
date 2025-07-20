import { connectDB } from "../../lib/database/mongodb";
import Products from "../../lib/database/models/Products";
import ClientHoodies from "./ClientHoodies";

export const dynamic = "force-dynamic";

const Hoodies = async () => {
  await connectDB();
  const hoodies = await Products.find({
    category: { $in: ["coding hoodies", "stylish hoodies"] }
  }).lean().exec();
  hoodies.sort(() => Math.random() - 0.5);

  const processHoodies = (products) => {
    return products.reduce((acc, item) => {
      if (!Array.isArray(item.variants)) return acc;

      const discount = item.discount || 0;
      const discountedPrice = (item.price - (item.price * discount) / 100).toFixed(2);
      const availableVariants = item.variants.filter(v => v.availableQuantity > 0);
      const uniqueColors = [...new Set(availableVariants.map(v => v.color))];
      const uniqueSizes = [...new Set(availableVariants.map(v => v.size))];
      const image = availableVariants.find(v => v.image)?.image || item.image || "/placeholder.jpg";

      if (acc.hoodies[item.title]) {
        acc.hoodies[item.title].colors.push(...uniqueColors.filter(c => !acc.hoodies[item.title].colors.includes(c)));
        acc.hoodies[item.title].sizes.push(...uniqueSizes.filter(s => !acc.hoodies[item.title].sizes.includes(s)));
      } else {
        acc.hoodies[item.title] = {
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
    }, { hoodies: {}, formattedProducts: [] });
  };

  const processedData = processHoodies(hoodies);

  return (
    <section className="text-gray-600 body-font">
      <ClientHoodies hoodies={processedData.formattedProducts} />
    </section>
  );
};

export default Hoodies;
