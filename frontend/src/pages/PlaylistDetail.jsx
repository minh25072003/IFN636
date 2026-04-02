import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import VideoItem from '../components/VideoItem';
import AddVideoModal from '../components/AddVideoModal';
import PlaylistModal from '../components/PlaylistModal';
import Toast from '../components/Toast';

const PlaylistDetail = ({ searchQuery }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchPlaylist = async () => {
    try {
      const [plRes, vidRes] = await Promise.all([
        axios.get(`/api/playlists/${id}`),
        axios.get(`/api/playlists/${id}/videos`),
      ]);
      setPlaylist(plRes.data);
      setItems(vidRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await axios.delete(`/api/playlists/${id}`);
      navigate('/dashboard');
    } catch (err) {
      showToast('Failed to delete playlist', 'error');
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      await axios.delete(`/api/playlists/${id}/videos/${videoId}`);
      setItems((prev) => prev.filter((item) => item.video._id !== videoId));
      showToast('Video removed');
    } catch (err) {
      showToast('Failed to remove video', 'error');
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setItems(newItems);
    await axios.patch(`/api/playlists/${id}/reorder`, {
      orderedIds: newItems.map((i) => i._id),
    });
    showToast('Order updated', 'info');
  };

  const handleMoveDown = async (index) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
    await axios.patch(`/api/playlists/${id}/reorder`, {
      orderedIds: newItems.map((i) => i._id),
    });
    showToast('Order updated', 'info');
  };

  const handleVideoAdded = (newItem) => {
    setItems((prev) => [...prev, newItem]);
    setShowAddModal(false);
    showToast('Video added successfully');
  };

  const handleVideoEdited = (updatedVideo) => {
    setItems((prev) =>
      prev.map((item) =>
        item.video._id === updatedVideo._id ? { ...item, video: updatedVideo } : item
      )
    );
    setEditingItem(null);
    showToast('Video updated successfully');
  };

  const handlePlaylistSaved = (updated) => {
    setPlaylist(updated);
    setShowEditModal(false);
    showToast('Playlist updated successfully');
  };

  const filteredItems = items.filter((item) =>
    item.video.title.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (item.video.category && item.video.category.toLowerCase().includes((searchQuery || '').toLowerCase()))
  );

  if (loading)
    return (
      <div className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="min-h-screen bg-black/60 p-6">Loading...</div>
      </div>
    );

  if (!playlist)
    return (
      <div className="min-h-screen bg-cover bg-center text-white p-6" style={{ backgroundImage: "url('/background.png')" }}>
        <div className="min-h-screen bg-black/60 p-6">Playlist not found.</div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="min-h-screen bg-black/60 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 text-sm mb-2 hover:text-white">
              ← Back
            </button>
            <h1 className="text-2xl font-semibold">{playlist.title}</h1>
            {playlist.description && <p className="text-gray-400 mt-1">{playlist.description}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowEditModal(true)} className="bg-gray-700 px-3 py-2 rounded text-sm">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-600 px-3 py-2 rounded text-sm">
              Delete
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400 text-sm">
            {items.length} video{items.length !== 1 ? 's' : ''}
          </p>
          <button onClick={() => setShowAddModal(true)} className="bg-cyan-500 px-4 py-2 rounded text-sm">
            + Add Video
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-gray-400">No videos found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item, index) => (
              <VideoItem
                key={item._id}
                item={item}
                index={index}
                onRemove={() => handleRemoveVideo(item.video._id)}
                onEdit={() => setEditingItem(item)}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
              />
            ))}
          </div>
        )}

        {(showAddModal || editingItem) && (
          <AddVideoModal
            playlistId={id}
            onAdded={handleVideoAdded}
            onClose={() => { setShowAddModal(false); setEditingItem(null); }}
            editingItem={editingItem}
            onEdited={handleVideoEdited}
          />
        )}

        {showEditModal && (
          <PlaylistModal
            playlist={playlist}
            onSave={handlePlaylistSaved}
            onClose={() => setShowEditModal(false)}
          />
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

export default PlaylistDetail;