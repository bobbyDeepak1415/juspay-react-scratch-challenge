import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const ScratchContext = createContext();

export const ScratchProvider = ({ children }) => {
  // Multiple Sprites State
  const [sprites, setSprites] = useState({
   sprite1: {
      id: 'sprite1',
      name: 'Sprite 1',
      x: 50,
      y: 150, 
      rotation: 0,
      blocks: [],
      speech: null, 
      velocity: { dx: 2, dy: 0 },
    },
    sprite2: {
      id: 'sprite2',
      name: 'Sprite 2',
      x: 350,
      y: 150, 
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
  
  
  const spritesRef = useRef(sprites);
  spritesRef.current = sprites;


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
      const spriteIds = Object.keys(spritesRef.current);
      
      const promises = spriteIds.map(async (sId) => {
        const sprite = spritesRef.current[sId];
        for (let block of sprite.blocks) {
          if (!playRef.current) break;
          await runBlock(sId, block);
        }
      });

      await Promise.all(promises);
      setIsPlaying(false);
    };

    executeScripts();

    // Continuous Physics & Collision Detection Loop (Hero Feature)
    const updatePhysics = () => {
      if (!playRef.current) return;

      setSprites(prev => {
        let updated = { ...prev };
        const keys = Object.keys(updated);

        // 1. Move sprites continuously based on their velocity vector
        keys.forEach(k => {
          const s = updated[k];
          if (s.velocity && (s.velocity.dx !== 0 || s.velocity.dy !== 0)) {
            updated[k] = {
              ...s,
              x: s.x + s.velocity.dx,
              y: s.y + s.velocity.dy
            };
          }
        });

        // 2. Check collisions between sprites
        for (let i = 0; i < keys.length; i++) {
          for (let j = i + 1; j < keys.length; j++) {
            const s1 = updated[keys[i]];
            const s2 = updated[keys[j]];

            const distance = Math.hypot(s1.x - s2.x, s1.y - s2.y);
            if (distance < 50) {
              // HERO FEATURE: Swap velocity vectors on collision
              const tempDx = s1.velocity.dx;
              const tempDy = s1.velocity.dy;

              updated[keys[i]] = {
                ...s1,
                velocity: { dx: s2.velocity.dx, dy: s2.velocity.dy },
                x: s1.x + s2.velocity.dx // push slightly to avoid sticky collision loops
              };
              updated[keys[j]] = {
                ...s2,
                velocity: { dx: tempDx, dy: tempDy },
                x: s2.x + tempDx
              };
            }
          }
        }

        return updated;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

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
              // Update velocity magnitude/direction based on Move steps
              const dir = velocity.dx < 0 ? -1 : 1;
              velocity = { ...velocity, dx: dir * Math.abs(steps / 5) };
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
            [sId]: { ...sprite, x, y, rotation, velocity, speech }
          };
        });

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
          setTimeout(resolve, 300);
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