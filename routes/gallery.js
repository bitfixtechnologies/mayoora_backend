const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Gallery routes mapped to Gallery controller functions
router.get('/', galleryController.getAllGalleryItems);
router.post('/', authMiddleware, upload.single('image'), galleryController.createGalleryItem);
router.delete('/:id', authMiddleware, galleryController.deleteGalleryItem);

module.exports = router;
