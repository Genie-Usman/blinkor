import Image from "next/image";
import Link from "next/link";
import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";

const Tshirts = async () => {
  await connectDB();
  const products = await Products.find({ category: "tshirts" }).lean();
  const tshirts = {};

  for (const item of products) {
    if (tshirts[item.title]) {
      if (!tshirts[item.title].colors.includes(item.color) && item.availableQuantity > 0) {
        tshirts[item.title].colors.push(item.color);
      }
      if (!tshirts[item.title].sizes.includes(item.size) && item.availableQuantity > 0) {
        tshirts[item.title].sizes.push(item.size);
      }
    } else {
      tshirts[item.title] = {
        ...item,
        colors: item.availableQuantity > 0 ? [item.color] : [],
        sizes: item.availableQuantity > 0 ? [item.size] : [],
      };
    }
  }

  return (

    <div>
      <section className="text-gray-600 body-font">
        <div className="container px-9 py-20 mx-auto">
          <div className="flex flex-wrap -m-4 mt-16">
            {Object.values(tshirts).map((item) => (
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
                  <h2 className="text-gray-900 text-lg font-medium truncate w-full">{item.title}</h2>

                  <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    {Array.isArray(item.size) &&
                      item.size.map((size, index) => (
                        <span
                          key={index}
                          className="border border-gray-400 px-2 py-1 text-xs rounded-md"
                        >
                          {size}
                        </span>
                      ))}
                  </div>

                  <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    {Array.isArray(item.color) && item.color.flat().map((color, index) => (
                      <span
                        key={index}
                        className="w-4 h-4 rounded-full border outline-none mt-1 border-gray-200"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></span>
                    ))}
                  </div>
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
