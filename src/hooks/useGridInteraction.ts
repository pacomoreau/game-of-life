import { useEffect, useRef, type MutableRefObject } from 'react';
import { GameEngine } from '../engine/GameEngine';
import type { DrawMode } from '../types/game';

export function useGridInteraction(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  engineRef: MutableRefObject<GameEngine>,
  cellSize: number,
  onChange: () => void,
) {
  const drawModeRef = useRef<DrawMode | null>(null);
  const lastCellRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCellFromEvent = (e: MouseEvent | Touch): [number, number] => {
      const rect = canvas.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) / cellSize);
      const row = Math.floor((e.clientY - rect.top) / cellSize);
      return [row, col];
    };

    const applyCell = (row: number, col: number) => {
      const key = `${row},${col}`;
      if (key === lastCellRef.current) return;
      lastCellRef.current = key;

      const engine = engineRef.current;
      if (row < 0 || row >= engine.rows || col < 0 || col >= engine.cols) return;

      if (drawModeRef.current === 'draw') {
        engine.setCell(row, col, 1);
      } else {
        engine.setCell(row, col, 0);
      }
      onChange();
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const [row, col] = getCellFromEvent(e);
      const engine = engineRef.current;
      if (row < 0 || row >= engine.rows || col < 0 || col >= engine.cols) return;
      drawModeRef.current = engine.getCell(row, col) ? 'erase' : 'draw';
      lastCellRef.current = null;
      applyCell(row, col);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (drawModeRef.current === null) return;
      const [row, col] = getCellFromEvent(e);
      applyCell(row, col);
    };

    const onMouseUp = () => {
      drawModeRef.current = null;
      lastCellRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const [row, col] = getCellFromEvent(touch);
      const engine = engineRef.current;
      if (row < 0 || row >= engine.rows || col < 0 || col >= engine.cols) return;
      drawModeRef.current = engine.getCell(row, col) ? 'erase' : 'draw';
      lastCellRef.current = null;
      applyCell(row, col);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (drawModeRef.current === null) return;
      const touch = e.touches[0];
      const [row, col] = getCellFromEvent(touch);
      applyCell(row, col);
    };

    const onTouchEnd = () => {
      drawModeRef.current = null;
      lastCellRef.current = null;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [canvasRef, engineRef, cellSize, onChange]);
}
