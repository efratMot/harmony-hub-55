import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold">Product not found</h2>
        <Link to="/" className="mt-4 inline-block text-primary underline">Back to shop</Link>
      </div>
    );
  }

  const recommended = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`relative aspect-square overflow-hidden rounded-xl bg-secondary cursor-zoom-in ${zoomed ? "cursor-zoom-out" : ""}`}
          onClick={() => setZoomed(!zoomed)}
        >
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 ${zoomed ? "scale-150" : "scale-100"}`}
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${product.stock > 0 ? "bg-accent/20 text-accent-foreground" : "bg-destructive/10 text-destructive"}`}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`mt-8 flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-semibold transition-all md:w-auto md:px-8 ${
              added
                ? "bg-green-600 text-primary-foreground"
                : "bg-gradient-warm text-primary-foreground shadow-button hover:opacity-90"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            {added ? "Added to Cart!" : "Add to Cart"}
          </motion.button>
        </motion.div>
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">You Might Also Like</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
