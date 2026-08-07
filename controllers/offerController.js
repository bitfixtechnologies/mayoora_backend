const Offer = require('../models/Offer');
const { uploadToCloudinary } = require('../middleware/upload');

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (err) {
    console.error('Error in getAllOffers controller:', err);
    res.status(500).json({ message: 'Error retrieving offers' });
  }
};

// Create offer
exports.createOffer = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    let image = req.body.image || '';

    if (!title || !subtitle) {
      return res.status(400).json({ message: 'Title and subtitle are required' });
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

    const newOffer = await Offer.create({
      image,
      title,
      subtitle
    });

    res.status(201).json(newOffer);
  } catch (err) {
    console.error('Error in createOffer controller:', err);
    res.status(500).json({ message: 'Error creating offer' });
  }
};

// Update offer
exports.updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle } = req.body;
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

    const updateFields = { title, subtitle };
    if (image !== undefined) {
      updateFields.image = image;
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(updatedOffer);
  } catch (err) {
    console.error('Error in updateOffer controller:', err);
    res.status(500).json({ message: 'Error updating offer' });
  }
};

// Delete offer
exports.deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json({ message: 'Offer banner deleted successfully' });
  } catch (err) {
    console.error('Error in deleteOffer controller:', err);
    res.status(500).json({ message: 'Error deleting offer' });
  }
};
