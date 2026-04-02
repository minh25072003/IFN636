import React from 'react';

const VideoItem = ({ item, index, onRemove, onEdit, onMoveUp, onMoveDown, isFirst, isLast }) => {
  const { video } = item;

  return (
    <div className="bg-blue-800 rounded-xl p-5 flex items-center gap-5 shadow-md border border-green-700">
      
      {/* Position number */}
      <span className="text-green-300 text-base w-8 text-center font-semibold">
        {index + 1}
      </span>

      {/* Thumbnail */}
      <div className="w-24 h-16 bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-green-400 text-sm">▶</span>
        )}
      </div>

      {/* Title and duration */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-base font-medium truncate">{video.title}</p>

        {video.duration && (
          <p className="text-green-200 text-xs mt-1">{video.duration}</p>
        )}

        {video.category && (
          <span className="text-xs text-green-300 mt-1 block">{video.category}</span>
        )}
      </div>

      {/* Reorder buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="text-green-300 hover:text-white disabled:opacity-20 text-sm px-1"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="text-green-300 hover:text-white disabled:opacity-20 text-sm px-1"
        >
          ▼
        </button>
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        className="text-yellow-300 hover:text-yellow-200 text-sm"
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
