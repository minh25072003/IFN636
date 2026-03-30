const express = require('express');
const { searchVideos } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/videos?search=title&category=rap
router.get('/', protect, searchVideos);

module.exports = router;