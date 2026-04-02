import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import PlaylistCard from '../components/PlaylistCard';
import PlaylistModal from '../components/PlaylistModal';

const Dashboard = () => {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = (saved) => {
    if (editingPlaylist) {
      setPlaylists((prev) => prev.map((p) => (p._id === saved._id ? { ...saved, videoCount: p.videoCount } : p)));
    } else {
      setPlaylists((prev) => [{ ...saved, videoCount: 0 }, ...prev]);
    }
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
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
          <p className="text-gray-400">Loading...</p>
        ) : playlists.length === 0 ? (
          <p className="text-gray-400">No playlists yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {playlists.map((pl) => (
              <PlaylistCard
                key={pl._id}
                playlist={pl}
                onEdit={() => handleEdit(pl)}
                onDelete={() => handleDelete(pl._id)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PlaylistModal
          playlist={editingPlaylist}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;