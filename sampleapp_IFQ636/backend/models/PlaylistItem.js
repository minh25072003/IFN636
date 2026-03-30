const mongoose = require('mongoose');

const playlistItemSchema = new mongoose.Schema(
  {
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

// prevent duplicate videos in the same playlist
playlistItemSchema.index({ playlist: 1, video: 1 }, { unique: true });

module.exports = mongoose.model('PlaylistItem', playlistItemSchema);