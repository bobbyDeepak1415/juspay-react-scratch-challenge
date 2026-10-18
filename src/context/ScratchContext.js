import React, { createContext, useState, useEffect } from "react";

export const ScratchContext = createContext();

export const ScratchProvider = ({ children }) => {
  const [sprites, setSprites] = useState([
    { id: "sprite-1", x: 50, y: 150, dx: 2, dy: 0, blocks: [] },
    { id: "sprite-2", x: 300, y: 150, dx: -2, dy: 0, blocks: [] },
  ]);
  const [activeSpriteId, setActiveSpriteId] = useState("sprite-1");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasCollided, setHasCollided] = useState(false);

  // Animation and collision physics loop
  useEffect(() => {
    let animationFrameId;

    if (isPlaying) {
      const updatePhysics = () => {
        setSprites((prevSprites) => {
          const updated = prevSprites.map((sprite) => ({
            ...sprite,
            x: sprite.x + sprite.dx,
            y: sprite.y + sprite.dy,
          }));

          // Check collision strictly between sprite 0 and sprite 1
          if (updated.length >= 2) {
            const s1 = updated[0];
            const s2 = updated[1];

            const dx = s1.x - s2.x;
            const dy = s1.y - s2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const COLLISION_THRESHOLD = 40; // Strict bounding check

            if (distance < COLLISION_THRESHOLD && !hasCollided) {
              setHasCollided(true);
              // Swap movement vectors upon collision
              const tempDx = s1.dx;
              const tempDy = s1.dy;
              s1.dx = s2.dx;
              s1.dy = s2.dy;
              s2.dx = tempDx;
              s2.dy = tempDy;
            } else if (distance >= COLLISION_THRESHOLD + 10) {
              // Reset collision lock once they separate
              setHasCollided(false);
            }
          }

          return updated;
        });

        animationFrameId = requestAnimationFrame(updatePhysics);
      };

      animationFrameId = requestAnimationFrame(updatePhysics);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, hasCollided]);

  const addBlockToSprite = (spriteId, block) => {
    setSprites((prev) =>
      prev.map((s) => (s.id === spriteId ? { ...s, blocks: [...s.blocks, block] } : s))
    );
  };

  return (
    <ScratchContext.Provider
      value={{
        sprites,
        setSprites,
        activeSpriteId,
        setActiveSpriteId,
        isPlaying,
        setIsPlaying,
        addBlockToSprite,
      }}
    >
      {children}
    </ScratchContext.Provider>
  );
};