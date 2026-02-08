# Game of Life

An implementation of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) using React, TypeScript and HTML5 Canvas.

## Features

- High-performance Canvas rendering with batch drawing
- Toroidal grid (edges wrap around)
- Draw cells by clicking and dragging (mouse + touch)
- 10 preset patterns (Glider, Gosper Glider Gun, Pulsar, LWSS, R-Pentomino, etc.)
- Simulation speed control (1 to 60 generations/s)
- Adjustable zoom (cell size from 4 to 32px)
- Generation and population counters
- Dark mode
- Keyboard shortcuts: `Space` (play/pause), `N` (step), `C` (reset), `R` (randomize)

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- Canvas 2D for rendering
- [Vitest](https://vitest.dev/) for testing

## Getting started

```bash
yarn install
yarn dev
```

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Development server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build |
| `yarn test` | Run tests |
| `yarn test:watch` | Run tests in watch mode |
| `yarn lint` | Lint code |

## Architecture

```
src/
  engine/
    GameEngine.ts       Simulation engine (Uint8Array double buffer)
    patterns.ts         Preset pattern definitions
  hooks/
    useCanvasRenderer   Canvas rendering with ResizeObserver
    useGameLoop         requestAnimationFrame loop
    useGridInteraction  Mouse/touch drawing handler
  components/
    GameCanvas.tsx      Canvas wrapper
    Sidebar.tsx         Control panel
    controls/           Buttons, sliders, selectors
  types/
    game.ts             Shared types
```

## Performance

- `Uint8Array` double buffer for the grid (zero allocation per generation)
- Batch drawing: single `fill()` call for all alive cells
- Game engine stored in a `useRef` (no React re-render per generation)
- Simulation tick decoupled from render framerate

## License

[MIT](./LICENSE)
