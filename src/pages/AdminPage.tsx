import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { products as initialProducts, Product, categories } from "@/data/products";
import { Plus, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";

const AdminPage = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Guitars", price: "", image: "", description: "", stock: "" });

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: form.name,
      category: form.category,
      price: Number(form.price),
      image: form.image || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop",
      description: form.description,
      stock: Number(form.stock),
    };
    setProductsList([newProduct, ...productsList]);
    setForm({ name: "", category: "Guitars", price: "", image: "", description: "", stock: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-gradient-warm px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-button transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleAdd}
          className="mt-6 rounded-xl bg-card p-6 shadow-card"
        >
          <h3 className="font-display text-lg font-semibold mb-4">New Product</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30">
                {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Price ($)</label>
              <input type="number" required min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Stock</label>
              <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Image URL</label>
              <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Leave empty for default"
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Description</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
            <button type="submit" className="rounded-lg bg-gradient-warm px-6 py-2 text-sm font-semibold text-primary-foreground shadow-button">Add Product</button>
          </div>
        </motion.form>
      )}

      {/* Products table */}
      <div className="mt-8 overflow-hidden rounded-xl bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">${p.price.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {productsList.length === 0 && (
          <div className="flex flex-col items-center py-12 text-muted-foreground">
            <Package className="h-10 w-10" />
            <p className="mt-2">No products yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
