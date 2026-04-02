import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-blue-800 rounded-xl p-6 flex justify-between items-center w-full shadow-lg border border-green-700">
      <div
        className="cursor-pointer flex-1"
        onClick={() => navigate(`/playlist/${playlist._id}`)}
      >
        <h2 className="text-xl font-semibold text-white">{playlist.title}</h2>

        {playlist.description && (
          <p className="text-green-200 text-sm mt-2">{playlist.description}</p>
        )}

        <p className="text-green-300 text-xs mt-2">
          {playlist.videoCount || 0} video{playlist.videoCount !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex gap-3 ml-6">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm text-white"
        >
          Edit
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;
