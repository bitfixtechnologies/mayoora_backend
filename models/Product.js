const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  price: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    default: ''
  },
  footerText: {
    type: String,
    default: ''
  },
  isKit: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Automatically convert _id to id in JSON output
ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

module.exports = mongoose.model('Product', ProductSchema);
