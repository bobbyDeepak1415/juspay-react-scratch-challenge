import React from "react";

const MOTION_BLOCKS = [
  { id: "move_10", type: "MOTION", label: "Move 10 steps", dx: 10 },
  { id: "move_minus_10", type: "MOTION", label: "Move -10 steps", dx: -10 },
  { id: "turn_right", type: "MOTION", label: "Turn 15 degrees", angle: 15 },
];

const CONTROL_BLOCKS = [
  { id: "wait_1", type: "CONTROL", label: "Wait 1 seconds", seconds: 1 },
  { id: "repeat_10", type: "CONTROL", label: "Repeat 10 times", count: 10 },
  { id: "repeat_forever", type: "CONTROL", label: "Forever" },
];

export default function Sidebar() {
  const handleDragStart = (e, block) => {
    e.dataTransfer.setData("application/json", JSON.stringify(block));
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 flex flex-col gap-6 select-none overflow-y-auto">
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Motion</h3>
        <div className="flex flex-col gap-2">
          {MOTION_BLOCKS.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              className="bg-blue-500 text-white px-3 py-2 rounded-md shadow-sm text-sm font-medium cursor-grab active:cursor-grabbing hover:bg-blue-600 transition"
            >
              {block.label}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Control</h3>
        <div className="flex flex-col gap-2">
          {CONTROL_BLOCKS.map((block) => (
            <div
              key={block.id}
              draggable
              onDragStart={(e) => handleDragStart(e, block)}
              className="bg-yellow-500 text-white px-3 py-2 rounded-md shadow-sm text-sm font-medium cursor-grab active:cursor-grabbing hover:bg-yellow-600 transition"
            >
              {block.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}