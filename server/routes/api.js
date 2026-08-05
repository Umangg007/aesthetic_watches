import express from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { Request } from '../models/Request.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Settings } from '../models/Settings.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { authUser } from '../middleware/auth.js';
import { globalStore } from '../store.js';
import { defaultProducts } from '../defaultProducts.js';

const router = express.Router();

router.get('/products', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let products = await Product.find().sort({ id: 1 });
      return res.json(products);
    } else {
      if (globalStore.products.length === 0) {
        globalStore.products = [...defaultProducts];
      }
      return res.json(globalStore.products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/products/seed', async (req, res) => {
  try {
    const products = req.body || defaultProducts;
    if (mongoose.connection.readyState === 1) {
      await Product.deleteMany({});
      const created = await Product.insertMany(products);
      return res.json(created);
    } else {
      globalStore.products = Array.isArray(products) && products.length > 0 ? products : [...defaultProducts];
      return res.json(globalStore.products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Product Routes
router.post('/products', adminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newProduct = new Product(req.body);
      const saved = await newProduct.save();
      return res.status(201).json(saved);
    } else {
      const newProd = { id: Date.now(), ...req.body };
      globalStore.products.push(newProd);
      return res.status(201).json(newProd);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (mongoose.connection.readyState === 1) {
      const updated = await Product.findOneAndUpdate(
        { id: targetId }, 
        req.body, 
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Product not found' });
      return res.json(updated);
    } else {
      const index = globalStore.products.findIndex(p => p.id === targetId);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      globalStore.products[index] = { ...globalStore.products[index], ...req.body };
      return res.json(globalStore.products[index]);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    if (mongoose.connection.readyState === 1) {
      const deleted = await Product.findOneAndDelete({ id: targetId });
      if (!deleted) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product deleted' });
    } else {
      const initialLength = globalStore.products.length;
      globalStore.products = globalStore.products.filter(p => p.id !== targetId);
      if (globalStore.products.length === initialLength) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json({ message: 'Product deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Stats
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalRequests = await Request.countDocuments();
      const orders = await Order.find();
      const revenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

      return res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRequests,
        revenue
      });
    } else {
      const revenue = globalStore.orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
      return res.json({
        totalUsers: globalStore.users.length,
        totalProducts: globalStore.products.length,
        totalOrders: globalStore.orders.length,
        totalRequests: globalStore.requests.length,
        revenue
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Users
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ _id: -1 });
      return res.json(users);
    } else {
      const safeUsers = globalStore.users.map(({ password, ...u }) => u);
      return res.json(safeUsers);
    }
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

    if (mongoose.connection.readyState === 1) {
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select('-password');
      if (!updated) return res.status(404).json({ message: 'User not found' });
      return res.json(updated);
    } else {
      const user = globalStore.users.find(u => u._id === req.params.id || u.id === req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.role = role;
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Customization Requests
router.get('/requests', adminAuth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const requests = await Request.find().sort({ _id: -1 });
      return res.json(requests);
    } else {
      return res.json(globalStore.requests);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/requests', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newRequest = new Request(req.body);
      const saved = await newRequest.save();
      return res.status(201).json(saved);
    } else {
      const reqObj = { _id: 'req_' + Date.now(), createdAt: new Date(), ...req.body };
      globalStore.requests.unshift(reqObj);
      return res.status(201).json(reqObj);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Orders
router.get('/orders', authUser, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let filter = {};
      if (req.user.role === 'admin') {
        const { email } = req.query;
        filter = email ? { userEmail: email } : {};
      } else {
        filter = { userEmail: req.user.email };
      }
      const orders = await Order.find(filter).sort({ _id: -1 });
      return res.json(orders);
    } else {
      if (req.user.role === 'admin') {
        const { email } = req.query;
        return res.json(email ? globalStore.orders.filter(o => o.userEmail === email) : globalStore.orders);
      } else {
        return res.json(globalStore.orders.filter(o => o.userEmail === req.user.email));
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/orders', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const newOrder = new Order(req.body);
      const saved = await newOrder.save();
      return res.status(201).json(saved);
    } else {
      const orderObj = { _id: 'order_' + Date.now(), createdAt: new Date(), ...req.body };
      globalStore.orders.unshift(orderObj);
      return res.status(201).json(orderObj);
    }
  } catch (error) {
// Site Settings
router.get('/settings', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = await Settings.create({});
      }
      return res.json(settings);
    } else {
      if (!globalStore.settings) {
        globalStore.settings = {
          phone: '785238090',
          email: 'dharohar2026@gmail.com',
          announcement: '✦ Insured Express Delivery Across India ✦'
        };
      }
      return res.json(globalStore.settings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings', adminAuth, async (req, res) => {
  try {
    const { phone, email, announcement } = req.body;
    if (mongoose.connection.readyState === 1) {
      let settings = await Settings.findOne();
      if (!settings) {
        settings = new Settings({ phone, email, announcement });
      } else {
        if (phone !== undefined) settings.phone = phone;
        if (email !== undefined) settings.email = email;
        if (announcement !== undefined) settings.announcement = announcement;
      }
      const updated = await settings.save();
      return res.json(updated);
    } else {
      globalStore.settings = {
        phone: phone ?? globalStore.settings.phone,
        email: email ?? globalStore.settings.email,
        announcement: announcement ?? globalStore.settings.announcement
      };
      return res.json(globalStore.settings);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

