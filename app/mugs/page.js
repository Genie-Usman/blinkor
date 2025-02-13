import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";

const Mugs = async () => {
  await connectDB();
  const products = await Products.find({ category: "mugs" }).lean();

  const mugs = {};

  for (const item of products) {
    if (!Array.isArray(item.variants)) continue; 

    if (mugs[item.title]) {
      for (const variant of item.variants) {
        if (variant.availableQuantity > 0) {
          if (!mugs[item.title].colors.includes(variant.color)) {
            mugs[item.title].colors.push(variant.color);
          }
          if (!mugs[item.title].sizes.includes(variant.size)) {
            mugs[item.title].sizes.push(variant.size);
          }
        }
      }
    } else {
      mugs[item.title] = {
        _id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        image: item.variants.find(v => v.availableQuantity > 0)?.image || item.image || "/placeholder.jpg",
        price: item.price,
        colors: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.color))],
        sizes: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.size))],
    };
    }
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-9 py-20 mx-auto">
        <div className="flex flex-wrap -m-4 mt-16">
          {Object.values(mugs).map((item) => (
            <div key={item._id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
              <CustomLink href={`/product/${item.slug}`} className="block relative rounded overflow-hidden shadow-md">
                <Image
                  className="h-[25vh] md:h-[34vh] m-auto block"
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  priority
                />
              </CustomLink>
              <div className="mt-4 text-center md:text-left">
                <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Mugs</h3>
                <h2 className="text-gray-900 text-lg font-medium truncate w-full">{item.title}</h2>

                {/* Render sizes */}
                {item.sizes.length > 0 && (
                  <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    {item.sizes.map((size, index) => (
                      <span key={index} className="border border-gray-400 px-2 py-1 text-xs rounded-md">
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                {/* Render colors */}
                {item.colors.length > 0 && (
                  <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                    {item.colors.map((color, index) => (
                      <span
                        key={index}
                        className="w-4 h-4 rounded-full border outline-none mt-1 border-gray-200"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></span>
                    ))}
                  </div>
                )}

                <p className="mt-1">Rs. {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mugs;
