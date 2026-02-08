import { PlayPauseButton } from './controls/PlayPauseButton';
import { StepButton } from './controls/StepButton';
import { ResetButton } from './controls/ResetButton';
import { RandomizeButton } from './controls/RandomizeButton';
import { SpeedSlider } from './controls/SpeedSlider';
import { CellSizeSlider } from './controls/CellSizeSlider';
import { PatternSelector } from './controls/PatternSelector';
import { GenerationCounter } from './controls/GenerationCounter';
import { PopulationCounter } from './controls/PopulationCounter';

type SidebarProps = {
  running: boolean;
  speed: number;
  cellSize: number;
  generation: number;
  population: number;
  onToggleRunning: () => void;
  onStep: () => void;
  onReset: () => void;
  onRandomize: () => void;
  onSpeedChange: (speed: number) => void;
  onCellSizeChange: (size: number) => void;
  onPatternSelect: (index: number) => void;
};

export function Sidebar({
  running,
  speed,
  cellSize,
  generation,
  population,
  onToggleRunning,
  onStep,
  onReset,
  onRandomize,
  onSpeedChange,
  onCellSizeChange,
  onPatternSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Game of Life</h2>

      <div className="stats">
        <GenerationCounter generation={generation} />
        <PopulationCounter population={population} />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3>Simulation</h3>
        <PlayPauseButton running={running} onToggle={onToggleRunning} />
        <div className="btn-row">
          <StepButton disabled={running} onStep={onStep} />
          <ResetButton onReset={onReset} />
        </div>
        <RandomizeButton disabled={running} onRandomize={onRandomize} />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3>Parametres</h3>
        <SpeedSlider speed={speed} onChange={onSpeedChange} />
        <CellSizeSlider cellSize={cellSize} onChange={onCellSizeChange} />
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-section">
        <h3>Patterns</h3>
        <PatternSelector disabled={running} onSelect={onPatternSelect} />
      </div>

      <div className="keyboard-hints">
        <div className="keyboard-hint">
          <span>Play / Pause</span>
          <kbd>Space</kbd>
        </div>
        <div className="keyboard-hint">
          <span>Step</span>
          <kbd>N</kbd>
        </div>
        <div className="keyboard-hint">
          <span>Reset</span>
          <kbd>C</kbd>
        </div>
        <div className="keyboard-hint">
          <span>Randomize</span>
          <kbd>R</kbd>
        </div>
      </div>
    </aside>
  );
}
