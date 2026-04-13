import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";

const CategoriesComp = ({ categories = [] }) => {
  const navigate = useNavigate();
  const categoryRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScroll = () => {
    if (categoryRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const currentRef = categoryRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScroll);
      checkScroll();
    }
    return () => { if (currentRef) currentRef.removeEventListener("scroll", checkScroll); };
  }, []);

  const scrollLeft = () => { if (categoryRef.current) categoryRef.current.scrollBy({ left: -300, behavior: "smooth" }); };
  const scrollRight = () => { if (categoryRef.current) categoryRef.current.scrollBy({ left: 300, behavior: "smooth" }); };

  return (
    <div className="relative max-w-7xl mx-auto">
      {showLeftScroll && (
        <button
          onClick={scrollLeft}
          className="absolute -left-1 md:left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-pink-50 hover:border-pink-200 transition-all"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="text-gray-700 text-lg" />
        </button>
      )}
      {showRightScroll && (
        <button
          onClick={scrollRight}
          className="absolute -right-1 md:right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 md:p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-pink-50 hover:border-pink-200 transition-all"
          aria-label="Scroll right"
        >
          <FiChevronRight className="text-gray-700 text-lg" />
        </button>
      )}
      <div className="overflow-x-auto no-scrollbar scroll-smooth px-6 md:px-10" ref={categoryRef}>
        <div className="flex gap-5 md:gap-8 min-w-max py-2">
          {categories.map((cat, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/readymades?category=${cat._id}`)}
              className="flex flex-col items-center group"
            >
              <div className="relative h-20 w-20 md:h-28 md:w-28 rounded-full overflow-hidden bg-gray-50 ring-2 ring-gray-100 group-hover:ring-pink-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                    <span className="text-pink-600 font-bold text-lg md:text-2xl">{cat.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-pink-600/0 group-hover:bg-pink-600/10 transition-colors rounded-full" />
              </div>
              <span className="mt-3 text-xs md:text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesComp;
