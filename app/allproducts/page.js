import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";
import ClientAllProducts from "./clientAllProducts";

const AllProducts = async () => {
    await connectDB();
    const products = await Products.find({
        category: { $in: ["tshirts", "minion", "hoodies", "stylishhoodies", "caps", "mugs"] },
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
