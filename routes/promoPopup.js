const express = require('express');
const router = express.Router();
const promoPopupController = require('../controllers/promoPopupController');
const authMiddleware = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Promo Popup routes mapped to controller functions
router.get('/', promoPopupController.getPromoPopup);
router.put('/', authMiddleware, upload.single('image'), promoPopupController.updatePromoPopup);

module.exports = router;
