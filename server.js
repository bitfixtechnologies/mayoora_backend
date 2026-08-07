require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./db/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const offerRoutes = require('./routes/offers');
const uploadRoutes = require('./routes/upload');
const promoPopupRoutes = require('./routes/promoPopup');
const galleryRoutes = require('./routes/gallery');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logger middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promo-popup', promoPopupRoutes);
app.use('/api/gallery', galleryRoutes);

// Root endpoint check
app.get('/', (req, res) => {
  res.json({ message: 'Mayoora Cine Rentals API is online!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`Mayoora Cine Rentals Backend Server Running`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`JWT Secret Set: ${!!process.env.JWT_SECRET}`);
  console.log(`========================================`);
});
