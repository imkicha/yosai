import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ products = [], selectedProduct }) => {
  const productContainerRef = useRef(null);
  const variants = selectedProduct?.variants || [];
  const RelatedProductList = variants.length > 0
    ? products.filter((product) =>
        variants.every((v) =>
          product._id !== selectedProduct._id &&
          (product.variants?.includes(v) || product.category === selectedProduct.category)
        )
      )
    : products.filter((p) => p._id !== selectedProduct?._id);

  const scrollLeft = () => { if (productContainerRef.current) productContainerRef.current.scrollBy({ left: -300, behavior: "smooth" }); };
  const scrollRight = () => { if (productContainerRef.current) productContainerRef.current.scrollBy({ left: 300, behavior: "smooth" }); };

  if (RelatedProductList.length === 0) return null;

  return (
    <section className="py-4 md:py-16">
      <div className="w-full mx-auto px-0 relative">
        <h2 className="text-3xl font-bold text-center md:mb-6 text-transparent bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text">
          Related Products
        </h2>
        <button className="absolute left-2 top-[55%] -translate-y-1/2 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 z-20" onClick={scrollLeft}>
          <FiChevronLeft className="md:text-2xl" />
        </button>
        <button className="absolute right-2 top-[55%] -translate-y-1/2 bg-pink-600 text-white p-3 rounded-full shadow-lg hover:bg-pink-700 z-20" onClick={scrollRight}>
          <FiChevronRight className="md:text-2xl" />
        </button>
        <div className="flex px-8 space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-8" ref={productContainerRef}>
          {RelatedProductList.map((product, index) => (
            <div key={`${product._id}_${index}`} className="flex-shrink-0 md:w-64 w-52">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
