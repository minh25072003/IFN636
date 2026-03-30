import React from 'react';

const VideoItem = ({ item, index, onRemove, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const { video } = item;

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      {/* Position number */}
      <span className="text-gray-500 text-sm w-6 text-center">{index + 1}</span>

      {/* Thumbnail */}
      <div className="w-16 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
        {video.thumbnailUrl ? (
          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover rounded" />
        ) : (
          <span className="text-gray-500 text-xs">▶</span>
        )}
      </div>

      {/* Title and duration */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{video.title}</p>
        {video.duration && (
          <p className="text-gray-400 text-xs mt-0.5">{video.duration}</p>
        )}
        {video.category && (
          <span className="text-xs text-cyan-400">{video.category}</span>
        )}
      </div>

      {/* Reorder buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-gray-400 hover:text-white disabled:opacity-20 text-xs px-1"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-gray-400 hover:text-white disabled:opacity-20 text-xs px-1"
        >
          ▼
        </button>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="text-yellow-400 hover:text-yellow-300 text-sm"
      >
        Edit
      </button>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 text-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default VideoItem;