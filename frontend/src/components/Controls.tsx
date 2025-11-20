import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalCount: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  status: string;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  currentIndex,
  totalCount,
  onPlay,
  onPause,
  onReset,
  status
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold mb-2">NYC Real Data Dashboard</h1>
      <p className="text-gray-400 mb-4">Live incident visualization from NYC Open Data</p>
      
      <div className="flex gap-4 items-center">
        <button
          onClick={onPlay}
          disabled={isPlaying || currentIndex >= totalCount}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ▶ Play
        </button>
        <button
          onClick={onPause}
          disabled={!isPlaying}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ⏸ Pause
        </button>
        <button
          onClick={onReset}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
        >
          ↻ Reset
        </button>
        
        <div className="ml-auto text-sm">
          <span className="text-gray-400">{status}</span>
          {totalCount > 0 && (
            <span className="text-gray-500 ml-2">
              ({currentIndex}/{totalCount})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

