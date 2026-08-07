const mongoose = require('mongoose');

const PromoPopupSchema = new mongoose.Schema({
  image: {
    type: String,
    default: '/DJI.jpg'
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'DJI RONIN RS3 PRO'
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
    default: 'FOR RENT'
  },
  tagline: {
    type: String,
    trim: true,
    default: 'Power. Precision. Pro.'
  },
  features: {
    type: [String],
    default: ['Flexible Rentals', 'Fast Delivery', '24/7 Support']
  },
  buttonText: {
    type: String,
    trim: true,
    default: 'Rent Now'
  },
  buttonLink: {
    type: String,
    trim: true,
    default: 'https://wa.me/919496350343'
  },
  website: {
    type: String,
    trim: true,
    default: 'www.rentalcamerawayanad.in'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Automatically convert _id to id in JSON output
PromoPopupSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('PromoPopup', PromoPopupSchema);
