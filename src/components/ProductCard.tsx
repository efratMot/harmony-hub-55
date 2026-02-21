import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-lg bg-card shadow-card transition-all duration-300 hover:shadow-card-hover">
          <div className="relative aspect-square overflow-hidden bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/5" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className={`absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-button transition-all duration-300 ${
                added
                  ? "bg-green-600 text-primary-foreground"
                  : "bg-primary text-primary-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
              {added ? "Added" : "Add to Cart"}
            </motion.button>
          </div>
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
            <h3 className="mt-1 font-display text-lg font-semibold text-foreground">{product.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-primary">${product.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
