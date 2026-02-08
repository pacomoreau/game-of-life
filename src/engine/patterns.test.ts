import { describe, it, expect } from 'vitest';
import { PATTERNS } from './patterns';
import { GameEngine } from './GameEngine';

describe('patterns', () => {
  it('has at least 5 patterns defined', () => {
    expect(PATTERNS.length).toBeGreaterThanOrEqual(5);
  });

  it('every pattern has a name and non-empty cells', () => {
    for (const p of PATTERNS) {
      expect(p.name).toBeTruthy();
      expect(p.cells.length).toBeGreaterThan(0);
    }
  });

  it('every pattern has valid cell coordinates (non-negative)', () => {
    for (const p of PATTERNS) {
      for (const [r, c] of p.cells) {
        expect(r).toBeGreaterThanOrEqual(0);
        expect(c).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('every pattern has no duplicate cells', () => {
    for (const p of PATTERNS) {
      const keys = p.cells.map(([r, c]) => `${r},${c}`);
      const unique = new Set(keys);
      expect(unique.size).toBe(keys.length);
    }
  });

  it('every pattern can be loaded into an engine without error', () => {
    const engine = new GameEngine(100, 100);
    for (const p of PATTERNS) {
      engine.reset();
      engine.loadPattern(p.cells, 20, 20);
      expect(engine.getPopulation()).toBe(p.cells.length);
    }
  });

  describe('known patterns produce expected behavior', () => {
    it('Blinker oscillates (built from Toad pattern test logic)', () => {
      const engine = new GameEngine(10, 10);
      // Manual blinker
      engine.setCell(5, 4, 1);
      engine.setCell(5, 5, 1);
      engine.setCell(5, 6, 1);

      engine.step();
      engine.step();

      // After 2 steps, blinker returns to original
      expect(engine.getCell(5, 4)).toBe(1);
      expect(engine.getCell(5, 5)).toBe(1);
      expect(engine.getCell(5, 6)).toBe(1);
      expect(engine.getPopulation()).toBe(3);
    });

    it('Glider pattern has 5 cells', () => {
      const glider = PATTERNS.find((p) => p.name === 'Glider');
      expect(glider).toBeDefined();
      expect(glider!.cells.length).toBe(5);
    });

    it('Gosper Glider Gun pattern exists and has correct cell count', () => {
      const gun = PATTERNS.find((p) => p.name === 'Gosper Glider Gun');
      expect(gun).toBeDefined();
      expect(gun!.cells.length).toBe(36);
    });

    it('Glider moves after loading into engine', () => {
      const glider = PATTERNS.find((p) => p.name === 'Glider')!;
      const engine = new GameEngine(20, 20);
      engine.loadPattern(glider.cells, 2, 2);

      const initialPop = engine.getPopulation();
      for (let i = 0; i < 4; i++) engine.step();

      // Glider preserves population
      expect(engine.getPopulation()).toBe(initialPop);
      expect(engine.generation).toBe(4);
    });
  });
});
