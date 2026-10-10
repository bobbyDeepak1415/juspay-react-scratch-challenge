import React from 'react';
import { useScratch } from '../context/ScratchContext';

export default function Sidebar() {
  const { addBlockToActive } = useScratch();

  const categories = [
    {
      name: 'Motion',
      color: 'bg-blue-500',
      blocks: [
        { type: 'MOVE', label: 'Move steps' },
        { type: 'TURN', label: 'Turn degrees' },
        { type: 'GOTO', label: 'Go to x y' }
      ]
    },
    {
      name: 'Looks',
      color: 'bg-purple-500',
      blocks: [
        { type: 'SAY', label: 'Say for seconds' },
        { type: 'THINK', label: 'Think for seconds' }
      ]
    },
    {
      name: 'Control',
      color: 'bg-amber-500',
      blocks: [
        { type: 'REPEAT', label: 'Repeat animation' }
      ]
    }
  ];

  const handleDragStart = (e, blockType) => {
    e.dataTransfer.setData('text/plain', blockType);
  };

  return (
    <aside className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto flex flex-col space-y-6">
      {categories.map((cat) => (
        <div key={cat.name} className="space-y-2">
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">{cat.name}</h3>
          <div className="space-y-2">
            {cat.blocks.map((block) => (
              <div
                key={block.type}
                draggable
                onDragStart={(e) => handleDragStart(e, block.type)}
                onClick={() => addBlockToActive(block.type)}
                className={`w-full text-left text-white px-3 py-2 rounded-md font-medium text-sm shadow-sm cursor-grab active:cursor-grabbing ${cat.color} hover:opacity-90 transition`}
              >
                {block.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}