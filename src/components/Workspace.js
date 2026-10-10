import React from 'react';
import { useScratch } from '../context/ScratchContext';

export default function Workspace() {
  const { sprites, activeSpriteId, addBlockToActive, updateBlockParam } = useScratch();
  const activeSprite = sprites[activeSpriteId];

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData('text/plain');
    if (blockType) {
      addBlockToActive(blockType);
    }
  };

  if (!activeSprite) return <div className="flex-1 p-6">Select a sprite</div>;

  return (
    <div className="flex-1 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h2 className="text-lg font-bold text-gray-800">
          Script Workspace — <span className="text-indigo-600">{activeSprite.name}</span>
        </h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="space-y-3 min-h-[400px] bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300"
      >
        {activeSprite.blocks.length === 0 ? (
          <p className="text-gray-400 text-center mt-32 pointer-events-none">
            Drag and drop blocks from the sidebar here.
          </p>
        ) : (
          activeSprite.blocks.map((block) => (
            <div key={block.id} className="p-3 rounded-lg shadow-sm text-white flex items-center space-x-3 bg-blue-500">
              <span className="font-semibold text-sm">{block.type}</span>

              {block.type === 'MOVE' && (
                <div className="flex items-center space-x-1 text-black">
                  <input
                    type="number"
                    value={block.params.steps}
                    onChange={(e) => updateBlockParam(block.id, 'steps', e.target.value)}
                    className="w-16 px-2 py-1 rounded text-sm bg-white border"
                  />
                  <span className="text-white text-sm">steps</span>
                </div>
              )}

              {block.type === 'TURN' && (
                <div className="flex items-center space-x-1 text-black">
                  <input
                    type="number"
                    value={block.params.degrees}
                    onChange={(e) => updateBlockParam(block.id, 'degrees', e.target.value)}
                    className="w-16 px-2 py-1 rounded text-sm bg-white border"
                  />
                  <span className="text-white text-sm">deg</span>
                </div>
              )}

              {block.type === 'GOTO' && (
                <div className="flex items-center space-x-2 text-black">
                  <span>x:</span>
                  <input
                    type="number"
                    value={block.params.x}
                    onChange={(e) => updateBlockParam(block.id, 'x', e.target.value)}
                    className="w-14 px-1 py-1 rounded text-sm bg-white border"
                  />
                  <span>y:</span>
                  <input
                    type="number"
                    value={block.params.y}
                    onChange={(e) => updateBlockParam(block.id, 'y', e.target.value)}
                    className="w-14 px-1 py-1 rounded text-sm bg-white border"
                  />
                </div>
              )}

              {(block.type === 'SAY' || block.type === 'THINK') && (
                <div className="flex items-center space-x-2 text-black">
                  <input
                    type="text"
                    value={block.params.text}
                    onChange={(e) => updateBlockParam(block.id, 'text', e.target.value)}
                    className="w-28 px-2 py-1 rounded text-sm bg-white border"
                  />
                  <span className="text-white text-sm">for</span>
                  <input
                    type="number"
                    value={block.params.duration}
                    onChange={(e) => updateBlockParam(block.id, 'duration', e.target.value)}
                    className="w-12 px-1 py-1 rounded text-sm bg-white border"
                  />
                  <span className="text-white text-sm">sec</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}