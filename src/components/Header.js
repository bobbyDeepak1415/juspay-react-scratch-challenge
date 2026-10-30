import React from 'react';
import { useScratch } from '../context/ScratchContext';

export default function Header() {
  const { isPlaying, setIsPlaying } = useScratch();

  return (
    <header className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold tracking-wide">Juspay Scratch Studio</h1>
      </div>
      <div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-6 py-2 rounded-full font-semibold flex items-center space-x-2 transition ${
            isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          <span>{isPlaying ? '⏹ Stop Animations' : '▶ Play All Sprites'}</span>
        </button>
      </div>
    </header>
  );
}