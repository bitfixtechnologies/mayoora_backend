const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Offer routes mapped to Offer controller functions
router.get('/', offerController.getAllOffers);
router.post('/', authMiddleware, upload.single('image'), offerController.createOffer);
router.put('/:id', authMiddleware, upload.single('image'), offerController.updateOffer);
router.delete('/:id', authMiddleware, offerController.deleteOffer);

module.exports = router;

