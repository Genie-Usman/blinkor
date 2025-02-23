import Image from "next/image";
import CustomLink from "../../components/CustomLink";
import { connectDB } from "../lib/mongodb";
import Products from "../../models/Products";

const StylishHoodies = async () => {
    await connectDB();
    const products = await Products.find({ category: "stylishhoodies" }).lean();

    const stylishHoodies = {};

    for (const item of products) {
        if (!Array.isArray(item.variants)) continue;

        const discount = item.discount || 0;
        const discountedPrice = item.price - (item.price * discount) / 100;

        if (stylishHoodies[item.title]) {
            for (const variant of item.variants) {
                if (variant.availableQuantity > 0) {
                    if (!stylishHoodies[item.title].colors.includes(variant.color)) {
                        stylishHoodies[item.title].colors.push(variant.color);
                    }
                    if (!stylishHoodies[item.title].sizes.includes(variant.size)) {
                        stylishHoodies[item.title].sizes.push(variant.size);
                    }
                }
            }
        } else {
            stylishHoodies[item.title] = {
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

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-9 py-20 mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 text-center tracking-wide uppercase">
                    <span className="text-[#C85C3D] font-bold text-4xl tracking-wide uppercase">
                        STYLISH HOODIES: <span className="text-[#F4A261]">DRIP WITH CONFIDENCE!</span>
                    </span>
                </h2>
                <div className="flex flex-wrap -m-4 mt-5">
                    {Object.values(stylishHoodies).map((item) => (
                        <div key={item._id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
                            <CustomLink href={`/product/${item.slug}`} className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-100 p-6 overflow-visible">
                            <div className="relative h-[25vh] md:h-[45vh] flex items-center justify-center overflow-visible group">

                                <Image
                                    className="mix-blend-multiply w-full h-full object-contain transform transition duration-300 ease-out group-hover:scale-105 origin-center"
                                    src={item.image}
                                    alt={item.title}
                                    width={200}
                                    height={200}
                                    priority
                                />
                                </div>

                                <div className="mt-4 text-center md:text-left">
                                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">Stylish Hoodies</h3>
                                    <h2 className="text-gray-900 text-lg font-medium truncate w-full">{item.title}</h2>

                                    {/* Render sizes */}
                                    {item.sizes.length > 0 && (
                                        <div className="flex justify-center md:justify-start gap-2 mt-1 flex-wrap">
                                            {item.sizes.map((size, index) => (
                                                <span key={index} className="border border-gray-300 px-3 py-1 text-xs rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors duration-200">
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
                                                    className="w-4 h-4 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 shadow-sm"
                                                    style={{ backgroundColor: color.toLowerCase() }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Price Display with Discount */}
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

export default StylishHoodies;
