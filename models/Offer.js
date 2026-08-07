const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  image: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Automatically convert _id to id in JSON output
OfferSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Offer', OfferSchema);
