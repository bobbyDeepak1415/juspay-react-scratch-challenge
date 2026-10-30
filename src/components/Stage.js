import React from 'react';
import { useScratch } from '../context/ScratchContext';

export default function Stage() {
  const { sprites, activeSpriteId, setActiveSpriteId, addSprite } = useScratch();

  return (
    <div className="w-96 bg-gray-100 flex flex-col border-l border-gray-200">
      <div className="flex-1 relative bg-white border-b border-gray-200 overflow-hidden m-4 rounded-xl shadow-inner">
        {Object.values(sprites).map((sprite) => (
          <div
            key={sprite.id}
            onClick={() => setActiveSpriteId(sprite.id)}
            className={`absolute cursor-pointer transition-transform duration-200 flex flex-col items-center ${
              activeSpriteId === sprite.id ? 'scale-110' : ''
            }`}
            style={{
              transform: `translate(${sprite.x}px, ${sprite.y}px) rotate(${sprite.rotation}deg)`,
            }}
          >
            {sprite.speech && (
              <div className="absolute -top-12 bg-black text-white px-3 py-1 rounded-lg text-xs shadow-lg whitespace-nowrap z-20">
                {sprite.speech.text}
                <div className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
              </div>
            )}

            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
              🐈
            </div>
            <span className="text-[10px] font-semibold text-gray-600 mt-1">{sprite.name}</span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t flex items-center justify-between">
        <div className="flex space-x-2 overflow-x-auto">
          {Object.values(sprites).map((sprite) => (
            <button
              key={sprite.id}
              onClick={() => setActiveSpriteId(sprite.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                activeSpriteId === sprite.id
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {sprite.name}
            </button>
          ))}
        </div>
        <button
          onClick={addSprite}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition"
        >
          + Add Sprite
        </button>
      </div>
    </div>
  );
}