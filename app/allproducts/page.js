import { connectDB } from "../../lib/database/mongodb";
import Products from "../../lib/database/models/Products";
import ClientAllProducts from "./ClientAllProducts";

const AllProducts = async () => {
    await connectDB();
    const products = await Products.find({
        category: { $in: ["coding tshirts", "minions tshirts", "coding hoodies", "stylish hoodies", "cartoon caps", "comic caps","comic sips","screen sips", "toon sips"] },
    }).lean();

    products.sort(() => Math.random() - 0.5);

    const formattedProducts = products.map((item) => ({
        _id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        image: item.variants.find(v => v.availableQuantity > 0)?.image || item.image || "/placeholder.jpg",
        category: item.category,
        price: item.price,
        discountedPrice: (item.price - (item.price * (item.discount || 0)) / 100).toFixed(2),
        discount: item.discount || 0,
        colors: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.color))],
        sizes: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.size))],
    }));

    return (
        <section className="text-gray-600 body-font">
            <ClientAllProducts products={Object.values(formattedProducts)} />
        </section>
    );
};

export default AllProducts;
