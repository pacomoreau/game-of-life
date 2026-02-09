type Props = {
  cellSize: number;
  onChange: (size: number) => void;
};

export function CellSizeSlider({ cellSize, onChange }: Props) {
  return (
    <div className="slider-control">
      <div className="slider-label">
        <span>Cell size</span>
        <span className="slider-value">{cellSize}px</span>
      </div>
      <input
        type="range"
        min={4}
        max={32}
        value={cellSize}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
