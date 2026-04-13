import { useState } from "react";
import AddToCart from "./AddToCart";

const SizeComp = ({ product }) => {
  const productSizes = product?.sizes || [];
  const [selectedSize, setSelectedSize] = useState({ [product._id]: productSizes[0] } || "");

  const handleChange = (value) => {
    setSelectedSize({ [product._id]: value });
  };

  return (
    <div>
      <p>Select Size</p>
      <div className="flex mt-6">
        {productSizes.length > 0 ? (
          productSizes.map((value) => (
            <div onClick={() => handleChange(value)} key={value} className="flex flex-col md:text-base text-xs">
              <div className={`rounded-lg text-center shadow-sm border-2 ${selectedSize[product._id] === value ? "border-pink-600" : "border-gray-300"} min-w-12 p-2 mx-1 cursor-pointer`}>
                {value}
              </div>
            </div>
          ))
        ) : <div></div>}
      </div>
      <AddToCart product={product} size={selectedSize} classNames="md:justify-start justify-center mb-6" />
    </div>
  );
};

export default SizeComp;
