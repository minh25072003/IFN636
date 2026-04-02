import React, { useState } from 'react';
import axios from '../axiosConfig';

const AddVideoModal = ({ playlistId, onAdded, onClose, editingItem, onEdited }) => {
  const existing = editingItem?.video;
  const [title, setTitle] = useState(existing?.title || '');
  const [url, setUrl] = useState(existing?.url || '');
  const [duration, setDuration] = useState(existing?.duration || '');
  const [category, setCategory] = useState(existing?.category || '');
  const [error, setError] = useState('');

  const isEditing = !!editingItem;

  const handleSubmit = async () => {
    if (!title.trim()) return setError('Title is required');
    if (!url.trim()) return setError('URL is required');
    const validYoutube =
      url.startsWith('https://www.youtube.com/') ||
      url.startsWith('https://youtube.com/') ||
      url.startsWith('www.youtube.com/') ||
      url.startsWith('youtube.com/');

    if (!validYoutube) return setError('URL must be a valid YouTube link');
    try {
      if (isEditing) {
        const { data } = await axios.put(
          `/api/playlists/${playlistId}/videos/${existing._id}`,
          { title, url, duration, category }
        );
        onEdited(data);
      } else {
        const { data } = await axios.post(`/api/playlists/${playlistId}/videos`, {
          title,
          url,
          duration,
          category,
        });
        onAdded(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Video' : 'Add Video'}</h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="Video title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="e.g. Rap, Education, Tutorial"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-400 mb-1">Duration</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none"
            placeholder="e.g. 3:17"
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
            {isEditing ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;