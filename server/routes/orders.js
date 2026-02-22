const express = require("express");
const fs = require("fs");
const path = require("path");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const ordersFile = path.join(__dirname, "../data/orders.json");

// Helper: read orders from JSON file
function readOrders() {
  const data = fs.readFileSync(ordersFile, "utf-8");
  return JSON.parse(data);
}

// Helper: write orders to JSON file
function writeOrders(orders) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

// POST /api/orders — create a new order (authenticated users only)
router.post("/", authenticateToken, (req, res) => {
  try {
    const { items, total, shipping } = req.body;

    if (!items || !items.length || !total || !shipping) {
      return res.status(400).json({ error: "Items, total, and shipping details are required." });
    }

    const orders = readOrders();

    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      userId: req.user.id,
      items,
      total,
      shipping,
      timestamp: new Date().toISOString(),
    };

    orders.push(newOrder);
    writeOrders(orders);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create order." });
  }
});

// GET /api/orders — get orders for the authenticated user
router.get("/", authenticateToken, (req, res) => {
  try {
    const orders = readOrders();
    const userOrders = orders.filter((o) => o.userId === req.user.id);
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to read orders." });
  }
});

module.exports = router;
