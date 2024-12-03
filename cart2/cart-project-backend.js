// Project Structure:
// backend/
// ├── config/
// │   └── database.js
// ├── models/
// │   ├── Product.js
// │   └── Order.js
// ├── routes/
// │   └── orderRoutes.js
// └── server.js

// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce_cart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);

// models/Order.js
const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', OrderSchema);

// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

router.post('/create-order', async (req, res) => {
  try {
    const { cart } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = await Promise.all(cart.map(async (item) => {
      const product = await Product.findOne({ id: item.product_id });
      if (!product) {
        throw new Error(`Product with ID ${item.product_id} not found`);
      }
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product_id: item.product_id,
        quantity: item.quantity
      };
    }));

    // Create new order
    const newOrder = new Order({
      items: orderItems,
      totalAmount
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message 
    });
  }
});

module.exports = router;

// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/orders', orderRoutes);

// Seed Products (optional - run once)
const seedProducts = async () => {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    const productsData = [
      {
        id: "1",
        name: "Product 1",
        price: 100,
        image: "/path/to/image1.jpg"
      },
      {
        id: "2",
        name: "Product 2", 
        price: 200,
        image: "/path/to/image2.jpg"
      }
      // Add more products as needed
    ];

    await Product.insertMany(productsData);
    console.log('Products seeded successfully');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedProducts();
});
