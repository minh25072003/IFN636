const Video = require('../models/Video');
const PlaylistItem = require('../models/PlaylistItem');
const Playlist = require('../models/Playlist');

// PUT update a video
const updateVideo = async (req, res) => {
  const { title, url, duration, category, thumbnailUrl } = req.body;
  const validYoutube =
    url.startsWith('https://www.youtube.com/') ||
    url.startsWith('https://youtube.com/') ||
    url.startsWith('www.youtube.com/') ||
    url.startsWith('youtube.com/');

  if (!validYoutube) return res.status(400).json({ message: 'URL must be a valid YouTube link' });
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.videoId,
      { title, url, duration, category, thumbnailUrl },
      { new: true }
    );
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all videos in a playlist
const getVideosInPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    const items = await PlaylistItem.find({ playlist: req.params.id })
      .sort({ position: 1 })
      .populate('video');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add video to playlist
const addVideoToPlaylist = async (req, res) => {
  const { title, url, duration, category, thumbnailUrl } = req.body;
  const validYoutube =
    url.startsWith('https://www.youtube.com/') ||
    url.startsWith('https://youtube.com/') ||
    url.startsWith('www.youtube.com/') ||
    url.startsWith('youtube.com/');

  if (!validYoutube) return res.status(400).json({ message: 'URL must be a valid YouTube link' });
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    // create the video
    const video = await Video.create({ title, url, duration, category, thumbnailUrl });

    // get next position
    const count = await PlaylistItem.countDocuments({ playlist: req.params.id });

    const item = await PlaylistItem.create({
      playlist: req.params.id,
      video: video._id,
      position: count,
    });

    res.status(201).json({ ...item.toObject(), video });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Video already in playlist' });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE remove video from playlist
const removeVideoFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    const item = await PlaylistItem.findOne({
      playlist: req.params.id,
      video: req.params.videoId,
    });
    if (!item) return res.status(404).json({ message: 'Video not found in playlist' });

    const removedPosition = item.position;
    await item.deleteOne();

    // reindex positions after removal
    await PlaylistItem.updateMany(
      { playlist: req.params.id, position: { $gt: removedPosition } },
      { $inc: { position: -1 } }
    );

    res.json({ message: 'Video removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH reorder videos in playlist
const reorderVideos = async (req, res) => {
  // expects body: { orderedIds: ['playlistItemId1', 'playlistItemId2', ...] }
  const { orderedIds } = req.body;
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    await Promise.all(
      orderedIds.map((itemId, index) =>
        PlaylistItem.findByIdAndUpdate(itemId, { position: index })
      )
    );

    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET search videos by title / filter by category
const searchVideos = async (req, res) => {
  const { search, category } = req.query;
  try {
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };

    const videos = await Video.find(query).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVideosInPlaylist,
  addVideoToPlaylist,
  updateVideo,
  removeVideoFromPlaylist,
  reorderVideos,
  searchVideos,
};