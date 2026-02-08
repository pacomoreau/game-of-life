type Props = {
  generation: number;
};

export function GenerationCounter({ generation }: Props) {
  return (
    <div className="stat">
      <div className="stat-value">{generation.toLocaleString()}</div>
      <div className="stat-label">Generation</div>
    </div>
  );
}
