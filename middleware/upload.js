const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit to 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to upload an image buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, mimeType) => {
  return new Promise((resolve, reject) => {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return reject(new Error('Cloudinary credentials are not configured on the backend. Please check the backend .env file.'));
    }

    const fileBase64 = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;
    cloudinary.uploader.upload(fileBase64, {
      folder: 'mayoora_cine_rentals',
      resource_type: 'auto'
    })
    .then(result => resolve(result.secure_url))
    .catch(error => reject(error));
  });
};

module.exports = {
  upload,
  uploadToCloudinary
};
