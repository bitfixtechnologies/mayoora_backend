const Category = require('../models/Category');
const Product = require('../models/Product');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Error in getAllCategories controller:', err);
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

// Create category
exports.createCategory = async (req, res) => {
  try {
    const { slug, name } = req.body;
    let image = req.body.image || '';

    if (!slug || !name) {
      return res.status(400).json({ message: 'Slug and name are required' });
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

    const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

    // Check if category already exists
    const existing = await Category.findOne({ slug: formattedSlug });
    if (existing) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }

    const newCategory = await Category.create({
      slug: formattedSlug,
      name: name.toUpperCase(),
      image
    });

    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error in createCategory controller:', err);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;
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

    const updateFields = {
      name: name ? name.toUpperCase() : undefined
    };

    if (image !== undefined) {
      updateFields.image = image;
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { slug },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (err) {
    console.error('Error in updateCategory controller:', err);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const deletedCategory = await Category.findOneAndDelete({ slug });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Unlink products belonging to the deleted category
    await Product.updateMany({ category: slug }, { category: '' });

    res.json({ message: 'Category deleted and associated products unlinked successfully' });
  } catch (err) {
    console.error('Error in deleteCategory controller:', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
