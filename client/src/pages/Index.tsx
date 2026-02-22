import { useState, useMemo, useEffect } from "react";
import { products as localProducts, categories, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { apiFetch, isServerAvailable } from "@/lib/api";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>(localProducts);

  // Try fetching from server on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const serverUp = await isServerAvailable();
      if (serverUp) {
        try {
          const res = await apiFetch("/products");
          if (res.ok) {
            const data = await res.json();
            setProducts(data);
          }
        } catch {
          // Keep local fallback
        }
      }
    };
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category, products]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold text-foreground md:text-6xl"
          >
            Find Your <span className="text-gradient-warm">Perfect Sound</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground"
          >
            Premium instruments for every musician. From beginner to professional.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-8 max-w-md"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search instruments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-card py-3 pl-10 pr-4 text-sm shadow-card outline-none transition-shadow focus:shadow-card-hover focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories & Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground shadow-button"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">No instruments found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
