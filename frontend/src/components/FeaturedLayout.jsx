import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

export default function FeaturedLayout({ products = [] }) {
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => { if (el) el.removeEventListener("scroll", checkScroll); };
  }, [products]);

  const scroll = (dir) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {showLeft && (
        <button
          className="absolute -left-1 md:left-1 top-1/2 -translate-y-1/2 z-20 bg-white p-2.5 md:p-3 rounded-full shadow-lg border border-gray-100 hover:bg-pink-50 hover:border-pink-200 transition-all"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
        >
          <FiChevronLeft className="text-lg md:text-xl text-gray-700" />
        </button>
      )}
      {showRight && (
        <button
          className="absolute -right-1 md:right-1 top-1/2 -translate-y-1/2 z-20 bg-white p-2.5 md:p-3 rounded-full shadow-lg border border-gray-100 hover:bg-pink-50 hover:border-pink-200 transition-all"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
        >
          <FiChevronRight className="text-lg md:text-xl text-gray-700" />
        </button>
      )}
      <div
        className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-4 px-2"
        ref={containerRef}
      >
        {products.map((product, index) => (
          <div key={`${product._id}_${index}`} className="flex-shrink-0 w-[170px] md:w-[240px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
