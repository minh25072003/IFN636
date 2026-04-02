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

      {/* Info Section: Title, URL, and Category */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-base font-medium truncate">{video.title}</p>

        {/* Video URL */}
        <p className="text-blue-300 text-xs mt-1 truncate">
          <a 
            href={video.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:underline"
          >
            {video.url}
          </a>
        </p>

        {/* Category */}
        {video.category && (
          <span className="text-xs text-green-300 mt-1 block font-light italic">
            {video.category}
          </span>
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

      {/* Actions */}
      <div className="flex gap-3 ml-2">
        <button
          onClick={onEdit}
          className="text-yellow-300 hover:text-yellow-200 text-sm"
        >
          Edit
        </button>

        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default VideoItem;