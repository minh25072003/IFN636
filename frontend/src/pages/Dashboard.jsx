import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import PlaylistCard from '../components/PlaylistCard';
import PlaylistModal from '../components/PlaylistModal';
import Toast from '../components/Toast';

const Dashboard = ({ searchQuery }) => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const fetchPlaylists = async () => {
    try {
      const { data } = await axios.get('/api/playlists');
      setPlaylists(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreate = () => {
    setEditingPlaylist(null);
    setShowModal(true);
  };

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await axios.delete(`/api/playlists/${id}`);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
      showToast('Playlist deleted successfully');
    } catch (err) {
      showToast('Failed to delete playlist', 'error');
    }
  };

  const handleSave = (saved) => {
    if (editingPlaylist) {
      setPlaylists((prev) =>
        prev.map((p) => (p._id === saved._id ? { ...saved, videoCount: p.videoCount } : p))
      );
      showToast('Playlist updated successfully');
    } else {
      setPlaylists((prev) => [{ ...saved, videoCount: 0 }, ...prev]);
      showToast('Playlist created successfully');
    }
    setShowModal(false);
  };

  const filteredPlaylists = playlists.filter((p) =>
    p.title.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes((searchQuery || '').toLowerCase()))
  );

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <div className="min-h-screen bg-black/60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Playlists</h1>
          <button
            onClick={handleCreate}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            + New Playlist
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : filteredPlaylists.length === 0 ? (
          <p className="text-gray-300">
            {searchQuery
              ? 'No playlists match your search.'
              : 'No playlists yet. Create one to get started!'}
          </p>
        ) : (
          <div className="flex flex-col gap-4 items-start w-full max-w-4xl">
            {filteredPlaylists.map((pl) => (
              <PlaylistCard
                key={pl._id}
                playlist={pl}
                onEdit={() => handleEdit(pl)}
                onDelete={() => handleDelete(pl._id)}
              />
            ))}
          </div>
        )}

        {showModal && (
          <PlaylistModal
            playlist={editingPlaylist}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;