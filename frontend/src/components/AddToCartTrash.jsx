import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import AddToCartDialog from "./AddToCartDialog";
import { useCart } from "@/context/CartContext";

const AddToCartTrash = ({ product, className = "" }) => {
  const { getQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const quantity = getQuantity(product._id);

  return (
    <div className={cn("w-full", className)}>
      <Button
        id="button_addcart"
        onClick={() => setOpenDialog(true)}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full py-1.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors"
      >
        <ShoppingCart size={16} className="font-bold mr-1" />
        Add to Cart {quantity > 0 ? `(${quantity})` : ""}
      </Button>
      <AddToCartDialog open={openDialog} onOpenChange={setOpenDialog} product={product} />
    </div>
  );
};

export default AddToCartTrash;
