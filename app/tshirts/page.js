import Image from "next/image";
import Link from "next/link";
import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";

const Tshirts = async () => {
  await connectDB();
  const products = await Products.find({ category: "tshirts" }).lean();

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-9 py-20 mx-auto">
          <div className="flex flex-wrap -m-4">
            {products.map((item) => (
              <div key={item._id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
                <Link href={`/product/${item.slug}`} className="block relative rounded overflow-hidden shadow-md">
                  <Image 
                    className="h-[25vh] md:h-[34vh] m-auto block"
                    src={item.image}
                    alt={item.title}
                    width={200}
                    height={200}
                    priority={true}
                  />
                </Link>
                <div className="mt-4 text-center md:text-left">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">T-Shirts</h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">{item.title}</h2>
                  <p className="text-xs">S, M, L, XL, XXL</p>
                  <p className="mt-1">Rs.{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tshirts;
