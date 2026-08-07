const mongoose = require('mongoose');

const GalleryItemSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['PHOTO', 'VIDEO'],
    default: 'PHOTO'
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Automatically convert _id to id in JSON output
GalleryItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('GalleryItem', GalleryItemSchema);
