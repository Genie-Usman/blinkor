import HomePageClient from "./HomePageClient";
import ClientRecommendedProducts from "../components/ClientRecommendedProducts";
import { connectDB } from "../app/lib/mongodb";
import Products from "../models/Products";

export default async function Home() {
  await connectDB();
  const recommendedProducts = await Products.aggregate([
    {
      $match: {
        category: {
          $in: [
            "coding tshirts", "minions tshirts", "cartoon caps", "comic caps"
          ]
        }
      }
    },
    { $sample: { size: 20 } }
  ]);

  const processRecommendedProducts = (products) => {
    return products.reduce((acc, item) => {
      if (!Array.isArray(item.variants)) return acc;

      const discount = item.discount || 0;
      const discountedPrice = (item.price - (item.price * discount) / 100).toFixed(2);
      const availableVariants = item.variants?.filter(v => v.availableQuantity > 0) || [];
      const uniqueColors = [...new Set(availableVariants.map(v => v.color))];
      const uniqueSizes = [...new Set(availableVariants.map(v => v.size))];
      const image = availableVariants.find(v => v.image)?.image || item.image || "/placeholder.jpg";

      if (acc.recommendedProducts[item.title]) {
        acc.recommendedProducts[item.title].colors.push(
          ...uniqueColors.filter(c => !acc.recommendedProducts[item.title].colors.includes(c))
        );
        acc.recommendedProducts[item.title].sizes.push(
          ...uniqueSizes.filter(s => !acc.recommendedProducts[item.title].sizes.includes(s))
        );
      } else {
        acc.recommendedProducts[item.title] = {
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
    }, { recommendedProducts: {}, formattedProducts: [] });
  };
  const processedData = processRecommendedProducts(recommendedProducts);

  return (
    <>
      <HomePageClient />
      <ClientRecommendedProducts recommendedProducts={processedData.formattedProducts} />
    </>
  );
}
