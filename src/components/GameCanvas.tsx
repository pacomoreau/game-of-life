import { useRef, type MutableRefObject } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';
import { useGridInteraction } from '../hooks/useGridInteraction';
import { useGameLoop } from '../hooks/useGameLoop';

type GameCanvasProps = {
  engineRef: MutableRefObject<GameEngine>;
  cellSize: number;
  running: boolean;
  speed: number;
  onResize: (cols: number, rows: number) => void;
  onTick: () => void;
  onChange: () => void;
};

export function GameCanvas({
  engineRef,
  cellSize,
  running,
  speed,
  onResize,
  onTick,
  onChange,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { draw } = useCanvasRenderer(canvasRef, containerRef, engineRef, cellSize, onResize);
  useGridInteraction(canvasRef, engineRef, cellSize, onChange);
  useGameLoop(engineRef, running, speed, onTick, draw);

  return (
    <div className="canvas-container" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
