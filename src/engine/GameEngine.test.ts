import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './GameEngine';

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(10, 10);
  });

  describe('constructor', () => {
    it('creates grid with correct dimensions', () => {
      expect(engine.cols).toBe(10);
      expect(engine.rows).toBe(10);
      expect(engine.current.length).toBe(100);
      expect(engine.next.length).toBe(100);
    });

    it('initializes all cells as dead', () => {
      for (let i = 0; i < engine.current.length; i++) {
        expect(engine.current[i]).toBe(0);
      }
    });

    it('starts at generation 0', () => {
      expect(engine.generation).toBe(0);
    });
  });

  describe('setCell / getCell', () => {
    it('sets and gets a cell value', () => {
      engine.setCell(3, 4, 1);
      expect(engine.getCell(3, 4)).toBe(1);
    });

    it('ignores out-of-bounds set', () => {
      engine.setCell(-1, 0, 1);
      engine.setCell(0, -1, 1);
      engine.setCell(10, 0, 1);
      engine.setCell(0, 10, 1);
      expect(engine.getPopulation()).toBe(0);
    });

    it('returns 0 for out-of-bounds get', () => {
      expect(engine.getCell(-1, 0)).toBe(0);
      expect(engine.getCell(0, 10)).toBe(0);
    });
  });

  describe('step - Game of Life rules', () => {
    it('kills a lonely cell (< 2 neighbors)', () => {
      engine.setCell(5, 5, 1);
      engine.step();
      expect(engine.getCell(5, 5)).toBe(0);
    });

    it('kills a cell with 1 neighbor (underpopulation)', () => {
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);
      engine.step();
      expect(engine.getCell(5, 5)).toBe(0);
      expect(engine.getCell(5, 6)).toBe(0);
    });

    it('keeps a cell alive with 2 neighbors', () => {
      // Horizontal line of 3 (blinker)
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);
      engine.step();
      // Center cell should survive (2 neighbors)
      expect(engine.getCell(5, 5)).toBe(1);
    });

    it('keeps a cell alive with 3 neighbors', () => {
      engine.setCell(4, 5, 1);
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);
      engine.step();
      expect(engine.getCell(5, 5)).toBe(1);
    });

    it('kills a cell with > 3 neighbors (overpopulation)', () => {
      engine.setCell(4, 5, 1);
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);
      engine.setCell(6, 5, 1);
      engine.step();
      expect(engine.getCell(5, 5)).toBe(0);
    });

    it('births a dead cell with exactly 3 neighbors', () => {
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);
      engine.step();
      // Cells above and below center should be born
      expect(engine.getCell(4, 5)).toBe(1);
      expect(engine.getCell(6, 5)).toBe(1);
    });

    it('increments generation', () => {
      engine.step();
      expect(engine.generation).toBe(1);
      engine.step();
      expect(engine.generation).toBe(2);
    });
  });

  describe('blinker oscillator', () => {
    it('oscillates between horizontal and vertical', () => {
      // Horizontal blinker
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);

      engine.step();

      // Should become vertical
      expect(engine.getCell(4, 5)).toBe(1);
      expect(engine.getCell(5, 5)).toBe(1);
      expect(engine.getCell(6, 5)).toBe(1);
      expect(engine.getCell(5, 4)).toBe(0);
      expect(engine.getCell(5, 6)).toBe(0);

      engine.step();

      // Should become horizontal again
      expect(engine.getCell(5, 4)).toBe(1);
      expect(engine.getCell(5, 5)).toBe(1);
      expect(engine.getCell(5, 6)).toBe(1);
      expect(engine.getCell(4, 5)).toBe(0);
      expect(engine.getCell(6, 5)).toBe(0);
    });
  });

  describe('block still life', () => {
    it('remains unchanged', () => {
      engine.setCell(4, 4, 1);
      engine.setCell(4, 5, 1);
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);

      engine.step();

      expect(engine.getCell(4, 4)).toBe(1);
      expect(engine.getCell(4, 5)).toBe(1);
      expect(engine.getCell(5, 4)).toBe(1);
      expect(engine.getCell(5, 5)).toBe(1);
      expect(engine.getPopulation()).toBe(4);
    });
  });

  describe('toroidal wrapping', () => {
    it('wraps around horizontally', () => {
      const e = new GameEngine(5, 5);
      e.setCell(2, 0, 1);
      e.setCell(2, 4, 1);
      e.setCell(2, 3, 1);
      e.step();
      // Cell at (2,4) has neighbors at (2,3) and (2,0) wrapping
      expect(e.getCell(2, 4)).toBe(1);
    });

    it('wraps around vertically', () => {
      const e = new GameEngine(5, 5);
      e.setCell(0, 2, 1);
      e.setCell(4, 2, 1);
      e.setCell(4, 1, 1);
      e.step();
      expect(e.getCell(4, 2)).toBe(1);
    });
  });

  describe('reset', () => {
    it('clears all cells and resets generation', () => {
      engine.setCell(3, 3, 1);
      engine.setCell(4, 4, 1);
      engine.step();
      engine.reset();

      expect(engine.generation).toBe(0);
      expect(engine.getPopulation()).toBe(0);
      for (let i = 0; i < engine.current.length; i++) {
        expect(engine.current[i]).toBe(0);
      }
    });
  });

  describe('randomize', () => {
    it('fills cells with given density', () => {
      engine.randomize(0.5);
      const pop = engine.getPopulation();
      // With 100 cells and 50% density, expect roughly 30-70 alive
      expect(pop).toBeGreaterThan(10);
      expect(pop).toBeLessThan(90);
    });

    it('resets generation to 0', () => {
      engine.step();
      engine.step();
      engine.randomize(0.3);
      expect(engine.generation).toBe(0);
    });

    it('density 0 produces empty grid', () => {
      engine.randomize(0);
      expect(engine.getPopulation()).toBe(0);
    });

    it('density 1 fills all cells', () => {
      engine.randomize(1);
      expect(engine.getPopulation()).toBe(100);
    });
  });

  describe('resize', () => {
    it('preserves existing cells when growing', () => {
      engine.setCell(0, 0, 1);
      engine.setCell(5, 5, 1);
      engine.resize(20, 20);

      expect(engine.cols).toBe(20);
      expect(engine.rows).toBe(20);
      expect(engine.getCell(0, 0)).toBe(1);
      expect(engine.getCell(5, 5)).toBe(1);
    });

    it('clips cells when shrinking', () => {
      engine.setCell(9, 9, 1);
      engine.setCell(2, 2, 1);
      engine.resize(5, 5);

      expect(engine.cols).toBe(5);
      expect(engine.rows).toBe(5);
      expect(engine.getCell(2, 2)).toBe(1);
      expect(engine.getCell(9, 9)).toBe(0); // out of bounds
    });
  });

  describe('getPopulation', () => {
    it('returns 0 for empty grid', () => {
      expect(engine.getPopulation()).toBe(0);
    });

    it('counts alive cells correctly', () => {
      engine.setCell(0, 0, 1);
      engine.setCell(1, 1, 1);
      engine.setCell(2, 2, 1);
      expect(engine.getPopulation()).toBe(3);
    });
  });

  describe('loadPattern', () => {
    it('loads a pattern at given origin', () => {
      const glider: [number, number][] = [[0, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
      engine.loadPattern(glider, 0, 0);

      expect(engine.getCell(0, 1)).toBe(1);
      expect(engine.getCell(1, 2)).toBe(1);
      expect(engine.getCell(2, 0)).toBe(1);
      expect(engine.getCell(2, 1)).toBe(1);
      expect(engine.getCell(2, 2)).toBe(1);
      expect(engine.getPopulation()).toBe(5);
    });

    it('wraps pattern around edges', () => {
      const cells: [number, number][] = [[0, 0]];
      engine.loadPattern(cells, 9, 9);
      // (9+0) % 10 = 9, (9+0) % 10 = 9
      expect(engine.getCell(9, 9)).toBe(1);
    });

    it('loads pattern with offset', () => {
      const cells: [number, number][] = [[0, 0], [1, 1]];
      engine.loadPattern(cells, 3, 4);
      expect(engine.getCell(3, 4)).toBe(1);
      expect(engine.getCell(4, 5)).toBe(1);
    });
  });

  describe('glider movement', () => {
    it('moves diagonally after 4 steps', () => {
      const e = new GameEngine(20, 20);
      // Standard glider
      e.setCell(0, 1, 1);
      e.setCell(1, 2, 1);
      e.setCell(2, 0, 1);
      e.setCell(2, 1, 1);
      e.setCell(2, 2, 1);

      // After 4 generations, glider shifts down-right by 1
      for (let i = 0; i < 4; i++) e.step();

      expect(e.getCell(1, 2)).toBe(1);
      expect(e.getCell(2, 3)).toBe(1);
      expect(e.getCell(3, 1)).toBe(1);
      expect(e.getCell(3, 2)).toBe(1);
      expect(e.getCell(3, 3)).toBe(1);
      expect(e.generation).toBe(4);
    });
  });
});
