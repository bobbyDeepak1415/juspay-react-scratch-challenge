import React, { useContext } from "react";
import { ScratchContext } from "./ScratchContext";

function WorkSpace() {
  const { sprites, activeSpriteId, addBlockToSprite } = useContext(ScratchContext);

  const activeSprite = sprites.find((s) => s.id === activeSpriteId) || sprites[0];

  const handleDragOver = (e) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e) => {
    e.preventDefault();
    try {
      const blockData = JSON.parse(e.dataTransfer.getData("application/json"));
      if (blockData && activeSprite) {
        addBlockToSprite(activeSprite.id, { ...blockData, uniqueId: Date.now() });
      }
    } catch (err) {
      console.error("Failed to parse dropped block data", err);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex-1 bg-white p-6 overflow-y-auto border-r border-gray-200 min-h-[400px]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          Script Area ({activeSprite ? activeSprite.id : "No Sprite Selected"})
        </h2>
      </div>

      <div className="flex flex-col gap-3 min-h-[300px] border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50/50">
        {activeSprite?.blocks.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm italic">
            Drag and drop blocks here from the sidebar
          </div>
        ) : (
          activeSprite?.blocks.map((block) => (
            <div
              key={block.uniqueId || block.id}
              className={`px-4 py-3 rounded-md text-white text-sm font-medium shadow-sm ${
                block.type === "MOTION" ? "bg-blue-500" : "bg-yellow-500"
              }`}
            >
              {block.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


export default WorkSpace