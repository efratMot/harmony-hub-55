const express = require("express");
const fs = require("fs");
const path = require("path");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const productsFile = path.join(__dirname, "../data/products.json");

// Helper: read products from JSON file
function readProducts() {
  const data = fs.readFileSync(productsFile, "utf-8");
  return JSON.parse(data);
}

// Helper: write products to JSON file
function writeProducts(products) {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// GET /api/products — list products with optional category & search filters
router.get("/", (req, res) => {
  try {
    let products = readProducts();
    const { category, search } = req.query;

    if (category && category !== "All") {
      products = products.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to read products." });
  }
});

// GET /api/products/:id — single product by ID
router.get("/:id", (req, res) => {
  try {
    const products = readProducts();
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to read product." });
  }
});

// POST /api/products — add new product (admin only)
router.post("/", authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, category, price, image, description, stock } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({ error: "Name, category, price, and description are required." });
    }

    const products = readProducts();

    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      category,
      price: Number(price),
      image: image || "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop",
      description,
      stock: Number(stock) || 0,
    };

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to add product." });
  }
});

// DELETE /api/products/:id — delete product (admin only)
router.delete("/:id", authenticateToken, requireAdmin, (req, res) => {
  try {
    let products = readProducts();
    const index = products.findIndex((p) => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Product not found." });
    }

    products.splice(index, 1);
    writeProducts(products);

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

module.exports = router;
