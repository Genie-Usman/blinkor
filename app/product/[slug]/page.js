import { connectDB } from "../../../lib/database/mongodb";
import Products from "../../../lib/database/models/Products";
import ProductDetails from "../../../components/ProductDetails";

const ProductPage = async ({ params }) => {
  const { slug } = await params || {}; 
  if (!slug) {
    return <div className="text-center text-red-500">Invalid product request</div>;
  }

  await connectDB();
  const product = await Products.findOne({ slug: decodeURIComponent(slug) }).lean().exec();

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    image: product.image || "",
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
    variants: product.variants.map(v => ({
      _id: v._id?.toString(), 
      size: v.size,
      color: v.color,
      availableQuantity: v.availableQuantity,
      image: v.image || "",
    })),
  };

  return (
    <section className="text-gray-600 body-font overflow-x-hidden mt-5">
      <div className="container px-5 py-12 mx-auto">
        <div className="lg:w-4/5 mx-auto flex justify-center flex-wrap">
          <ProductDetails product={serializedProduct} />
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
