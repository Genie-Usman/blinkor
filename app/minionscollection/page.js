import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { connectDB } from "../../lib/database/mongodb";
import Products from "../../lib/database/models/Products";

const Minioncollection = async () => {
  await connectDB();
  const products = await Products.find({ category: "minions tshirts" }).lean().exec();

  const minions = {};

  for (const item of products) {
    if (!Array.isArray(item.variants)) continue;

    const discount = item.discount || 0;
    const discountedPrice = item.price - (item.price * discount) / 100;

    if (minions[item.title]) {
      for (const variant of item.variants) {
        if (variant.availableQuantity > 0) {
          if (!minions[item.title].colors.includes(variant.color)) {
            minions[item.title].colors.push(variant.color);
          }
          if (!minions[item.title].sizes.includes(variant.size)) {
            minions[item.title].sizes.push(variant.size);
          }
        }
      }
    } else {
      minions[item.title] = {
        _id: item._id.toString(),
        title: item.title,
        slug: item.slug,
        image: item.variants.find(v => v.availableQuantity > 0)?.image || item.image || "/placeholder.jpg",
        price: item.price,
        discountedPrice: discountedPrice.toFixed(2),
        discount,
        colors: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.color))],
        sizes: [...new Set(item.variants.filter(v => v.availableQuantity > 0).map(v => v.size))],
      };
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  
  const childVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", damping: 12, stiffness: 100, duration: 0.6 },
    },
  };
  
  const accentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 10, stiffness: 150, duration: 0.8 },
    },
    hover: {
      scale: 1.1,
      color: "#E74C3C",
      textShadow: "0 0 10px rgba(232, 76, 60, 0.7)",
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.9 },
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-9 py-20 mx-auto">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-wide uppercase">
          <span className="text-[#C85C3D] font-bold text-4xl tracking-wide uppercase">
            MINIONS COLLECTION: <span className="text-[#F4A261]">MAYHEM AWAITS!</span>
          </span>

        </h2>
        <div className="flex flex-wrap -m-4 mt-5">
          {Object.values(minions).map((item) => (
            <div key={item._id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
              <CustomLink href={`/product/${item.slug}`} className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-100 p-6 overflow-visible">
                <Image
                  className="mix-blend-multiply h-[25vh] md:h-[34vh] m-auto block transform transition duration-300 ease-out hover:scale-110 hover:translate-y-2 origin-center"
                  src={item.image}
                  alt={item.title}
                  width={200}
                  height={200}
                  priority
                />

                <div className="mt-4 text-center md:text-left">
                  <h2 className="text-gray-500 text-xs tracking-widest title-font mb-1">Minions</h2>
                  <h3 className="text-gray-900 text-base h-12 font-semibold line-clamp-2 w-full">{item.title}</h3>
                  {item.sizes.length > 0 && (
                    <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                      {item.sizes.map((size, index) => (
                        <span key={index} className="border border-gray-400 px-2 py-1 text-xs rounded-md">
                          {size}
                        </span>
                      ))}
                    </div>
                  )}
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
                  {item.discount > 0 ? (
                    <div className="mt-1 text-center md:text-left">
                      <span className="text-gray-500 text-sm line-through mr-2">${item.price.toFixed(2)}</span>
                      <span className="text-red-600 text-lg font-bold">${item.discountedPrice}</span>
                      <span className="text-green-600 text-sm ml-2">-{item.discount}%</span>
                    </div>
                  ) : (
                    <p className="mt-1">${item.price.toFixed(2)}</p>
                  )}
                </div>
              </CustomLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Minioncollection;
