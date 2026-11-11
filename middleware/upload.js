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

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limit to 50MB
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

// Helper function to upload an image buffer directly to Cloudinary via stream
const uploadToCloudinary = (fileBuffer, mimeType = 'image/jpeg') => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(new Error('Cloudinary credentials are not configured on the backend. Please check the backend .env file.'));
    }

    const uploadOptions = {
      folder: 'mayoora_cine_rentals',
      resource_type: 'image'
    };

    // If file is WebP, strictly preserve webp format so Cloudinary never delivers it as JPG
    if (mimeType && mimeType.includes('webp')) {
      uploadOptions.format = 'webp';
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  upload,
  uploadToCloudinary
};
