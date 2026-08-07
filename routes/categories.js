const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Category routes mapped to Category controller functions
router.get('/', categoryController.getAllCategories);
router.post('/', authMiddleware, upload.single('image'), categoryController.createCategory);
router.put('/:slug', authMiddleware, upload.single('image'), categoryController.updateCategory);
router.delete('/:slug', authMiddleware, categoryController.deleteCategory);

module.exports = router;

