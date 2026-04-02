import React from 'react';
import { useNavigate } from 'react-router-dom';

const PlaylistCard = ({ playlist, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex justify-between items-center">
      <div
        className="cursor-pointer flex-1"
        onClick={() => navigate(`/playlist/${playlist._id}`)}
      >
        <h2 className="text-lg font-medium">{playlist.title}</h2>
        {playlist.description && (
          <p className="text-gray-400 text-sm mt-1">{playlist.description}</p>
        )}
        <p className="text-gray-500 text-xs mt-1">{playlist.videoCount || 0} video{playlist.videoCount !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
        >
          Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;