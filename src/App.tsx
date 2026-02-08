import { useState, useRef, useCallback, useEffect } from 'react';
import { GameEngine } from './engine/GameEngine';
import { PATTERNS } from './engine/patterns';
import { GameCanvas } from './components/GameCanvas';
import { Sidebar } from './components/Sidebar';
import './App.css';

const INITIAL_CELL_SIZE = 10;
const INITIAL_SPEED = 10;

function App() {
  const engineRef = useRef(new GameEngine(1, 1));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [cellSize, setCellSize] = useState(INITIAL_CELL_SIZE);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);

  const updateStats = useCallback(() => {
    setGeneration(engineRef.current.generation);
    setPopulation(engineRef.current.getPopulation());
  }, []);

  const handleResize = useCallback((cols: number, rows: number) => {
    engineRef.current.resize(cols, rows);
  }, []);

  const handleToggleRunning = useCallback(() => {
    setRunning((r) => !r);
  }, []);

  const handleStep = useCallback(() => {
    engineRef.current.step();
    updateStats();
  }, [updateStats]);

  const handleReset = useCallback(() => {
    setRunning(false);
    engineRef.current.reset();
    updateStats();
  }, [updateStats]);

  const handleRandomize = useCallback(() => {
    engineRef.current.randomize(0.3);
    updateStats();
  }, [updateStats]);

  const handlePatternSelect = useCallback(
    (index: number) => {
      const pattern = PATTERNS[index];
      if (!pattern) return;
      const engine = engineRef.current;
      const originRow = Math.floor(engine.rows / 2 - 5);
      const originCol = Math.floor(engine.cols / 2 - 5);
      engine.loadPattern(pattern.cells, originRow, originCol);
      updateStats();
    },
    [updateStats],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setRunning((r) => !r);
          break;
        case 'KeyN':
          if (!running) {
            engineRef.current.step();
            updateStats();
          }
          break;
        case 'KeyC':
          setRunning(false);
          engineRef.current.reset();
          updateStats();
          break;
        case 'KeyR':
          if (!running) {
            engineRef.current.randomize(0.3);
            updateStats();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [running, updateStats]);

  return (
    <div className="app">
      <GameCanvas
        engineRef={engineRef}
        cellSize={cellSize}
        running={running}
        speed={speed}
        onResize={handleResize}
        onTick={updateStats}
        onChange={updateStats}
      />
      <Sidebar
        running={running}
        speed={speed}
        cellSize={cellSize}
        generation={generation}
        population={population}
        onToggleRunning={handleToggleRunning}
        onStep={handleStep}
        onReset={handleReset}
        onRandomize={handleRandomize}
        onSpeedChange={setSpeed}
        onCellSizeChange={setCellSize}
        onPatternSelect={handlePatternSelect}
      />
    </div>
  );
}

export default App;
