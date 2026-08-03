import express from 'express';
import { Product } from '../models/Product.js';
import { Request } from '../models/Request.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { authUser } from '../middleware/auth.js';

const router = express.Router();

// Seed initial products if none exist
// The frontend will call /api/products/seed directly if it finds an empty array

router.get('/products', async (req, res) => {
  try {
    let products = await Product.find().sort({ id: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products/seed', async (req, res) => {
  try {
    const products = req.body;
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    res.json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Product Routes
router.post('/products', adminAuth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: Number(req.params.id) }, 
      req.body, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: Number(req.params.id) });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Stats
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRequests = await Request.countDocuments();
    
    // Calculate total revenue from orders
    const orders = await Order.find();
    const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRequests,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Users
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    // Exclude passwords
    const users = await User.find().select('-password').sort({ _id: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/admin/users/:id/role', adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Customization Requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    const requests = await Request.find().sort({ _id: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Orders
router.get('/orders', authUser, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'admin') {
      const { email } = req.query;
      filter = email ? { userEmail: email } : {};
    } else {
      filter = { userEmail: req.user.email };
    }
    const orders = await Order.find(filter).sort({ _id: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
