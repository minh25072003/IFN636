import React, { useState } from 'react';
import axios from '../axiosConfig';

const PlaylistModal = ({ playlist, onSave, onClose }) => {
  const [title, setTitle] = useState(playlist?.title || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) return setError('Title is required');
    try {
      let res;
      if (playlist) {
        res = await axios.put(`/api/playlists/${playlist._id}`, { title, description });
      } else {
        res = await axios.post('/api/playlists', { title, description });
      }
      onSave(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {playlist ? 'Edit Playlist' : 'Create Playlist'}
        </h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="Playlist title"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="Optional description"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;