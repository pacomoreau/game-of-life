import { useEffect, useRef, type MutableRefObject } from 'react';
import { GameEngine } from '../engine/GameEngine';

export function useGameLoop(
  engineRef: MutableRefObject<GameEngine>,
  running: boolean,
  speed: number,
  onTick: () => void,
  draw: () => void,
) {
  const rafIdRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const msPerGeneration = 1000 / speed;

    const loop = (timestamp: number) => {
      if (running) {
        if (timestamp - lastTickRef.current >= msPerGeneration) {
          engineRef.current.step();
          lastTickRef.current = timestamp;
          onTick();
        }
      }
      draw();
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [running, speed, engineRef, onTick, draw]);
}
