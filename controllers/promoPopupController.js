const PromoPopup = require('../models/PromoPopup');
const { uploadToCloudinary } = require('../middleware/upload');

// Get promo popup settings
exports.getPromoPopup = async (req, res) => {
  try {
    let settings = await PromoPopup.findOne();
    if (!settings) {
      settings = await PromoPopup.create({
        image: '/DJI.jpg',
        title: 'DJI RONIN RS3 PRO',
        subtitle: 'FOR RENT',
        tagline: 'Power. Precision. Pro.',
        features: ['Flexible Rentals', 'Fast Delivery', '24/7 Support'],
        buttonText: 'Rent Now',
        buttonLink: 'https://wa.me/919496350343',
        website: 'www.rentalcamerawayanad.in',
        isActive: true
      });
    }
    res.json(settings);
  } catch (err) {
    console.error('Error in getPromoPopup controller:', err);
    res.status(500).json({ message: 'Error retrieving promo popup settings' });
  }
};

// Update promo popup settings
exports.updatePromoPopup = async (req, res) => {
  try {
    const { title, subtitle, tagline, features, buttonText, buttonLink, website, isActive } = req.body;
    let image = req.body.image;

    // Find the single config document or create it
    let settings = await PromoPopup.findOne();
    const isNew = !settings;

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
      subtitle,
      tagline,
      features: parsedFeatures !== undefined ? (Array.isArray(parsedFeatures) ? parsedFeatures : []) : undefined,
      buttonText,
      buttonLink,
      website,
      isActive: isActive === 'true' || isActive === true
    };

    if (image !== undefined) {
      updateFields.image = image;
    }

    if (isNew) {
      settings = await PromoPopup.create(updateFields);
    } else {
      settings = await PromoPopup.findByIdAndUpdate(
        settings._id,
        updateFields,
        { new: true, runValidators: true }
      );
    }

    res.json(settings);
  } catch (err) {
    console.error('Error in updatePromoPopup controller:', err);
    res.status(500).json({ message: 'Error updating promo popup settings' });
  }
};
