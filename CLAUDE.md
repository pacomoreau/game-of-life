# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev            # Start Vite dev server (port 5173)
yarn build          # TypeScript check + Vite production build (tsc -b && vite build)
yarn test           # Run tests once
yarn test:watch     # Run tests in watch mode
yarn lint           # ESLint
```

Run a single test file: `yarn vitest run src/engine/GameEngine.test.ts`

## Architecture

Conway's Game of Life built with React, TypeScript, and Canvas 2D.

**Three layers, strictly separated:**

1. **Engine (`src/engine/`)** — Pure TypeScript, zero React dependencies. `GameEngine` is a stateful class holding two `Uint8Array` flat buffers (double-buffer swap, zero allocation per generation). Toroidal wrapping via modulo. `patterns.ts` defines preset configurations as `[row, col][]` offsets.

2. **Hooks (`src/hooks/`)** — Three custom hooks that each own one concern:
   - `useCanvasRenderer`: batch-draws all alive cells in a single `fill()` call, manages ResizeObserver
   - `useGameLoop`: `requestAnimationFrame` loop with simulation tick rate decoupled from render framerate
   - `useGridInteraction`: mouse/touch click-drag with draw/erase mode detection

3. **Components (`src/components/`)** — Thin presentational components. `GameCanvas` wires the three hooks together. `Sidebar` composes small control components. `App.tsx` holds all state and passes props/callbacks down.

**Key performance decision:** `GameEngine` lives in a `useRef` (never in React state). Only `generation` and `population` counters trigger React re-renders via `setState` in the game loop's `onTick` callback.

## Conventions

- Use `type` (not `interface`) for all type definitions
- Use `import type { ... }` for type-only imports (required by `verbatimModuleSyntax`)
- Test files colocated with source: `GameEngine.test.ts` next to `GameEngine.ts`
- Ref variables suffixed with `Ref` (engineRef, canvasRef, ctxRef)
- Constants in UPPER_CASE (PATTERNS, INITIAL_SPEED)
- CSS uses custom properties defined in `index.css` (`--bg-primary`, `--accent`, etc.)
