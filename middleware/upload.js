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
    fileSize: 20 * 1024 * 1024 // Limit to 20MB
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

// Helper function to upload an image buffer to Cloudinary
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

    const safeMime = (!mimeType || mimeType === 'application/octet-stream') ? 'image/webp' : mimeType;
    const fileBase64 = `data:${safeMime};base64,${fileBuffer.toString('base64')}`;
    cloudinary.uploader.upload(fileBase64, {
      folder: 'mayoora_cine_rentals',
      resource_type: 'image'
    })
    .then(result => resolve(result.secure_url))
    .catch(error => reject(error));
  });
};

module.exports = {
  upload,
  uploadToCloudinary
};
