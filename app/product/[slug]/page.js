import Image from "next/image";
import { connectDB } from "../../lib/mongodb";
import Products from "../../../models/Products";
import ProductDetails from "../../../components/ProductDetails";

const ProductPage = async ({ params }) => {
  const { slug } = await params || {}; 
  if (!slug) {
    return <div className="text-center text-red-500">Invalid product request</div>;
  }

  await connectDB();
  const product = await Products.findOne({ slug: decodeURIComponent(slug) }).lean();

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  if (!product) {
    return <div className="text-center text-red-500">Product not found</div>;
  }

  const serializedProduct = {
    ...product,
    _id: product._id.toString(),
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
    variants: product.variants.map(v => ({
      _id: v._id?.toString(), 
      size: v.size,
      color: v.color,
      availableQuantity: v.availableQuantity,
    })),
  };

  return (
    <section className="text-gray-600 body-font overflow-x-hidden mt-16">
      <div className="container px-5 py-12 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <Image
            alt={product.title}
            className="lg:w-1/2 w-full lg:h-[31rem] px-14 md:px-0 object-cover object-top rounded"
            src={product.image || "/placeholder.jpg"}
            width={500}
            height={500}
            priority
          />
          <ProductDetails product={serializedProduct} />
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
