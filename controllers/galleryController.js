const GalleryItem = require('../models/GalleryItem');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all gallery items
exports.getAllGalleryItems = async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('Error in getAllGalleryItems controller:', err);
    res.status(500).json({ message: 'Error retrieving gallery items' });
  }
};

// Create gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { category, title } = req.body;
    let url = req.body.url || '';

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // If an image file is uploaded, upload to Cloudinary
    if (req.file) {
      try {
        url = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(400).json({ message: 'Failed to upload image: ' + uploadErr.message });
      }
    }

    if (!url) {
      return res.status(400).json({ message: 'URL or image file is required' });
    }

    const newItem = await GalleryItem.create({
      category,
      url,
      title: title || ''
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error in createGalleryItem controller:', err);
    res.status(500).json({ message: 'Error creating gallery item' });
  }
};

// Delete gallery item
exports.deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await GalleryItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('Error in deleteGalleryItem controller:', err);
    res.status(500).json({ message: 'Error deleting gallery item' });
  }
};
