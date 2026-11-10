const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_IMAGE_EXTENSIONS = /\.(webp|jpg|jpeg|png|gif|svg|avif|bmp|ico)$/i;

const resolveMimeType = (file) => {
  if (file && file.mimetype && file.mimetype !== 'application/octet-stream') {
    return file.mimetype;
  }
  const ext = path.extname(file?.originalname || '').toLowerCase();
  switch (ext) {
    case '.webp': return 'image/webp';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.avif': return 'image/avif';
    case '.bmp': return 'image/bmp';
    default: return (file && file.mimetype) || 'image/jpeg';
  }
};

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024 // Limit file size to 20MB
  },
  fileFilter: (req, file, cb) => {
    const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
    const isImageExt = ALLOWED_IMAGE_EXTENSIONS.test(file.originalname || '');

    if (isImageMime || isImageExt) {
      file.mimetype = resolveMimeType(file);
      cb(null, true);
    } else {
      cb(new Error('Only image files (WEBP, JPG, PNG, GIF, AVIF, SVG) are allowed!'), false);
    }
  }
});

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return res.status(400).json({
        message: 'Cloudinary credentials are not configured on the backend. Please update your backend .env file.'
      });
    }

    // Convert file buffer to base64 data URI
    const safeMime = resolveMimeType(req.file);
    const fileBase64 = `data:${safeMime};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary with explicit resource_type: 'image'
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'mayoora_cine_rentals',
      resource_type: 'image'
    });

    // Return secure URL and public_id
    res.status(200).json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({
      message: 'Failed to upload image to Cloudinary',
      error: error.message
    });
  }
});

module.exports = router;
