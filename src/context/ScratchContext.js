import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ScratchContext = createContext();

export const ScratchProvider = ({ children }) => {
  // Multiple Sprites State
  const [sprites, setSprites] = useState({
    sprite1: {
      id: 'sprite1',
      name: 'Sprite 1',
      x: 50,
      y: 100,
      rotation: 0,
      blocks: [],
      speech: null, // { text, type: 'say' | 'think' }
      velocity: { dx: 2, dy: 0 }, // Used for movement & collision swap
    },
    sprite2: {
      id: 'sprite2',
      name: 'Sprite 2',
      x: 300,
      y: 100,
      rotation: 0,
      blocks: [],
      speech: null,
      velocity: { dx: -2, dy: 0 },
    }
  });

  const [activeSpriteId, setActiveSpriteId] = useState('sprite1');
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef(isPlaying);
  playRef.current = isPlaying;

  // Add new sprite
  const addSprite = () => {
    const id = `sprite_${Date.now()}`;
    const newCount = Object.keys(sprites).length + 1;
    setSprites(prev => ({
      ...prev,
      [id]: {
        id,
        name: `Sprite ${newCount}`,
        x: Math.random() * 200 + 50,
        y: Math.random() * 200 + 50,
        rotation: 0,
        blocks: [],
        speech: null,
        velocity: { dx: 2, dy: 0 }
      }
    }));
  };

  // Add block to active sprite
  const addBlockToActive = (blockType) => {
    const newBlock = {
      id: `block_${Date.now()}_${Math.random()}`,
      type: blockType,
      params: getDefaultParams(blockType),
      children: blockType === 'REPEAT' ? [] : undefined
    };

    setSprites(prev => ({
      ...prev,
      [activeSpriteId]: {
        ...prev[activeSpriteId],
        blocks: [...prev[activeSpriteId].blocks, newBlock]
      }
    }));
  };

  const getDefaultParams = (type) => {
    switch (type) {
      case 'MOVE': return { steps: 10 };
      case 'TURN': return { degrees: 15 };
      case 'GOTO': return { x: 0, y: 0 };
      case 'SAY': return { text: 'Hello!', duration: 2 };
      case 'THINK': return { text: 'Hmm...', duration: 2 };
      case 'REPEAT': return { times: 3 };
      default: return {};
    }
  };

  const updateBlockParam = (blockId, paramKey, value) => {
    setSprites(prev => {
      const sprite = prev[activeSpriteId];
      const updatedBlocks = sprite.blocks.map(b => {
        if (b.id === blockId) {
          return { ...b, params: { ...b.params, [paramKey]: value } };
        }
        return b;
      });
      return { ...prev, [activeSpriteId]: { ...sprite, blocks: updatedBlocks } };
    });
  };

  // Execution Engine & Collision Detection (Hero Feature)
  useEffect(() => {
    if (!isPlaying) return;

    let animationFrameId;
    const executeScripts = async () => {
      // Run all sprites concurrently
      const spriteIds = Object.keys(sprites);
      
      const promises = spriteIds.map(async (sId) => {
        const sprite = sprites[sId];
        for (let block of sprite.blocks) {
          if (!playRef.current) break;
          await runBlock(sId, block);
        }
      });

      await Promise.all(promises);
      setIsPlaying(false);
    };

    executeScripts();

    // Collision Detection Loop (Hero Feature)
    const checkCollisions = () => {
      if (!playRef.current) return;
      const currentSprites = Object.values(sprites);
      
      for (let i = 0; i < currentSprites.length; i++) {
        for (let j = i + 1; j < currentSprites.length; j++) {
          const s1 = currentSprites[i];
          const s2 = currentSprites[j];

          // Bounding box collision check (assuming sprite size ~ 50px)
          const distance = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (distance < 45) {
            // HERO FEATURE: Swap velocity / animation vectors on collision
            setSprites(prev => {
              if (!prev[s1.id] || !prev[s2.id]) return prev;
              const tempVel = prev[s1.id].velocity;
              return {
                ...prev,
                [s1.id]: { ...prev[s1.id], velocity: prev[s2.id].velocity },
                [s2.id]: { ...prev[s2.id], velocity: tempVel }
              };
            });
          }
        }
      }
      animationFrameId = requestAnimationFrame(checkCollisions);
    };

    animationFrameId = requestAnimationFrame(checkCollisions);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const runBlock = async (sId, block) => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (!playRef.current) { resolve(); return; }

        setSprites(prev => {
          const sprite = prev[sId];
          if (!sprite) return prev;

          let { x, y, rotation, velocity } = sprite;
          let speech = sprite.speech;

          switch (block.type) {
            case 'MOVE': {
              const steps = Number(block.params.steps) || 0;
              const rad = (rotation * Math.PI) / 180;
              // Incorporate velocity swap vector if active
              const dirMultiplier = velocity.dx >= 0 ? 1 : -1;
              x += steps * Math.cos(rad) * dirMultiplier;
              y += steps * Math.sin(rad) * dirMultiplier;
              break;
            }
            case 'TURN': {
              const deg = Number(block.params.degrees) || 0;
              rotation = (rotation + deg) % 360;
              break;
            }
            case 'GOTO': {
              x = Number(block.params.x) || 0;
              y = Number(block.params.y) || 0;
              break;
            }
            case 'SAY':
            case 'THINK': {
              speech = { text: block.params.text, type: block.type.toLowerCase() };
              break;
            }
            default:
              break;
          }

          return {
            ...prev,
            [sId]: { ...sprite, x, y, rotation, speech }
          };
        });

        // Handle speech bubble duration timeout
        if (block.type === 'SAY' || block.type === 'THINK') {
          const duration = (Number(block.params.duration) || 2) * 1000;
          setTimeout(() => {
            setSprites(prev => {
              const sprite = prev[sId];
              if (!sprite) return prev;
              return { ...prev, [sId]: { ...sprite, speech: null } };
            });
          }, duration);
          setTimeout(resolve, duration);
        } else {
          setTimeout(resolve, 300); // Animation pacing step
        }
      }, 300);
    });
  };

  return (
    <ScratchContext.Provider value={{
      sprites, activeSpriteId, setActiveSpriteId, addSprite,
      addBlockToActive, updateBlockParam, isPlaying, setIsPlaying
    }}>
      {children}
    </ScratchContext.Provider>
  );
};

export const useScratch = () => useContext(ScratchContext);