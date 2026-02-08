import { useEffect, useRef, useCallback, type MutableRefObject } from 'react';
import { GameEngine } from '../engine/GameEngine';

export function useCanvasRenderer(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  containerRef: MutableRefObject<HTMLDivElement | null>,
  engineRef: MutableRefObject<GameEngine>,
  cellSize: number,
  onResize: (cols: number, rows: number) => void,
) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext('2d', { willReadFrequently: false });
  }, [canvasRef]);

  // Handle container resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      canvas.width = width;
      canvas.height = height;
      const cols = Math.floor(width / cellSize);
      const rows = Math.floor(height / cellSize);
      onResizeRef.current(cols, rows);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    handleResize();

    return () => observer.disconnect();
  }, [canvasRef, containerRef, cellSize]);

  // Draw function
  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const engine = engineRef.current;
    const { cols, rows, current } = engine;
    const cs = cellSize;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.fillStyle = '#141414';
    for (let x = 0; x <= cols; x++) {
      ctx.fillRect(x * cs, 0, 1, rows * cs);
    }
    for (let y = 0; y <= rows; y++) {
      ctx.fillRect(0, y * cs, cols * cs, 1);
    }

    // Batch draw alive cells
    ctx.fillStyle = '#00cc66';
    ctx.beginPath();
    for (let i = 0; i < current.length; i++) {
      if (current[i]) {
        const col = i % cols;
        const row = (i - col) / cols;
        if (row < rows) {
          ctx.rect(col * cs + 1, row * cs + 1, cs - 1, cs - 1);
        }
      }
    }
    ctx.fill();
  }, [canvasRef, engineRef, cellSize]);

  return { draw };
}
