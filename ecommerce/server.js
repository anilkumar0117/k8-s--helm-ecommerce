const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

const img = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;
const products = [
  { id: 1, name: "Wireless Headphones", category: "Audio", price: 4999, oldPrice: 6999, rating: 4.6, reviews: 312, image: img("photo-1505740420928-5e560c06d30e"), description: "40-hour battery, active noise cancelling." },
  { id: 2, name: "Classic Wrist Watch", category: "Watches", price: 3499, rating: 4.4, reviews: 128, image: img("photo-1523275335684-37898b6baf30"), description: "Stainless steel case, leather strap." },
  { id: 3, name: "Running Sneakers", category: "Footwear", price: 2999, oldPrice: 3999, rating: 4.5, reviews: 541, image: img("photo-1542291026-7eec264c27ff"), description: "Lightweight mesh with cushioned sole." },
  { id: 4, name: "Round Sunglasses", category: "Eyewear", price: 1299, rating: 4.2, reviews: 86, image: img("photo-1572635196237-14b3f281503f"), description: "UV400 lenses, durable frame." },
  { id: 5, name: "Daily Backpack", category: "Bags", price: 2199, rating: 4.7, reviews: 233, image: img("photo-1553062407-98eeb64c6a62"), description: "25L, water resistant, laptop sleeve." },
  { id: 6, name: "Vintage Camera", category: "Photography", price: 8999, oldPrice: 10999, rating: 4.8, reviews: 74, image: img("photo-1526170375885-4d8ecf77b99f"), description: "Film camera with 50mm prime lens." },
  { id: 7, name: "Smart Watch", category: "Watches", price: 5999, rating: 4.3, reviews: 410, image: img("photo-1546868871-7041f2a55e12"), description: "Heart-rate, sleep tracking, 7-day battery." },
  { id: 8, name: "Studio Headphones", category: "Audio", price: 3999, rating: 4.5, reviews: 197, image: img("photo-1583394838336-acd977736f90"), description: "Over-ear, deep bass, foldable design." }
];
const orders = [];

app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/products", (_req, res) => res.json(products));

app.post("/api/orders", (req, res) => {
  const { name, email, address, items } = req.body || {};
  if (!name || !email || !address || !Array.isArray(items) || !items.length)
    return res.status(400).json({ error: "Please fill in all fields and add items to your cart." });
  let total = 0;
  const lines = [];
  for (const it of items) {
    const p = products.find(x => x.id === it.id);
    const qty = Math.max(1, parseInt(it.qty) || 1);
    if (!p) return res.status(400).json({ error: "One of the items is no longer available." });
    total += p.price * qty;
    lines.push({ id: p.id, name: p.name, qty });
  }
  const order = { id: "EC-" + Date.now().toString(36).toUpperCase(), name, email, address, lines, total };
  orders.push(order);
  console.log("New order", order.id, "total", total);
  res.status(201).json({ id: order.id, total });
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(process.env.PORT || 3000, () => console.log("ecommerce shop running"));
