const express = require('express');
const {
  getPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} = require('../controllers/playlistController');
const {
  getVideosInPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  reorderVideos,
  updateVideo,
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// playlist CRUD
router.get('/', protect, getPlaylists);
router.post('/', protect, createPlaylist);
router.get('/:id', protect, getPlaylistById);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);

// video management within a playlist
router.get('/:id/videos', protect, getVideosInPlaylist);
router.post('/:id/videos', protect, addVideoToPlaylist);
router.put('/:id/videos/:videoId', protect, updateVideo);
router.delete('/:id/videos/:videoId', protect, removeVideoFromPlaylist);
router.patch('/:id/reorder', protect, reorderVideos);

module.exports = router;