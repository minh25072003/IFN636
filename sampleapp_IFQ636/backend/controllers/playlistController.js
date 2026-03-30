const Playlist = require('../models/Playlist');
const PlaylistItem = require('../models/PlaylistItem');

// GET all playlists for logged-in user
const getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user.id }).sort({ createdAt: -1 });

    // attach video count to each playlist
    const playlistsWithCount = await Promise.all(
      playlists.map(async (pl) => {
        const count = await PlaylistItem.countDocuments({ playlist: pl._id });
        return { ...pl.toObject(), videoCount: count };
      })
    );

    res.json(playlistsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single playlist
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create playlist
const createPlaylist = async (req, res) => {
  const { title, description, isPublic } = req.body;
  try {
    const playlist = await Playlist.create({
      title,
      description,
      isPublic: isPublic || false,
      owner: req.user.id,
    });
    res.status(201).json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update playlist
const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    const { title, description, isPublic } = req.body;
    playlist.title = title || playlist.title;
    playlist.description = description !== undefined ? description : playlist.description;
    playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

    const updated = await playlist.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE playlist + all its items
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    if (playlist.owner.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorised' });

    await PlaylistItem.deleteMany({ playlist: playlist._id });
    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlaylists, getPlaylistById, createPlaylist, updatePlaylist, deletePlaylist };