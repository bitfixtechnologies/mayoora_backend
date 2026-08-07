const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error in getAllProducts controller:', err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { title, category, price, features, description, footerText, isKit } = req.body;
    let image = req.body.image || '';

    if (!title || !category || !price) {
      return res.status(400).json({ message: 'Title, category, and price are required' });
    }

    // If an image file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        image = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(400).json({ message: 'Failed to upload image: ' + uploadErr.message });
      }
    }

    // Since multipart/form-data doesn't natively parse arrays, we handle it if features is a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        // Fallback to splitting by comma if it's a comma-separated list
        parsedFeatures = features.split(',').map(f => f.trim());
      }
    }

    const newProduct = await Product.create({
      title,
      category,
      image,
      price: String(price),
      features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
      description: description || '',
      footerText: footerText || '',
      isKit: isKit === 'true' || isKit === true
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error in createProduct controller:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, price, features, description, footerText, isKit } = req.body;
    let image = req.body.image;

    // If an image file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        image = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(400).json({ message: 'Failed to upload image: ' + uploadErr.message });
      }
    }

    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(f => f.trim());
      }
    }

    const updateFields = {
      title,
      category,
      price: price !== undefined ? String(price) : undefined,
      features: parsedFeatures !== undefined ? (Array.isArray(parsedFeatures) ? parsedFeatures : []) : undefined,
      description,
      footerText,
      isKit: isKit !== undefined ? (isKit === 'true' || isKit === true) : undefined
    };

    if (image !== undefined) {
      updateFields.image = image;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error('Error in updateProduct controller:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error in deleteProduct controller:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
