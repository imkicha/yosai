import { useState } from "react";
import { Sheet, SheetContent } from "./ui/sheet";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import AddToCart from "./AddToCart";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

const useIsDesktop = () => {
  const [isDesktop] = useState(() => window.innerWidth >= 768);
  return isDesktop;
};

const AddToCartDialog = ({ open, onOpenChange, product }) => {
  const firstVariant = product?.variants?.[0];
  const productSizes = firstVariant?.size || product?.sizes || [];
  const isSizeAvailable = productSizes.length > 0;
  const [selectedSize, setSelectedSize] = useState({ [product._id]: productSizes[0] } || "");
  const price = firstVariant?.price || product?.price || 0;
  const mrp = firstVariant?.mrp || product?.mrp || 0;
  const isDesktop = useIsDesktop();

  const handleChange = (value) => {
    setSelectedSize({ [product._id]: value });
  };

  const CartContent = (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Add to Cart</h2>
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex space-x-5 items-start">
        <div className="relative">
          <div className="w-32 h-32">
            <img src={product.images?.[0] || "/placeholder.svg"} alt={product?.name} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl shadow-md" />
          </div>
          {product?.discount && (
            <Badge className="absolute top-2 left-2 bg-pink-600 text-white">{product.discount}% OFF</Badge>
          )}
        </div>
        <div className="flex flex-col justify-start items-start space-y-1.5">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">{product?.name}</h2>
          <Badge variant="outline" className="text-xs font-medium text-gray-600">{product?.category?.name || product?.category}</Badge>
          <div className="flex items-center mt-1">
            <span className="text-lg font-bold text-pink-600">₹{price.toLocaleString()}</span>
            {mrp > price && (
              <span className="ml-2 text-sm text-gray-500 line-through">₹{mrp.toLocaleString()}</span>
            )}
          </div>
          <Link to={`/viewproduct/${product?._id}`} className="text-sm font-medium text-pink-600 hover:underline mt-1">
            View full details
          </Link>
        </div>
      </div>

      {isSizeAvailable && (
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Select Size</h3>
          <div className="flex flex-wrap gap-2">
            {productSizes.map((value) => (
              <button
                key={value}
                onClick={() => handleChange(value)}
                className={`px-4 py-2 rounded-lg text-center transition-all duration-200 ${selectedSize[product._id] === value ? "bg-pink-50 border-2 border-pink-600 text-pink-700 font-medium" : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {!isSizeAvailable || selectedSize[product._id] ? (
          <AddToCart product={product} size={selectedSize} className="w-full" />
        ) : (
          <Button disabled className="w-full bg-gray-200 text-gray-500 py-6 rounded-lg cursor-not-allowed">
            Please Select a Size
          </Button>
        )}
        <div className="w-full mt-4 flex justify-center">
          <Button variant="outline" className="w-full text-sm text-gray-600" onClick={() => onOpenChange(false)}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent close={false} className="max-w-md overflow-hidden rounded-xl">
        {CartContent}
      </DialogContent>
    </Dialog>
  ) : (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent close={false} side="bottom" className="border-t border-gray-200 rounded-t-xl max-h-[90vh] overflow-y-auto">
        {CartContent}
      </SheetContent>
    </Sheet>
  );
};

export default AddToCartDialog;
