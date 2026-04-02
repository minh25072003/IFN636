const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String, default: '' },
    category: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Video', videoSchema);