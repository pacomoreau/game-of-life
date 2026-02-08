type Props = {
  speed: number;
  onChange: (speed: number) => void;
};

export function SpeedSlider({ speed, onChange }: Props) {
  return (
    <div className="slider-control">
      <div className="slider-label">
        <span>Vitesse</span>
        <span className="slider-value">{speed} gen/s</span>
      </div>
      <input
        type="range"
        min={1}
        max={60}
        value={speed}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
